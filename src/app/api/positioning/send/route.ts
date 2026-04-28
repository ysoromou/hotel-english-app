import { NextRequest, NextResponse } from 'next/server'
import {
  POSITIONING_DEFAULT_DEADLINE_DAYS,
  POSITIONING_LINK_EXPIRY_HOURS,
} from '@/lib/positioning/config'
import { getManagerRequestAccess } from '@/lib/positioning/access'
import { buildInviteMessage, dispatchWhatsAppMessage } from '@/lib/positioning/messages'
import { ParticipantRow, TestAttemptRow, TestInviteRow } from '@/lib/positioning/types'
import { generateAccessToken, sha256 } from '@/lib/positioning/utils'
import { buildAccessUrl } from '@/lib/positioning/access'

type SendMode = 'send_all' | 'resend_non_started' | 'resend_incomplete' | 'send_selected'

function getDefaultDeadline(deadlineAt: string | null) {
  if (deadlineAt) return deadlineAt
  const date = new Date()
  date.setDate(date.getDate() + POSITIONING_DEFAULT_DEADLINE_DAYS)
  date.setHours(23, 59, 0, 0)
  return date.toISOString()
}

function getTargets({
  participants,
  invites,
  attempts,
  mode,
  selectedIds,
}: {
  participants: ParticipantRow[]
  invites: TestInviteRow[]
  attempts: TestAttemptRow[]
  mode: SendMode
  selectedIds: Set<string>
}) {
  const inviteMap = new Map(invites.map((invite) => [invite.participant_id, invite]))
  const attemptMap = new Map(attempts.map((attempt) => [attempt.participant_id, attempt]))

  return participants.filter((participant) => {
    const invite = inviteMap.get(participant.id)
    const attempt = attemptMap.get(participant.id)

    if (!invite || attempt?.status === 'completed') return false

    if (mode === 'send_selected') return selectedIds.has(participant.id)
    if (mode === 'send_all') return invite.status === 'not_sent'
    if (mode === 'resend_non_started') return !attempt?.started_at && ['sent', 'opened', 'expired'].includes(invite.status)
    if (mode === 'resend_incomplete') return attempt?.status === 'in_progress'

    return false
  })
}

function getUpdatedInviteState({
  invite,
  attempt,
  dispatchedAt,
  expiresAt,
  deadlineAt,
  tokenHash,
}: {
  invite: TestInviteRow
  attempt: TestAttemptRow | undefined
  dispatchedAt: string
  expiresAt: string
  deadlineAt: string
  tokenHash: string
}) {
  const isReminder = invite.status !== 'not_sent'

  let nextStatus: TestInviteRow['status'] = 'sent'
  if (attempt?.status === 'completed' || invite.status === 'completed') {
    nextStatus = 'completed'
  } else if (attempt?.status === 'in_progress' || invite.status === 'started') {
    nextStatus = 'started'
  } else if (invite.status === 'opened') {
    nextStatus = 'opened'
  } else {
    nextStatus = 'sent'
  }

  return {
    token_hash: tokenHash,
    expires_at: expiresAt,
    deadline_at: deadlineAt,
    status: nextStatus,
    sent_at: invite.sent_at || dispatchedAt,
    last_reminder_at: isReminder ? dispatchedAt : null,
    access_version: (invite.access_version || 1) + (isReminder ? 1 : 0),
  }
}

export async function POST(request: NextRequest) {
  const { supabase, userId, allowed } = await getManagerRequestAccess()

  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  if (!allowed) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = (await request.json()) as {
    mode?: SendMode
    participantIds?: string[]
    deadlineAt?: string | null
  }

  const mode = body.mode || 'send_all'
  const selectedIds = new Set(body.participantIds || [])

  const [{ data: participants }, { data: invites }, { data: attempts }] = await Promise.all([
    supabase.from('participants').select('*').order('created_at', { ascending: false }),
    supabase.from('test_invites').select('*'),
    supabase.from('test_attempts').select('*'),
  ])

  const inviteMap = new Map((invites || []).map((invite) => [invite.participant_id, invite as TestInviteRow]))
  const targetParticipants = getTargets({
    participants: (participants || []) as ParticipantRow[],
    invites: (invites || []) as TestInviteRow[],
    attempts: (attempts || []) as TestAttemptRow[],
    mode,
    selectedIds,
  })

  const results: Array<{
    participantId: string
    fullName: string
    status: string
    provider: string
    deliveryUrl?: string
    errorMessage?: string
  }> = []

  for (const participant of targetParticipants) {
    const invite = inviteMap.get(participant.id)
    const attempt = (attempts || []).find((item) => item.participant_id === participant.id) as TestAttemptRow | undefined
    if (!invite) continue

    const rawToken = generateAccessToken()
    const accessUrl = buildAccessUrl(rawToken, request.nextUrl.origin)
    const expiresAt = new Date(Date.now() + POSITIONING_LINK_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
    const deadlineAt = getDefaultDeadline(body.deadlineAt ?? invite.deadline_at)
    const dispatchedAt = new Date().toISOString()
    const messageBody = buildInviteMessage({
      participant,
      accessUrl,
      deadlineAt,
    })

    const dispatchResult = await dispatchWhatsAppMessage({
      phone: participant.normalized_phone || participant.phone,
      message: messageBody,
    })

    await supabase.from('outbound_messages').insert({
      participant_id: participant.id,
      invite_id: invite.id,
      channel: 'whatsapp',
      destination: participant.normalized_phone || participant.phone,
      message_body: messageBody,
      provider: dispatchResult.provider,
      message_kind: invite.status === 'not_sent' ? 'invite' : 'reminder',
      status: dispatchResult.status,
      provider_message_id: dispatchResult.providerMessageId || null,
      provider_payload: dispatchResult.deliveryUrl ? { deliveryUrl: dispatchResult.deliveryUrl } : {},
      sent_at: dispatchResult.status === 'sent' ? new Date().toISOString() : null,
      error_message: dispatchResult.errorMessage || null,
    })

    if (dispatchResult.status !== 'failed') {
      await supabase
        .from('test_invites')
        .update(
          getUpdatedInviteState({
            invite,
            attempt,
            dispatchedAt,
            expiresAt,
            deadlineAt,
            tokenHash: sha256(rawToken),
          }),
        )
        .eq('id', invite.id)

      await supabase
        .from('participants')
        .update({
          status:
            attempt?.status === 'in_progress'
              ? 'in_progress'
              : invite.status === 'opened'
                ? 'opened'
                : invite.status === 'completed'
                  ? 'completed'
                  : 'invited',
        })
        .eq('id', participant.id)
    }

    results.push({
      participantId: participant.id,
      fullName: participant.full_name,
      status: dispatchResult.status,
      provider: dispatchResult.provider,
      deliveryUrl: dispatchResult.deliveryUrl,
      errorMessage: dispatchResult.errorMessage,
    })
  }

  return NextResponse.json({
    queuedCount: results.length,
    results,
  })
}
