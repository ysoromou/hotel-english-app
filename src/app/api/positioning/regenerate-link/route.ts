import { NextRequest, NextResponse } from 'next/server'
import {
  POSITIONING_DEFAULT_DEADLINE_DAYS,
  POSITIONING_LINK_EXPIRY_HOURS,
} from '@/lib/positioning/config'
import { buildAccessUrl, getManagerRequestAccess } from '@/lib/positioning/access'
import { buildInviteMessage, dispatchWhatsAppMessage } from '@/lib/positioning/messages'
import { ParticipantRow, TestAttemptRow, TestInviteRow } from '@/lib/positioning/types'
import { generateAccessToken, sha256 } from '@/lib/positioning/utils'

function getDefaultDeadline(deadlineAt: string | null) {
  if (deadlineAt) return deadlineAt
  const date = new Date()
  date.setDate(date.getDate() + POSITIONING_DEFAULT_DEADLINE_DAYS)
  date.setHours(23, 59, 0, 0)
  return date.toISOString()
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
    participantId?: string
    deadlineAt?: string | null
  }

  const participantId = body.participantId
  if (!participantId) {
    return NextResponse.json({ error: 'Participant manquant.' }, { status: 400 })
  }

  const { data: participant, error: participantError } = await supabase
    .from('participants')
    .select('*')
    .eq('id', participantId)
    .single()

  if (participantError || !participant) {
    return NextResponse.json({ error: 'Participant introuvable.' }, { status: 404 })
  }

  const typedParticipant = participant as ParticipantRow

  let { data: invite } = await supabase
    .from('test_invites')
    .select('*')
    .eq('participant_id', participantId)
    .maybeSingle()

  if (!invite) {
    const { data: createdInvite, error: createError } = await supabase
      .from('test_invites')
      .insert({ participant_id: participantId, status: 'not_sent' })
      .select('*')
      .single()
    if (createError || !createdInvite) {
      return NextResponse.json({ error: createError?.message || 'Impossible de creer l\'invitation.' }, { status: 500 })
    }
    invite = createdInvite
  }

  const typedInvite = invite as TestInviteRow

  const { data: attempt } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('participant_id', participantId)
    .maybeSingle()

  const typedAttempt = (attempt as TestAttemptRow | null) ?? null

  if (typedAttempt?.status === 'completed') {
    return NextResponse.json(
      { error: 'Ce participant a deja termine le test.' },
      { status: 400 },
    )
  }

  const rawToken = generateAccessToken()
  const accessUrl = buildAccessUrl(rawToken, request.nextUrl.origin)
  const expiresAt = new Date(Date.now() + POSITIONING_LINK_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
  const deadlineAt = getDefaultDeadline(body.deadlineAt ?? typedInvite.deadline_at)

  const messageBody = buildInviteMessage({
    participant: typedParticipant,
    accessUrl,
    deadlineAt,
  })

  const dispatchResult = await dispatchWhatsAppMessage({
    phone: typedParticipant.normalized_phone || typedParticipant.phone,
    message: messageBody,
  })

  const { data: insertedMessage, error: outboundError } = await supabase
    .from('outbound_messages')
    .insert({
      participant_id: typedParticipant.id,
      invite_id: typedInvite.id,
      channel: 'whatsapp',
      destination: typedParticipant.normalized_phone || typedParticipant.phone,
      message_body: messageBody,
      provider: dispatchResult.provider,
      message_kind: typedInvite.status === 'not_sent' ? 'invite' : 'reminder',
      status: dispatchResult.status,
      provider_message_id: dispatchResult.providerMessageId || null,
      provider_payload: dispatchResult.deliveryUrl
        ? { deliveryUrl: dispatchResult.deliveryUrl, accessUrl }
        : { accessUrl },
      sent_at: null,
      error_message: dispatchResult.errorMessage || null,
    })
    .select('id')
    .single()

  if (outboundError) {
    return NextResponse.json({ error: outboundError.message }, { status: 500 })
  }

  await supabase
    .from('test_invites')
    .update({
      token_hash: sha256(rawToken),
      expires_at: expiresAt,
      deadline_at: deadlineAt,
      access_version: (typedInvite.access_version || 1) + 1,
    })
    .eq('id', typedInvite.id)

  return NextResponse.json({
    participantId: typedParticipant.id,
    accessUrl,
    deliveryUrl: dispatchResult.deliveryUrl || null,
    messageBody,
    messageId: insertedMessage?.id || null,
    provider: dispatchResult.provider,
    status: dispatchResult.status,
  })
}
