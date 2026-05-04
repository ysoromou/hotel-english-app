import { NextRequest, NextResponse } from 'next/server'
import {
  POSITIONING_DEFAULT_DEADLINE_DAYS,
  POSITIONING_LINK_EXPIRY_HOURS,
} from '@/lib/positioning/config'
import { buildAccessUrl, getManagerRequestAccess } from '@/lib/positioning/access'
import {
  ParticipantRow,
  TestAttemptRow,
  TestInviteRow,
} from '@/lib/positioning/types'
import { generateAccessToken, sha256, toCsvValue } from '@/lib/positioning/utils'
import {
  SMS_TEST_NUMBER,
  SmsMessageKind,
  buildSmsBody,
  getSmsDestination,
  getSmsProviderConfig,
  isValidSmsPhone,
  sendOrangeSms,
} from '@/lib/positioning/sms'

type SmsAction = SmsMessageKind | 'export_csv'

function defaultDeadline(deadlineAt: string | null) {
  if (deadlineAt) return deadlineAt
  const date = new Date()
  date.setDate(date.getDate() + POSITIONING_DEFAULT_DEADLINE_DAYS)
  date.setHours(23, 59, 0, 0)
  return date.toISOString()
}

function pickTargets({
  kind,
  participants,
  invites,
  attempts,
}: {
  kind: SmsMessageKind
  participants: ParticipantRow[]
  invites: TestInviteRow[]
  attempts: TestAttemptRow[]
}) {
  const inviteMap = new Map(invites.map((i) => [i.participant_id, i]))
  const attemptMap = new Map(attempts.map((a) => [a.participant_id, a]))

  return participants.filter((p) => {
    if (!isValidSmsPhone(p)) return false
    const invite = inviteMap.get(p.id)
    if (!invite) return false
    const attempt = attemptMap.get(p.id)
    if (attempt?.status === 'completed' || invite.status === 'completed') return false

    if (kind === 'initial') {
      return invite.status === 'not_sent' || !invite.sent_at
    }
    if (kind === 'reminder_1' || kind === 'reminder_2') {
      return true
    }
    return false
  })
}

