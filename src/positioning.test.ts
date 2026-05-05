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

const { aggregateProductionScores } =
  require('@/lib/positioning/ai-evaluation') as typeof import('./lib/positioning/ai-evaluation')
const { buildPositioningDashboardData } =
  require('@/lib/positioning/dashboard') as typeof import('./lib/positioning/dashboard')
const { computeGroupAssignments } =
  require('@/lib/positioning/grouping') as typeof import('./lib/positioning/grouping')

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

function createResponses(count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      `q${index + 1}`,
      { answer: 'A', answeredAt: `2026-05-04T10:${String(index).padStart(2, '0')}:00.000Z` },
    ]),
  )
}

function createProductionsDraft() {
  return Object.fromEntries(
    ['writing-1', 'writing-2', 'writing-3', 'writing-4', 'speaking-1', 'speaking-2'].map(
      (promptId, index) => [
        promptId,
        {
          promptId,
          kind: promptId.startsWith('writing') ? 'writing' : 'speaking',
          submittedAt: `2026-05-04T11:${String(index).padStart(2, '0')}:00.000Z`,
        },
      ],
    ),
  )
}

const participant = {
  id: 'participant-1',
  hotel: 'Seen Hotel',
  organization: 'NOOM',
  first_name: 'Lina',
  last_name: 'Martin',
  full_name: 'Lina Martin',
  phone: '+33600000000',
  normalized_phone: '+33600000000',
  email: 'lina@example.com',
  department: 'Reception',
  external_ref: null,
  status: 'completed',
  created_at: '2026-05-04T09:00:00.000Z',
  updated_at: '2026-05-04T12:00:00.000Z',
}

const invite = {
  id: 'invite-1',
  participant_id: participant.id,
  token_hash: 'hash',
  expires_at: null,
  deadline_at: '2026-05-11T00:00:00.000Z',
  status: 'completed',
  sent_at: '2026-05-04T09:00:00.000Z',
  opened_at: '2026-05-04T09:30:00.000Z',
  started_at: '2026-05-04T10:00:00.000Z',
  completed_at: '2026-05-04T12:00:00.000Z',
  last_reminder_at: null,
  access_version: 1,
  created_at: '2026-05-04T09:00:00.000Z',
  updated_at: '2026-05-04T12:00:00.000Z',
}

const sectionResults = [
  {
    id: 'sec-1',
    attempt_id: 'attempt-1',
    section_key: 'reading',
    score: 2,
    max_score: 8,
    details_json: null,
    created_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'sec-2',
    attempt_id: 'attempt-1',
    section_key: 'listening',
    score: 2,
    max_score: 8,
    details_json: null,
    created_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'sec-3',
    attempt_id: 'attempt-1',
    section_key: 'vocabulary',
    score: 2,
    max_score: 8,
    details_json: null,
    created_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'sec-4',
    attempt_id: 'attempt-1',
    section_key: 'situations',
    score: 2,
    max_score: 8,
    details_json: null,
    created_at: '2026-05-04T12:00:00.000Z',
  },
]

