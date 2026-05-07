// @ts-nocheck
import Module from 'module'
import path from 'path'

const moduleWithResolver = Module as typeof Module & {
  _resolveFilename: typeof Module._resolveFilename
}
const originalResolveFilename = moduleWithResolver._resolveFilename

moduleWithResolver._resolveFilename = function patchedResolveFilename(
  request,
  parent,
  isMain,
  options,
) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(__dirname, request.slice(2))
  }

  return originalResolveFilename.call(this, request, parent, isMain, options)
}

const {
  matchesPositioningAccessHotel,
  normalizeIvoryCoastPhone,
  normalizePositioningAccessHotel,
} = require('@/lib/positioning/collective-access') as typeof import('./lib/positioning/collective-access')
const {
  claimPositioningAccess,
} = require('@/lib/positioning/collective-access-service') as typeof import('./lib/positioning/collective-access-service')
const { sha256 } = require('@/lib/positioning/utils') as typeof import('./lib/positioning/utils')

let testCount = 0
let passCount = 0
let failCount = 0

function assert(condition: boolean, message: string) {
  testCount += 1
  if (condition) {
    passCount += 1
    console.log(`PASS: ${message}`)
    return
  }

  failCount += 1
  console.log(`FAIL: ${message}`)
}

function createParticipant(overrides = {}) {
  return {
    id: 'participant-1',
    hotel: 'NOOM',
    organization: 'CAFORMAC',
    first_name: 'Awa',
    last_name: 'Kone',
    full_name: 'Awa Kone',
    phone: '0797660543',
    normalized_phone: '2250797660543',
    email: 'awa@example.com',
    department: 'Reception',
    external_ref: null,
    status: 'imported',
    created_at: '2026-05-04T08:00:00.000Z',
    updated_at: '2026-05-04T08:00:00.000Z',
    ...overrides,
  }
}

function createInvite(overrides = {}) {
  return {
    id: 'invite-1',
    participant_id: 'participant-1',
    token_hash: 'existing-hash',
    expires_at: '2026-05-20T08:00:00.000Z',
    deadline_at: '2026-05-18T23:59:00.000Z',
    status: 'sent',
    sent_at: '2026-05-04T08:10:00.000Z',
    opened_at: null,
    started_at: null,
    completed_at: null,
    last_reminder_at: null,
    access_version: 2,
    created_at: '2026-05-04T08:00:00.000Z',
    updated_at: '2026-05-04T08:00:00.000Z',
    ...overrides,
  }
}

function createAttempt(overrides = {}) {
  return {
    id: 'attempt-1',
    participant_id: 'participant-1',
    invite_id: 'invite-1',
    status: 'in_progress',
    started_at: '2026-05-04T09:00:00.000Z',
    submitted_at: null,
    completed_at: null,
    total_score: null,
    estimated_level: null,
    recommended_group: null,
    duration_seconds: null,
    device_info: null,
    anomalies_json: null,
    raw_result_json: null,
    auto_score: null,
    writing_score: null,
    speaking_score: null,
    provisional_score: null,
    ai_status: null,
    strong_competences: null,
    weak_competences: null,
    created_at: '2026-05-04T09:00:00.000Z',
    updated_at: '2026-05-04T09:00:00.000Z',
    ...overrides,
  }
}

function createMessage(overrides = {}) {
  return {
    id: 'message-1',
    participant_id: 'participant-1',
    invite_id: 'invite-1',
    channel: 'whatsapp',
    destination: '2250797660543',
    message_body: 'Bonjour Awa,\nhttps://hotel-english-app.vercel.app/positioning/existing-token',
    provider: 'manual_whatsapp',
    message_kind: 'invite',
    status: 'prepared',
    provider_message_id: null,
    provider_payload: {
      accessUrl: 'https://hotel-english-app.vercel.app/positioning/existing-token',
    },
    sent_at: null,
    error_message: null,
    created_at: '2026-05-04T08:10:00.000Z',
    ...overrides,
  }
}

