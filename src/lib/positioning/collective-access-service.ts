import {
  POSITIONING_DEFAULT_DEADLINE_DAYS,
  POSITIONING_LINK_EXPIRY_HOURS,
} from '@/lib/positioning/config'
import {
  normalizeIvoryCoastPhone,
  normalizePositioningAccessHotel,
  PositioningAccessHotel,
  matchesPositioningAccessHotel,
} from '@/lib/positioning/collective-access'
import { buildInviteMessage } from '@/lib/positioning/messages'
import {
  OutboundMessageRow,
  ParticipantRow,
  PositioningInviteStatus,
  TestAttemptRow,
  TestInviteRow,
} from '@/lib/positioning/types'
import { generateAccessToken, sha256 } from '@/lib/positioning/utils'

type InvitePayload = Omit<
  Partial<TestInviteRow>,
  'id' | 'created_at' | 'updated_at'
> & {
  participant_id: string
  status: PositioningInviteStatus
}

type OutboundMessageInsert = Omit<OutboundMessageRow, 'id' | 'created_at'>

export type PositioningAccessAnomaly = 'duplicate_phone'

export interface PositioningAccessRepository {
  listParticipantsByHotel(hotel: PositioningAccessHotel): Promise<ParticipantRow[]>
  findLatestInvite(participantId: string): Promise<TestInviteRow | null>
  findLatestAttempt(participantId: string, inviteId: string | null): Promise<TestAttemptRow | null>
  findLatestAccessMessage(
    participantId: string,
    inviteId: string | null,
  ): Promise<OutboundMessageRow | null>
  createInvite(payload: InvitePayload): Promise<TestInviteRow>
  updateInvite(inviteId: string, payload: Partial<TestInviteRow>): Promise<TestInviteRow>
  updateParticipant(participantId: string, payload: Partial<ParticipantRow>): Promise<void>
  insertOutboundMessage(payload: OutboundMessageInsert): Promise<void>
  logAnomaly(anomaly: PositioningAccessAnomaly, context: Record<string, unknown>): void
}

export type PositioningAccessClaimResult =
  | { kind: 'invalid_hotel' }
  | { kind: 'invalid_phone' }
  | { kind: 'not_found' }
  | { kind: 'duplicate' }
  | { kind: 'completed'; firstName: string }
  | {
      kind: 'success'
      firstName: string
      accessUrl: string
      reusedExistingAccessUrl: boolean
    }

function buildPositioningAccessUrl(token: string, origin?: string) {
  const baseUrl = origin || process.env.NEXT_PUBLIC_APP_URL
  if (!baseUrl) {
    throw new Error('Public app URL is not configured.')
  }

  return `${baseUrl.replace(/\/$/, '')}/positioning/${token}`
}

function getDefaultDeadline(deadlineAt: string | null) {
  if (deadlineAt) return deadlineAt
  const date = new Date()
  date.setDate(date.getDate() + POSITIONING_DEFAULT_DEADLINE_DAYS)
  date.setHours(23, 59, 0, 0)
  return date.toISOString()
}

function extractAccessUrl(message: OutboundMessageRow | null) {
  if (!message?.provider_payload || Array.isArray(message.provider_payload)) return null
  const value = (message.provider_payload as Record<string, unknown>).accessUrl
  return typeof value === 'string' && value.length > 0 ? value : null
}

function hasStartedAttempt(attempt: TestAttemptRow | null) {
  return Boolean(attempt?.started_at && attempt.status !== 'completed')
}

function isLocalhostHostname(hostname: string) {
  const normalizedHostname = hostname.trim().toLowerCase()
  return (
    normalizedHostname === 'localhost' ||
    normalizedHostname === '127.0.0.1' ||
    normalizedHostname === '::1'
  )
}

function canReuseAccessUrlForOrigin(accessUrl: string, origin?: string) {
  try {
    const parsedAccessUrl = new URL(accessUrl)

    if (isLocalhostHostname(parsedAccessUrl.hostname)) {
      if (!origin) return false
      const parsedOrigin = new URL(origin)
      return parsedOrigin.origin === parsedAccessUrl.origin
    }

    if (!origin) return true

    return new URL(origin).origin === parsedAccessUrl.origin
  } catch {
    return false
  }
}

function isCompletedParticipant({
  participant,
  invite,
  attempt,
}: {
  participant: ParticipantRow
  invite: TestInviteRow | null
  attempt: TestAttemptRow | null
}) {
  return (
    participant.status === 'completed' ||
    invite?.status === 'completed' ||
    attempt?.status === 'completed'
  )
}

function shouldReuseExistingAccessUrl({
  invite,
  attempt,
  accessUrl,
  origin,
  now,
}: {
  invite: TestInviteRow | null
  attempt: TestAttemptRow | null
  accessUrl: string | null
  origin?: string
  now: Date
}) {
  if (!invite?.token_hash || !accessUrl) return false
  if (!canReuseAccessUrlForOrigin(accessUrl, origin)) return false
  if (!invite.expires_at) return true
  if (hasStartedAttempt(attempt)) return true
  return new Date(invite.expires_at).getTime() >= now.getTime()
}

function getInviteStatusAfterClaim(
  invite: TestInviteRow | null,
  attempt: TestAttemptRow | null,
): PositioningInviteStatus {
  if (attempt?.status === 'in_progress' || invite?.status === 'started') return 'started'
  return 'opened'
}