const weakCandidateProductions = [
  {
    id: 'prod-1',
    attempt_id: 'attempt-1',
    participant_id: participant.id,
    prompt_id: 'writing-1',
    kind: 'writing',
    response_text: 'Late check-in is possible.',
    transcription: null,
    has_audio: false,
    ai_score: 15,
    ai_level: 'A1',
    ai_competences: ['donner_information'],
    ai_errors: [],
    ai_justification: 'Production tres faible mais exploitable.',
    ai_confidence: 'high',
    ai_status: 'ia_validated',
    trainer_score: null,
    trainer_note: null,
    raw_ai_response: null,
    created_at: '2026-05-04T12:00:00.000Z',
    updated_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'prod-2',
    attempt_id: 'attempt-1',
    participant_id: participant.id,
    prompt_id: 'writing-2',
    kind: 'writing',
    response_text: 'Sorry.',
    transcription: null,
    has_audio: false,
    ai_score: 0,
    ai_level: 'A1',
    ai_competences: [],
    ai_errors: ['hors sujet'],
    ai_justification: 'Reponse quasi vide.',
    ai_confidence: 'low',
    ai_status: 'needs_trainer_review',
    trainer_score: null,
    trainer_note: null,
    raw_ai_response: null,
    created_at: '2026-05-04T12:00:00.000Z',
    updated_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'prod-3',
    attempt_id: 'attempt-1',
    participant_id: participant.id,
    prompt_id: 'writing-3',
    kind: 'writing',
    response_text: 'No understand.',
    transcription: null,
    has_audio: false,
    ai_score: 0,
    ai_level: 'A1',
    ai_competences: [],
    ai_errors: ['anglais insuffisant'],
    ai_justification: 'Production inexploitable mais score numerique.',
    ai_confidence: 'low',
    ai_status: 'needs_trainer_review',
    trainer_score: null,
    trainer_note: null,
    raw_ai_response: null,
    created_at: '2026-05-04T12:00:00.000Z',
    updated_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'prod-4',
    attempt_id: 'attempt-1',
    participant_id: participant.id,
    prompt_id: 'writing-4',
    kind: 'writing',
    response_text: 'We send technician soon.',
    transcription: null,
    has_audio: false,
    ai_score: 0,
    ai_level: 'A1',
    ai_competences: [],
    ai_errors: [],
    ai_justification: 'Tres faible.',
    ai_confidence: 'high',
    ai_status: 'ia_validated',
    trainer_score: null,
    trainer_note: null,
    raw_ai_response: null,
    created_at: '2026-05-04T12:00:00.000Z',
    updated_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'prod-5',
    attempt_id: 'attempt-1',
    participant_id: participant.id,
    prompt_id: 'speaking-1',
    kind: 'speaking',
    response_text: null,
    transcription: 'Breakfast is at seven.',
    has_audio: true,
    ai_score: 15,
    ai_level: 'A1',
    ai_competences: ['donner_information'],
    ai_errors: [],
    ai_justification: 'Oral tres faible.',
    ai_confidence: 'high',
    ai_status: 'ia_validated',
    trainer_score: null,
    trainer_note: null,
    raw_ai_response: null,
    created_at: '2026-05-04T12:00:00.000Z',
    updated_at: '2026-05-04T12:00:00.000Z',
  },
  {
    id: 'prod-6',
    attempt_id: 'attempt-1',
    participant_id: participant.id,
    prompt_id: 'speaking-2',
    kind: 'speaking',
    response_text: null,
    transcription: 'I call manager.',
    has_audio: true,
    ai_score: 10,
    ai_level: 'A1',
    ai_competences: [],
    ai_errors: [],
    ai_justification: 'Oral faible.',
    ai_confidence: 'high',
    ai_status: 'ia_validated',
    trainer_score: null,
    trainer_note: null,
    raw_ai_response: null,
    created_at: '2026-05-04T12:00:00.000Z',
    updated_at: '2026-05-04T12:00:00.000Z',
  },
]

const aggregate = aggregateProductionScores(
  weakCandidateProductions.map((production) => ({
    kind: production.kind,
    ai_score: production.ai_score,
    trainer_score: production.trainer_score,
    ai_status: production.ai_status,
    ai_competences: production.ai_competences,
    ai_level: production.ai_level,
  })),
)

assert(aggregate.writingScore === 4, 'writing score moyen faible conserve les zeros numeriques')
assert(aggregate.speakingScore === 13, 'speaking score moyen est consolide')
assert(aggregate.needsReview === true, 'low confidence numerique declenche bien needs review')
assert(aggregate.hasBlockingIssue === false, 'needs_trainer_review ne bloque pas la consolidation')
assert(aggregate.overallStatus === 'needs_trainer_review', 'statut global reste a revoir formateur')

