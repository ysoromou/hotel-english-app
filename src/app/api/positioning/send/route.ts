import { NextRequest, NextResponse } from 'next/server'
import {
  POSITIONING_DEFAULT_DEADLINE_DAYS,
  POSITIONING_LINK_EXPIRY_HOURS,
} from '@/lib/positioning/config'
import { buildAccessUrl } from '@/lib/positioning/access'
import { getManagerRequestAccess } from '@/lib/positioning/access'
import { buildInviteMessage, dispatchWhatsAppMessage } from '@/lib/positioning/messages'
import { ParticipantRow, TestAttemptRow, TestInviteRow } from '@/lib/positioning/types'
import { generateAccessToken, sha256 } from '@/lib/positioning/utils'

type SendMode =
  | 'send_all'
  | 'resend_non_started'
  | 'resend_incomplete'
  | 'send_selected'
  | 'mark_sent'

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
  mode: Exclude<SendMode, 'mark_sent'>
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
    if (mode === 'resend_non_started') {
      return !attempt?.started_at && ['sent', 'opened', 'expired'].includes(invite.status)
    }
    if (mode === 'resend_incomplete') return attempt?.status === 'in_progress'

    return false
  })
}

function getUpdatedInviteStateAfterPreparation({
  invite,
  expiresAt,
  deadlineAt,
  tokenHash,
}: {
  invite: TestInviteRow
  expiresAt: string
  deadlineAt: string
  tokenHash: string
}) {
  return {
    token_hash: tokenHash,
    expires_at: expiresAt,
    deadline_at: deadlineAt,
    access_version: (invite.access_version || 1) + 1,
  }
}

function getUpdatedInviteStateAfterManualConfirmation({
  invite,
  attempt,
  dispatchedAt,
}: {
  invite: TestInviteRow
  attempt: TestAttemptRow | undefined
  dispatchedAt: string
}) {
  const isReminder = invite.status !== 'not_sent'

  let nextStatus: TestInviteRow['status'] = 'sent'
  if (attempt?.status === 'completed' || invite.status === 'completed') {
    nextStatus = 'completed'
  } else if (attempt?.status === 'in_progress' || invite.status === 'started') {
    nextStatus = 'started'
  } else if (invite.status === 'opened') {
    nextStatus = 'opened'
  }

  return {
    status: nextStatus,
    sent_at: invite.sent_at || dispatchedAt,
    last_reminder_at: isReminder ? dispatchedAt : invite.last_reminder_at,
  }
}

function getParticipantStatusAfterSend(inviteStatus: TestInviteRow['status'], attempt?: TestAttemptRow) {
  if (attempt?.status === 'completed' || inviteStatus === 'completed') return 'completed'
  if (attempt?.status === 'in_progress' || inviteStatus === 'started') return 'in_progress'
  if (inviteStatus === 'opened') return 'opened'
  return 'invited'
}

