import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createAdminClient, isAdminClientConfigured } from '../src/lib/supabase/admin'
import type {
  OutboundMessageRow,
  ParticipantRow,
  TestAttemptRow,
  TestInviteRow,
} from '../src/lib/positioning/types'

const APPLY_FLAG = '--apply'
const PRODUCTION_ORIGIN = 'https://hotel-english-app.vercel.app'
const REPORT_PATH = path.resolve(
  'C:/Users/yra69/hotel-english-app/artifacts/positioning_status_2026/localhost_link_audit.json',
)

async function loadLocalEnvFile(filePath: string) {
  try {
    const raw = await readFile(filePath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex <= 0) continue
      const key = trimmed.slice(0, separatorIndex).trim()
      let value = trimmed.slice(separatorIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // Optional env file.
  }
}

async function bootstrapEnv() {
  await loadLocalEnvFile(path.resolve(process.cwd(), '.env.local'))
  await loadLocalEnvFile(path.resolve(process.cwd(), '.env'))
}

function normalizeIdentityString(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['`]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchesParticipantIdentity(participant: ParticipantRow, targetName: string) {
  const candidate = normalizeIdentityString(targetName)
  return [
    participant.full_name,
    `${participant.first_name} ${participant.last_name}`,
    `${participant.last_name} ${participant.first_name}`,
  ].some((value) => normalizeIdentityString(value) === candidate)
}

function extractAccessUrl(message: OutboundMessageRow | null) {
  if (!message?.provider_payload || Array.isArray(message.provider_payload)) return null
  const value = (message.provider_payload as Record<string, unknown>).accessUrl
  return typeof value === 'string' && value.length > 0 ? value : null
}

function getUrlOrigin(value: string | null) {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

function isLocalhostOrigin(value: string | null) {
  const origin = getUrlOrigin(value)
  if (!origin) return false

  try {
    const parsed = new URL(origin)
    return ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)
  } catch {
    return false
  }
}

function toRedactedUrl(value: string | null) {
  if (!value) return null
  try {
    const parsed = new URL(value)
    return `${parsed.origin}/positioning/[token]`
  } catch {
    return null
  }
}

function replaceAccessUrlOrigin(accessUrl: string) {
  const parsed = new URL(accessUrl)
  return `${PRODUCTION_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`
}

function updateMessageBodyLink(messageBody: string | null, previousUrl: string, nextUrl: string) {
  if (!messageBody) return messageBody
  return messageBody.includes(previousUrl) ? messageBody.replace(previousUrl, nextUrl) : messageBody
}

function stringifyContainsLocalhost(value: unknown) {
  return JSON.stringify(value || {}).toLowerCase().includes('localhost')
}

function getLatestInvite(invites: TestInviteRow[], participantId: string) {
  return (
    invites
      .filter((invite) => invite.participant_id === participantId)
      .sort(
        (left, right) =>
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
      )[0] || null
  )
}

function getLatestAttempt(
  attempts: TestAttemptRow[],
  participantId: string,
  inviteId: string | null,
) {
  return (
    attempts
      .filter(
        (attempt) =>
          attempt.participant_id === participantId && (!inviteId || attempt.invite_id === inviteId),
      )
      .sort(
        (left, right) =>
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
      )[0] || null
  )
}

function getLatestAccessMessage(
  messages: OutboundMessageRow[],
  participantId: string,
  inviteId: string | null,
) {
  return (
    messages
      .filter(
        (message) =>
          message.participant_id === participantId &&
          (!inviteId || message.invite_id === inviteId) &&
          Boolean(extractAccessUrl(message)),
      )
      .sort(
        (left, right) =>
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
      )[0] || null
  )
}

async function main() {
  const applyMode = process.argv.includes(APPLY_FLAG)
  await bootstrapEnv()

  if (!isAdminClientConfigured()) {
    throw new Error('Supabase admin client is not configured for localhost-link audit.')
  }

  const admin = createAdminClient()

  const [{ data: participantsData, error: participantsError }, { data: invitesData, error: invitesError }, { data: messagesData, error: messagesError }, { data: attemptsData, error: attemptsError }] =
    await Promise.all([
      admin.from('participants').select('*').order('created_at', { ascending: true }),
      admin.from('test_invites').select('*').order('created_at', { ascending: true }),
      admin.from('outbound_messages').select('*').order('created_at', { ascending: true }),
      admin.from('test_attempts').select('*').order('created_at', { ascending: true }),
    ])

  if (participantsError) throw participantsError
  if (invitesError) throw invitesError
  if (messagesError) throw messagesError
  if (attemptsError) throw attemptsError

  const participants = (participantsData || []) as ParticipantRow[]
  const invites = (invitesData || []) as TestInviteRow[]
  const messages = (messagesData || []) as OutboundMessageRow[]
  const attempts = (attemptsData || []) as TestAttemptRow[]

  const localhostMessages = messages
    .map((message) => {
      const accessUrl = extractAccessUrl(message)
      return {
        message,
        accessUrl,
        participant: participants.find((participant) => participant.id === message.participant_id) || null,
        invite: message.invite_id
          ? invites.find((invite) => invite.id === message.invite_id) || null
          : null,
      }
    })
    .filter(({ accessUrl, message }) => isLocalhostOrigin(accessUrl) || stringifyContainsLocalhost(message))

  const activeLocalhostMessages = localhostMessages.filter(({ message, participant, invite }) => {
    if (!participant) return false
    if (participant.status === 'completed') return false
    if (invite?.status === 'completed') return false

    const latestMessage = getLatestAccessMessage(messages, participant.id, invite?.id ?? null)
    return latestMessage?.id === message.id
  })

  const updates = activeLocalhostMessages.map(({ message, accessUrl, participant, invite }) => {
    if (!accessUrl || !participant) return null
    const correctedAccessUrl = replaceAccessUrlOrigin(accessUrl)
    const providerPayload =
      message.provider_payload && !Array.isArray(message.provider_payload)
        ? {
            ...(message.provider_payload as Record<string, unknown>),
            accessUrl: correctedAccessUrl,
          }
        : { accessUrl: correctedAccessUrl }

    return {
      id: message.id,
      participantName: participant.full_name,
      hotel: participant.hotel,
      inviteId: invite?.id ?? null,
      previousOrigin: getUrlOrigin(accessUrl),
      nextOrigin: getUrlOrigin(correctedAccessUrl),
      updatedMessageBody: updateMessageBodyLink(message.message_body, accessUrl, correctedAccessUrl),
      updatedProviderPayload: providerPayload,
    }
  }).filter(Boolean) as Array<{
    id: string
    participantName: string
    hotel: string
    inviteId: string | null
    previousOrigin: string | null
    nextOrigin: string | null
    updatedMessageBody: string | null
    updatedProviderPayload: Record<string, unknown>
  }>

  if (applyMode) {
    for (const update of updates) {
      const { error } = await admin
        .from('outbound_messages')
        .update({
          message_body: update.updatedMessageBody,
          provider_payload: update.updatedProviderPayload,
        })
        .eq('id', update.id)

      if (error) throw error
    }
  }

  const yapi = participants.find(
    (participant) =>
      participant.hotel === 'SEEN' && matchesParticipantIdentity(participant, 'Yapi Yann Abe'),
  )
  const yapiInvite = yapi ? getLatestInvite(invites, yapi.id) : null
  const yapiAttempt = yapi ? getLatestAttempt(attempts, yapi.id, yapiInvite?.id ?? null) : null
  const yapiMessage = yapi ? getLatestAccessMessage(messages, yapi.id, yapiInvite?.id ?? null) : null
  const yapiAccessUrl = extractAccessUrl(yapiMessage)

  const report = {
    generated_at: new Date().toISOString(),
    apply_mode: applyMode,
    source_exacte_du_localhost: {
      code_path: 'src/lib/positioning/collective-access-service.ts',
      explanation:
        "Le claim public reutilisait un accessUrl deja stocke sans verifier que son origin correspondait a l'origin courant. Un lien genere depuis un environnement local pouvait donc etre reserve et resservi en production.",
      production_origin_expected: PRODUCTION_ORIGIN,
    },
    repository_search: {
      localhost_hits_expected_in_code: [
        'src/lib/positioning/collective-access-service.ts',
        'src/lib/positioning/access.ts',
        '.env.local.example',
      ],
    },
    database_search: {
      participants_hits: participants.filter((row) => stringifyContainsLocalhost(row)).length,
      test_invites_hits: invites.filter((row) => stringifyContainsLocalhost(row)).length,
      outbound_messages_hits: messages.filter((row) => stringifyContainsLocalhost(row)).length,
      test_attempts_hits: attempts.filter((row) => stringifyContainsLocalhost(row)).length,
      active_localhost_messages: activeLocalhostMessages.map(({ message, accessUrl, participant, invite }) => ({
        message_id: message.id,
        participant_name: participant?.full_name || null,
        hotel: participant?.hotel || null,
        invite_status: invite?.status || null,
        participant_status: participant?.status || null,
        message_status: message.status,
        message_kind: message.message_kind,
        sent_at: message.sent_at,
        access_url_origin: getUrlOrigin(accessUrl),
        access_url_redacted: toRedactedUrl(accessUrl),
      })),
    },
    yapi_yann_abe: {
      participant_found: Boolean(yapi),
      hotel: yapi?.hotel || null,
      normalized_phone: yapi?.normalized_phone || yapi?.phone || null,
      participant_status: yapi?.status || null,
      invite_status: yapiInvite?.status || null,
      attempt_status: yapiAttempt?.status || null,
      stored_access_url_origin: getUrlOrigin(yapiAccessUrl),
      stored_access_url_redacted: toRedactedUrl(yapiAccessUrl),
    },
    correction_applied: {
      applied: applyMode,
      updated_active_messages_count: updates.length,
      updated_messages: updates.map((update) => ({
        message_id: update.id,
        participant_name: update.participantName,
        hotel: update.hotel,
        previous_origin: update.previousOrigin,
        next_origin: update.nextOrigin,
      })),
    },
    verdict:
      activeLocalhostMessages.length === 0
        ? 'GO relance maintenu'
        : applyMode
          ? 'GO relance maintenu sous reserve de verification production'
          : 'NO GO tant que les liens localhost actifs ne sont pas corriges',
  }

  await mkdir(path.dirname(REPORT_PATH), { recursive: true })
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  console.log(
    JSON.stringify(
      {
        apply_mode: applyMode,
        active_localhost_messages: activeLocalhostMessages.length,
        updated_messages: updates.length,
        yapi_origin: getUrlOrigin(yapiAccessUrl),
        report_path: REPORT_PATH,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