export async function POST(request: NextRequest) {
  const { supabase, userId, allowed } = await getManagerRequestAccess()
  if (!userId) return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
  if (!allowed) return NextResponse.json({ error: 'Acces refuse' }, { status: 403 })

  const body = (await request.json()) as {
    action?: SmsAction
    deadlineAt?: string | null
  }
  const action = body.action
  if (!action) {
    return NextResponse.json({ error: 'Action SMS manquante.' }, { status: 400 })
  }

  const providerConfig = getSmsProviderConfig()

  if (action === 'test_single') {
    if (!providerConfig.configured) {
      return NextResponse.json(
        { error: `SMS test impossible : ${providerConfig.reason}` },
        { status: 400 },
      )
    }
    const messageBody = buildSmsBody({ kind: 'test_single', accessUrl: '' })
    const dispatch = await sendOrangeSms({ destination: SMS_TEST_NUMBER, message: messageBody })
    const dispatchedAt = new Date().toISOString()

    console.log('[positioning-sms] test_single', {
      provider: dispatch.provider,
      destination: SMS_TEST_NUMBER,
      status: dispatch.status,
      httpStatus: dispatch.httpStatus,
      senderUsed: dispatch.senderUsed,
      errorMessage: dispatch.errorMessage,
      rawResponseHead: dispatch.rawResponse?.slice(0, 200),
    })

    let logInsertError: string | null = null
    const { error: insertError } = await supabase.from('outbound_messages').insert({
      participant_id: null,
      invite_id: null,
      channel: 'sms',
      destination: SMS_TEST_NUMBER,
      message_body: messageBody,
      provider: dispatch.provider,
      message_kind: 'test_single',
      status: dispatch.status === 'sent' ? 'sent' : 'failed',
      provider_message_id: dispatch.providerMessageId || null,
      provider_payload: {
        senderUsed: dispatch.senderUsed,
        httpStatus: dispatch.httpStatus,
        rawResponse: dispatch.rawResponse,
      },
      sent_at: dispatch.status === 'sent' ? dispatchedAt : null,
      error_message: dispatch.errorMessage || null,
    })
    if (insertError) {
      logInsertError = insertError.message
      console.warn('[positioning-sms] insert outbound_messages failed', insertError.message)
    }

    return NextResponse.json({
      action,
      provider: dispatch.provider,
      destination: SMS_TEST_NUMBER,
      status: dispatch.status,
      httpStatus: dispatch.httpStatus,
      providerMessageId: dispatch.providerMessageId,
      senderUsed: dispatch.senderUsed,
      rawResponse: dispatch.rawResponse,
      errorMessage: dispatch.errorMessage,
      messageBody,
      logInsertError,
    })
  }

  const [{ data: participants }, { data: invites }, { data: attempts }] = await Promise.all([
    supabase.from('participants').select('*').order('created_at', { ascending: false }),
    supabase.from('test_invites').select('*'),
    supabase.from('test_attempts').select('*'),
  ])

  const participantRows = (participants || []) as ParticipantRow[]
  const inviteRows = (invites || []) as TestInviteRow[]
  const attemptRows = (attempts || []) as TestAttemptRow[]
  const inviteMap = new Map(inviteRows.map((i) => [i.participant_id, i]))

  const kindForFilter: SmsMessageKind = action === 'export_csv' ? 'initial' : action
  const targets = pickTargets({
    kind: kindForFilter,
    participants: participantRows,
    invites: inviteRows,
    attempts: attemptRows,
  })

  const deadlineAt = defaultDeadline(body.deadlineAt ?? null)

  if (action === 'export_csv') {
    const lines = ['phone,message']
    for (const participant of targets) {
      const invite = inviteMap.get(participant.id)
      if (!invite) continue
      const rawToken = generateAccessToken()
      const accessUrl = buildAccessUrl(rawToken, request.nextUrl.origin)
      const expiresAt = new Date(Date.now() + POSITIONING_LINK_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
      await supabase
        .from('test_invites')
        .update({
          token_hash: sha256(rawToken),
          expires_at: expiresAt,
          deadline_at: deadlineAt,
          access_version: (invite.access_version || 1) + 1,
        })
        .eq('id', invite.id)
      const phone = getSmsDestination(participant)
      const initialMessage = buildSmsBody({ kind: 'initial', accessUrl })
      const reminder1 = buildSmsBody({ kind: 'reminder_1', accessUrl })
      const reminder2 = buildSmsBody({ kind: 'reminder_2', accessUrl })
      lines.push(`${toCsvValue(phone)},${toCsvValue(initialMessage)}`)
      lines.push(`${toCsvValue(phone)},${toCsvValue(reminder1)}`)
      lines.push(`${toCsvValue(phone)},${toCsvValue(reminder2)}`)
    }
    return new NextResponse(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="positioning_sms_${Date.now()}.csv"`,
      },
    })
  }

  if (!providerConfig.configured) {
    return NextResponse.json(
      { error: `Envoi reel impossible : ${providerConfig.reason}` },
      { status: 400 },
    )
  }

  const results: Array<{
    participantId: string
    fullName: string
    destination: string
    status: string
    errorMessage?: string
  }> = []

  let sentCount = 0
  let failedCount = 0

  for (const participant of targets) {
    const invite = inviteMap.get(participant.id)
    if (!invite) continue

    const rawToken = generateAccessToken()
    const accessUrl = buildAccessUrl(rawToken, request.nextUrl.origin)
    const expiresAt = new Date(Date.now() + POSITIONING_LINK_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
    const phone = getSmsDestination(participant)
    const messageBody = buildSmsBody({ kind: action, accessUrl })

    await supabase
      .from('test_invites')
      .update({
        token_hash: sha256(rawToken),
        expires_at: expiresAt,
        deadline_at: deadlineAt,
        access_version: (invite.access_version || 1) + 1,
      })
      .eq('id', invite.id)

    const dispatch = await sendOrangeSms({ destination: phone, message: messageBody })
    const dispatchedAt = new Date().toISOString()

    console.log('[positioning-sms] campaign_send', {
      action,
      provider: dispatch.provider,
      destination: phone,
      status: dispatch.status,
      httpStatus: dispatch.httpStatus,
      errorMessage: dispatch.errorMessage,
    })

    await supabase.from('outbound_messages').insert({
      participant_id: participant.id,
      invite_id: invite.id,
      channel: 'sms',
      destination: phone,
      message_body: messageBody,
      provider: dispatch.provider,
      message_kind: action,
      status: dispatch.status === 'sent' ? 'sent' : 'failed',
      provider_message_id: dispatch.providerMessageId || null,
      provider_payload: {
        accessUrl,
        senderUsed: dispatch.senderUsed,
        httpStatus: dispatch.httpStatus,
        rawResponse: dispatch.rawResponse,
      },
      sent_at: dispatch.status === 'sent' ? dispatchedAt : null,
      error_message: dispatch.errorMessage || null,
    })

    if (dispatch.status === 'sent') {
      sentCount += 1
      const isReminder = action !== 'initial'
      await supabase
        .from('test_invites')
        .update({
          status: 'sent',
          sent_at: invite.sent_at || dispatchedAt,
          last_reminder_at: isReminder ? dispatchedAt : invite.last_reminder_at,
        })
        .eq('id', invite.id)
      await supabase
        .from('participants')
        .update({ status: 'invited' })
        .eq('id', participant.id)
    } else {
      failedCount += 1
    }

    results.push({
      participantId: participant.id,
      fullName: participant.full_name,
      destination: phone,
      status: dispatch.status,
      errorMessage: dispatch.errorMessage,
    })
  }

  return NextResponse.json({
    action,
    provider: providerConfig.provider,
    targetedCount: targets.length,
    sentCount,
    failedCount,
    results,
  })
}