export async function POST(request: NextRequest) {
  const { supabase, userId, allowed } = await getManagerRequestAccess()

  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
  }
  if (!allowed) {
    return NextResponse.json({ error: 'Acces refuse' }, { status: 403 })
  }

  const body = (await request.json()) as {
    mode?: SendMode
    participantIds?: string[]
    participantId?: string
    messageId?: string
    deadlineAt?: string | null
  }

  const mode = body.mode || 'send_all'
  const selectedIds = new Set(body.participantIds || [])

  const [{ data: participants }, { data: invites }, { data: attempts }] = await Promise.all([
    supabase.from('participants').select('*').order('created_at', { ascending: false }),
    supabase.from('test_invites').select('*'),
    supabase.from('test_attempts').select('*'),
  ])

  const participantRows = (participants || []) as ParticipantRow[]
  const inviteRows = (invites || []) as TestInviteRow[]
  const attemptRows = (attempts || []) as TestAttemptRow[]
  const inviteMap = new Map(inviteRows.map((invite) => [invite.participant_id, invite]))
  const attemptMap = new Map(attemptRows.map((attempt) => [attempt.participant_id, attempt]))

  if (mode === 'mark_sent') {
    const participantId = body.participantId || body.participantIds?.[0]
    if (!participantId) {
      return NextResponse.json({ error: 'Participant manquant.' }, { status: 400 })
    }

    const participant = participantRows.find((row) => row.id === participantId)
    const invite = inviteMap.get(participantId)
    const attempt = attemptMap.get(participantId)
    if (!participant || !invite) {
      return NextResponse.json({ error: 'Invitation introuvable.' }, { status: 404 })
    }

    let messageQuery = supabase
      .from('outbound_messages')
      .select('*')
      .eq('participant_id', participantId)
      .eq('status', 'prepared')
      .order('created_at', { ascending: false })
      .limit(1)

    if (body.messageId) {
      messageQuery = supabase
        .from('outbound_messages')
        .select('*')
        .eq('id', body.messageId)
        .eq('participant_id', participantId)
        .limit(1)
    }

    const { data: preparedMessages, error: messageError } = await messageQuery
    if (messageError) {
      return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    const message = preparedMessages?.[0]
    if (!message) {
      return NextResponse.json({ error: 'Aucun message prepare a confirmer.' }, { status: 404 })
    }

    const dispatchedAt = new Date().toISOString()
    const { error: updateMessageError } = await supabase
      .from('outbound_messages')
      .update({
        status: 'sent',
        sent_at: dispatchedAt,
      })
      .eq('id', message.id)

    if (updateMessageError) {
      return NextResponse.json({ error: updateMessageError.message }, { status: 500 })
    }

    const nextInviteState = getUpdatedInviteStateAfterManualConfirmation({
      invite,
      attempt,
      dispatchedAt,
    })

    await supabase.from('test_invites').update(nextInviteState).eq('id', invite.id)
    await supabase
      .from('participants')
      .update({
        status: getParticipantStatusAfterSend(nextInviteState.status, attempt),
      })
      .eq('id', participant.id)

    const deliveryUrl =
      message.provider_payload &&
      typeof message.provider_payload === 'object' &&
      !Array.isArray(message.provider_payload) &&
      typeof (message.provider_payload as Record<string, unknown>).deliveryUrl === 'string'
        ? ((message.provider_payload as Record<string, unknown>).deliveryUrl as string)
        : undefined

    return NextResponse.json({
      results: [
        {
          participantId: participant.id,
          fullName: participant.full_name,
          status: 'sent',
          provider: message.provider,
          deliveryUrl,
          messageBody: message.message_body,
          messageId: message.id,
        },
      ],
    })
  }

  const targetParticipants = getTargets({
    participants: participantRows,
    invites: inviteRows,
    attempts: attemptRows,
    mode,
    selectedIds,
  })

  const results: Array<{
    participantId: string
    fullName: string
    status: string
    provider: string
    deliveryUrl?: string
    messageBody?: string
    messageId?: string
    errorMessage?: string
  }> = []

  for (const participant of targetParticipants) {
    const invite = inviteMap.get(participant.id)
    const attempt = attemptMap.get(participant.id)
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

    const { data: insertedMessage, error: outboundError } = await supabase
      .from('outbound_messages')
      .insert({
        participant_id: participant.id,
        invite_id: invite.id,
        channel: 'whatsapp',
        destination: participant.normalized_phone || participant.phone,
        message_body: messageBody,
        provider: dispatchResult.provider,
        message_kind: invite.status === 'not_sent' ? 'invite' : 'reminder',
        status: dispatchResult.status,
        provider_message_id: dispatchResult.providerMessageId || null,
        provider_payload: dispatchResult.deliveryUrl
          ? { deliveryUrl: dispatchResult.deliveryUrl, accessUrl }
          : { accessUrl },
        sent_at: dispatchResult.status === 'sent' ? dispatchedAt : null,
        error_message: dispatchResult.errorMessage || null,
      })
      .select('id')
      .single()

    if (outboundError) {
      results.push({
        participantId: participant.id,
        fullName: participant.full_name,
        status: 'failed',
        provider: dispatchResult.provider,
        errorMessage: outboundError.message,
      })
      continue
    }

    await supabase
      .from('test_invites')
      .update(
        getUpdatedInviteStateAfterPreparation({
          invite,
          expiresAt,
          deadlineAt,
          tokenHash: sha256(rawToken),
        }),
      )
      .eq('id', invite.id)

    if (dispatchResult.status === 'sent') {
      const nextInviteState = getUpdatedInviteStateAfterManualConfirmation({
        invite,
        attempt,
        dispatchedAt,
      })

      await supabase.from('test_invites').update(nextInviteState).eq('id', invite.id)
      await supabase
        .from('participants')
        .update({
          status: getParticipantStatusAfterSend(nextInviteState.status, attempt),
        })
        .eq('id', participant.id)
    }

    results.push({
      participantId: participant.id,
      fullName: participant.full_name,
      status: dispatchResult.status,
      provider: dispatchResult.provider,
      deliveryUrl: dispatchResult.deliveryUrl,
      messageBody,
      messageId: insertedMessage?.id,
      errorMessage: dispatchResult.errorMessage,
    })
  }

  return NextResponse.json({
    queuedCount: results.length,
    results,
  })
}