const dashboard = buildPositioningDashboardData({
  participants: [participant],
  invites: [invite],
  attempts: [
    {
      id: 'attempt-1',
      participant_id: participant.id,
      invite_id: invite.id,
      status: 'completed',
      started_at: '2026-05-04T10:00:00.000Z',
      submitted_at: '2026-05-04T12:00:00.000Z',
      completed_at: '2026-05-04T12:00:00.000Z',
      total_score: null,
      estimated_level: null,
      recommended_group: null,
      duration_seconds: 7200,
      device_info: null,
      anomalies_json: [],
      raw_result_json: {
        responses: createResponses(32),
        productions: createProductionsDraft(),
      },
      auto_score: 25,
      writing_score: 4,
      speaking_score: 13,
      provisional_score: null,
      ai_status: 'needs_trainer_review',
      strong_competences: [],
      weak_competences: ['donner_information'],
      created_at: '2026-05-04T10:00:00.000Z',
      updated_at: '2026-05-04T12:00:00.000Z',
    },
  ],
  sectionResults,
  messages: [],
  groupRecommendations: [],
  productions: weakCandidateProductions,
})

const weakRow = dashboard.rows[0]
assert(weakRow.totalScore === 18, 'dashboard derive le score global provisoire depuis les sous-scores IA')
assert(weakRow.provisionalScore === 18, 'dashboard remplit provisionalScore meme si la base est encore a null')
assert(weakRow.level === 'A1', 'niveau A1 derive pour un candidat faible')
assert(Boolean(weakRow.recommendedGroup), 'groupe recommande derive meme sans backfill SQL')
assert(weakRow.needsTrainerReview === true, 'statut a revoir formateur reste visible')
assert(weakRow.completedItems === 38, 'compteur de passation reste a 38/38 epreuves')

const assignments = computeGroupAssignments({
  participants: [participant],
  attempts: [
    {
      id: 'attempt-1',
      participant_id: participant.id,
      invite_id: invite.id,
      status: 'completed',
      started_at: '2026-05-04T10:00:00.000Z',
      submitted_at: '2026-05-04T12:00:00.000Z',
      completed_at: '2026-05-04T12:00:00.000Z',
      total_score: null,
      estimated_level: null,
      recommended_group: null,
      duration_seconds: 7200,
      device_info: null,
      anomalies_json: [],
      raw_result_json: null,
      auto_score: 25,
      writing_score: 4,
      speaking_score: 13,
      provisional_score: null,
      ai_status: 'needs_trainer_review',
      strong_competences: [],
      weak_competences: [],
      created_at: '2026-05-04T10:00:00.000Z',
      updated_at: '2026-05-04T12:00:00.000Z',
    },
  ],
  targetGroupSize: 8,
})

assert(assignments.length === 1, 'recalcul des groupes garde le candidat faible dans un groupe derive')
assert(Boolean(assignments[0]?.recommendedGroup), 'group assignment n a plus besoin d un estimated_level deja persiste')

const blockingAggregate = aggregateProductionScores(
  [
    ...weakCandidateProductions.slice(0, 5).map((production) => ({
      kind: production.kind,
      ai_score: production.ai_score,
      trainer_score: production.trainer_score,
      ai_status: production.ai_status,
      ai_competences: production.ai_competences,
      ai_level: production.ai_level,
    })),
    {
      kind: 'speaking' as const,
      ai_score: null,
      trainer_score: null,
      ai_status: 'ai_error' as const,
      ai_competences: [],
      ai_level: null,
    },
  ],
)

assert(blockingAggregate.speakingScore === null, 'une erreur IA laisse le score oral incomplet')
assert(blockingAggregate.hasBlockingIssue === true, 'une erreur IA bloque bien la consolidation complete')
assert(blockingAggregate.overallStatus === 'ai_error', 'le statut global distingue bien une vraie erreur IA')

console.log(`Total: ${testCount}`)
console.log(`Passes: ${passCount}`)
console.log(`Echoues: ${failCount}`)

if (failCount > 0) {
  process.exitCode = 1
}