function createFakeRepository({
  participants,
  invites = [],
  attempts = [],
  messages = [],
}) {
  const state = {
    participants: participants.map((item) => ({ ...item })),
    invites: invites.map((item) => ({ ...item })),
    attempts: attempts.map((item) => ({ ...item })),
    messages: messages.map((item) => ({ ...item })),
    anomalies: [] as Array<{ anomaly: string; context: Record<string, unknown> }>,
  }

  const repository = {
    async listParticipantsByHotel(hotel) {
      return state.participants.filter((participant) =>
        matchesPositioningAccessHotel(participant.hotel, hotel),
      )
    },
    async findLatestInvite(participantId) {
      return (
        state.invites
          .filter((invite) => invite.participant_id === participantId)
          .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] || null
      )
    },
    async findLatestAttempt(participantId, inviteId) {
      const candidates = state.attempts.filter(
        (attempt) =>
          attempt.participant_id === participantId &&
          (!inviteId || attempt.invite_id === inviteId),
      )
      return candidates.sort((a, b) => b.created_at.localeCompare(a.created_at))[0] || null
    },
    async findLatestAccessMessage(participantId, inviteId) {
      const candidates = state.messages.filter(
        (message) =>
          message.participant_id === participantId &&
          (!inviteId || message.invite_id === inviteId) &&
          message.provider_payload &&
          typeof message.provider_payload.accessUrl === 'string',
      )
      return candidates.sort((a, b) => b.created_at.localeCompare(a.created_at))[0] || null
    },
    async createInvite(payload) {
      const invite = {
        id: `invite-${state.invites.length + 1}`,
        created_at: '2026-05-04T10:00:00.000Z',
        updated_at: '2026-05-04T10:00:00.000Z',
        participant_id: payload.participant_id,
        token_hash: payload.token_hash || null,
        expires_at: payload.expires_at || null,
        deadline_at: payload.deadline_at || null,
        status: payload.status,
        sent_at: payload.sent_at || null,
        opened_at: payload.opened_at || null,
        started_at: payload.started_at || null,
        completed_at: payload.completed_at || null,
        last_reminder_at: payload.last_reminder_at || null,
        access_version: payload.access_version || 1,
      }
      state.invites.push(invite)
      return invite
    },
    async updateInvite(inviteId, payload) {
      const index = state.invites.findIndex((invite) => invite.id === inviteId)
      state.invites[index] = {
        ...state.invites[index],
        ...payload,
        updated_at: '2026-05-04T10:00:00.000Z',
      }
      return state.invites[index]
    },
    async updateParticipant(participantId, payload) {
      const index = state.participants.findIndex((participant) => participant.id === participantId)
      state.participants[index] = {
        ...state.participants[index],
        ...payload,
      }
    },
    async insertOutboundMessage(payload) {
      state.messages.push({
        id: `message-${state.messages.length + 1}`,
        created_at: '2026-05-04T10:00:00.000Z',
        ...payload,
      })
    },
    logAnomaly(anomaly, context) {
      state.anomalies.push({ anomaly, context })
    },
  }

  return { repository, state }
}