function getParticipantStatusAfterClaim(
  inviteStatus: PositioningInviteStatus,
  attempt: TestAttemptRow | null,
) {
  if (attempt?.status === 'completed' || inviteStatus === 'completed') return 'completed'
  if (attempt?.status === 'in_progress' || inviteStatus === 'started') return 'in_progress'
  return 'opened'
}

function getMessageKind(invite: TestInviteRow | null) {
  if (!invite) return 'invite'
  return invite.status === 'not_sent' && !invite.sent_at ? 'invite' : 'reminder'
}

export async function claimPositioningAccess({
  repository,
  hotel,
  phone,
  origin,
  now = new Date(),
}: {
  repository: PositioningAccessRepository
  hotel: unknown
  phone: unknown
  origin?: string
  now?: Date
}): Promise<PositioningAccessClaimResult> {
  const normalizedHotel = normalizePositioningAccessHotel(hotel)
  if (!normalizedHotel) return { kind: 'invalid_hotel' }

  const normalizedPhone = normalizeIvoryCoastPhone(phone)
  if (!normalizedPhone) return { kind: 'invalid_phone' }

  const participants = await repository.listParticipantsByHotel(normalizedHotel)
  const matches = participants.filter((participant) => {
    if (!matchesPositioningAccessHotel(participant.hotel, normalizedHotel)) return false
    return (
      normalizeIvoryCoastPhone(participant.normalized_phone || participant.phone) === normalizedPhone
    )
  })

  if (matches.length === 0) {
    return { kind: 'not_found' }
  }

  if (matches.length > 1) {
    repository.logAnomaly('duplicate_phone', {
      hotel: normalizedHotel,
      participantIds: matches.map((participant) => participant.id),
      phoneHash: sha256(normalizedPhone),
    })
    return { kind: 'duplicate' }
  }

  const participant = matches[0]
  const existingInvite = await repository.findLatestInvite(participant.id)
  const attempt = await repository.findLatestAttempt(participant.id, existingInvite?.id ?? null)

  if (isCompletedParticipant({ participant, invite: existingInvite, attempt })) {
    return { kind: 'completed', firstName: participant.first_name }
  }

  const existingMessage = await repository.findLatestAccessMessage(
    participant.id,
    existingInvite?.id ?? null,
  )
  const existingAccessUrl = extractAccessUrl(existingMessage)
  const reusedExistingAccessUrl = shouldReuseExistingAccessUrl({
    invite: existingInvite,
    attempt,
    accessUrl: existingAccessUrl,
    origin,
    now,
  })

  const nowIso = now.toISOString()
  const inviteStatus = getInviteStatusAfterClaim(existingInvite, attempt)
  const deadlineAt = getDefaultDeadline(existingInvite?.deadline_at ?? null)
  const expiresAt = new Date(
    now.getTime() + POSITIONING_LINK_EXPIRY_HOURS * 60 * 60 * 1000,
  ).toISOString()

  let invite = existingInvite
  let accessUrl = existingAccessUrl

  if (!reusedExistingAccessUrl) {
    const rawToken = generateAccessToken()
    accessUrl = buildPositioningAccessUrl(rawToken, origin)
    const tokenHash = sha256(rawToken)

    const invitePayload = {
      status: inviteStatus,
      token_hash: tokenHash,
      expires_at: expiresAt,
      deadline_at: deadlineAt,
      opened_at: existingInvite?.opened_at || nowIso,
      started_at:
        inviteStatus === 'started'
          ? attempt?.started_at || existingInvite?.started_at || nowIso
          : existingInvite?.started_at || null,
      access_version: existingInvite ? (existingInvite.access_version || 1) + 1 : 1,
    }

    invite = existingInvite
      ? await repository.updateInvite(existingInvite.id, invitePayload)
      : await repository.createInvite({
          participant_id: participant.id,
          status: inviteStatus,
          token_hash: tokenHash,
          expires_at: expiresAt,
          deadline_at: deadlineAt,
          opened_at: nowIso,
          started_at: inviteStatus === 'started' ? attempt?.started_at || nowIso : null,
          completed_at: null,
          sent_at: null,
          last_reminder_at: null,
          access_version: 1,
        })

    const messageBody = buildInviteMessage({
      participant,
      accessUrl,
      deadlineAt,
    })

    await repository.insertOutboundMessage({
      participant_id: participant.id,
      invite_id: invite.id,
      channel: 'whatsapp',
      destination: participant.normalized_phone || normalizedPhone,
      message_body: messageBody,
      provider: 'collective_access',
      message_kind: getMessageKind(existingInvite),
      status: 'prepared',
      provider_message_id: null,
      provider_payload: {
        accessUrl,
        source: 'access_by_phone',
      },
      sent_at: null,
      error_message: null,
    })
  } else if (invite) {
    invite = await repository.updateInvite(invite.id, {
      status: inviteStatus,
      opened_at: invite.opened_at || nowIso,
      started_at:
        inviteStatus === 'started'
          ? attempt?.started_at || invite.started_at || nowIso
          : invite.started_at || null,
      deadline_at: invite.deadline_at || deadlineAt,
    })
  } else {
    throw new Error('Invariant violation: reusable access URL requires an invite.')
  }

  await repository.updateParticipant(participant.id, {
    status: getParticipantStatusAfterClaim(invite.status, attempt),
  })

  return {
    kind: 'success',
    firstName: participant.first_name,
    accessUrl: accessUrl as string,
    reusedExistingAccessUrl,
  }
}