async function run() {
  assert(normalizePositioningAccessHotel('noom') === 'NOOM', 'hotel NOOM est normalise')
  assert(normalizePositioningAccessHotel('SEEN') === 'SEEN', 'hotel SEEN est conserve')
  assert(normalizePositioningAccessHotel('MARRIOTT') === null, 'hotel invalide est refuse')

  const expectedPhone = '2250797660543'
  for (const value of [
    '0797660543',
    '07 97 66 05 43',
    '+2250797660543',
    '2250797660543',
  ]) {
    assert(
      normalizeIvoryCoastPhone(value) === expectedPhone,
      `telephone ${value} est converti au format canonique`,
    )
  }
  assert(normalizeIvoryCoastPhone('12345') === null, 'telephone invalide est rejete')

  const reuseContext = createFakeRepository({
    participants: [createParticipant()],
    invites: [createInvite()],
    messages: [createMessage()],
  })

  const expectedAccessUrl =
    'https://hotel-english-app.vercel.app/positioning/existing-token'

  for (const value of [
    '0797660543',
    '07 97 66 05 43',
    '+2250797660543',
    '2250797660543',
  ]) {
    const result = await claimPositioningAccess({
      repository: reuseContext.repository,
      hotel: 'NOOM',
      phone: value,
      origin: 'https://hotel-english-app.vercel.app',
      now: new Date('2026-05-04T10:00:00.000Z'),
    })

    assert(result.kind === 'success', `claim reussit pour le format ${value}`)
    assert(result.kind !== 'success' || result.accessUrl === expectedAccessUrl, 'meme lien individuel retrouve')
    assert(
      result.kind !== 'success' || result.reusedExistingAccessUrl === true,
      'lien existant est reutilise quand il est encore valable',
    )
  }

  assert(reuseContext.state.invites[0].status === 'opened', 'invite passe a opened apres identification')
  assert(
    reuseContext.state.participants[0].status === 'opened',
    'participant passe a opened apres identification',
  )
  assert(
    reuseContext.state.messages.length === 1,
    "aucun nouveau message n'est ajoute quand le lien existant est reutilisable",
  )

  const localhostReuseContext = createFakeRepository({
    participants: [createParticipant()],
    invites: [createInvite()],
    messages: [
      createMessage({
        message_body: 'Bonjour Awa,\nhttp://localhost:3001/positioning/existing-token',
        provider_payload: {
          accessUrl: 'http://localhost:3001/positioning/existing-token',
        },
      }),
    ],
  })

  const localhostReuseResult = await claimPositioningAccess({
    repository: localhostReuseContext.repository,
    hotel: 'NOOM',
    phone: '0797660543',
    origin: 'https://hotel-english-app.vercel.app',
    now: new Date('2026-05-04T10:00:00.000Z'),
  })

  assert(
    localhostReuseResult.kind === 'success',
    'claim reussit meme si un ancien lien localhost existe',
  )
  assert(
    localhostReuseResult.kind !== 'success' ||
      localhostReuseResult.accessUrl.startsWith('https://hotel-english-app.vercel.app/positioning/'),
    'ancien lien localhost n est pas reutilise depuis la production',
  )
  assert(
    localhostReuseResult.kind !== 'success' ||
      localhostReuseResult.accessUrl !== 'http://localhost:3001/positioning/existing-token',
    'un nouveau lien remplace le localhost stocke',
  )
  assert(
    localhostReuseResult.kind !== 'success' ||
      localhostReuseResult.reusedExistingAccessUrl === false,
    'reusedExistingAccessUrl reste faux quand il faut remplacer le localhost',
  )
  assert(
    localhostReuseContext.state.messages.length === 2,
    'un nouveau message est ajoute quand le localhost existant doit etre remplace',
  )

  const completedContext = createFakeRepository({
    participants: [createParticipant({ status: 'completed' })],
    invites: [createInvite({ status: 'completed', completed_at: '2026-05-04T11:00:00.000Z' })],
    attempts: [createAttempt({ status: 'completed', completed_at: '2026-05-04T11:00:00.000Z' })],
  })

  const completedResult = await claimPositioningAccess({
    repository: completedContext.repository,
    hotel: 'NOOM',
    phone: '0797660543',
    origin: 'https://hotel-english-app.vercel.app',
    now: new Date('2026-05-04T10:00:00.000Z'),
  })
  assert(completedResult.kind === 'completed', 'participant deja termine est detecte')

  const duplicateContext = createFakeRepository({
    participants: [
      createParticipant({ id: 'participant-1' }),
      createParticipant({ id: 'participant-2', full_name: 'Awa Kone 2' }),
    ],
    invites: [createInvite({ participant_id: 'participant-1' }), createInvite({ id: 'invite-2', participant_id: 'participant-2' })],
  })

  const duplicateResult = await claimPositioningAccess({
    repository: duplicateContext.repository,
    hotel: 'NOOM',
    phone: '0797660543',
    origin: 'https://hotel-english-app.vercel.app',
    now: new Date('2026-05-04T10:00:00.000Z'),
  })
  assert(duplicateResult.kind === 'duplicate', 'doublon de telephone bloque l ouverture automatique')
  assert(duplicateContext.state.anomalies.length === 1, 'anomalie doublon est journalisee')
  assert(
    duplicateContext.state.anomalies[0]?.context.phoneHash === sha256(expectedPhone),
    'journal serveur conserve un hash du numero plutot que le numero brut',
  )
  assert(
    !Object.prototype.hasOwnProperty.call(duplicateContext.state.anomalies[0]?.context || {}, 'phone'),
    'journal serveur ne stocke pas le numero brut',
  )

  const freshLinkContext = createFakeRepository({
    participants: [createParticipant({ status: 'imported' })],
    invites: [createInvite({ token_hash: null, status: 'not_sent', access_version: 1, sent_at: null })],
  })

  const freshResult = await claimPositioningAccess({
    repository: freshLinkContext.repository,
    hotel: 'NOOM',
    phone: '07 97 66 05 43',
    origin: 'https://hotel-english-app.vercel.app',
    now: new Date('2026-05-04T10:00:00.000Z'),
  })

  assert(freshResult.kind === 'success', 'nouveau lien genere si aucun accessUrl reutilisable')
  assert(
    freshResult.kind !== 'success' ||
      freshResult.accessUrl.startsWith('https://hotel-english-app.vercel.app/positioning/'),
    'nouveau lien pointe vers /positioning/[token]',
  )
  assert(
    freshResult.kind !== 'success' || freshResult.reusedExistingAccessUrl === false,
    'resultat indique bien une regeneration',
  )
  assert(
    typeof freshLinkContext.state.invites[0].token_hash === 'string' &&
      freshLinkContext.state.invites[0].token_hash.length > 0,
    'seul le hash du token est persiste dans test_invites',
  )
  assert(
    freshLinkContext.state.messages.length === 1,
    'un message de reference est cree quand un nouveau lien est genere',
  )
  assert(
    freshLinkContext.state.messages[0]?.provider_payload?.accessUrl === freshResult.accessUrl,
    'accessUrl est stockee dans provider_payload.accessUrl',
  )
  assert(
    freshLinkContext.state.messages[0]?.provider_payload?.source === 'access_by_phone',
    'source access_by_phone est memorisee dans le payload du message',
  )
  assert(
    freshLinkContext.state.messages[0]?.message_body.includes(freshResult.accessUrl),
    'message prepare RH reste compatible avec le lien individuel genere',
  )

  const notFoundContext = createFakeRepository({
    participants: [createParticipant({ normalized_phone: '2250102030405' })],
  })
  const notFoundResult = await claimPositioningAccess({
    repository: notFoundContext.repository,
    hotel: 'NOOM',
    phone: '0797660543',
    origin: 'https://hotel-english-app.vercel.app',
    now: new Date('2026-05-04T10:00:00.000Z'),
  })
  assert(notFoundResult.kind === 'not_found', 'numero inconnu renvoie not_found')
}

run()
  .catch((error) => {
    failCount += 1
    console.error(error)
  })
  .finally(() => {
    console.log(`Total: ${testCount}`)
    console.log(`Passes: ${passCount}`)
    console.log(`Echoues: ${failCount}`)

    if (failCount > 0) {
      process.exitCode = 1
    }
  })
