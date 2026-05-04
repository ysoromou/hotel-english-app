import { COMPETENCE_LABELS, CompetenceId } from '@/lib/positioning/competences'
import {
  GroupRecommendationRow,
  OutboundMessageRow,
  ParticipantRow,
  PositioningAiStatus,
  TestAttemptRow,
  TestInviteRow,
  TestProductionRow,
  TestSectionResultRow,
} from '@/lib/positioning/types'
import { deriveAttemptScoreSummary } from '@/lib/positioning/scoring'
import {
  getPositioningProductions,
  getPositioningQuestions,
} from '@/lib/positioning/questions'

const TOTAL_QUESTION_COUNT = getPositioningQuestions().length
const TOTAL_PRODUCTION_COUNT = getPositioningProductions().length
const TOTAL_EXPECTED_ITEMS = TOTAL_QUESTION_COUNT + TOTAL_PRODUCTION_COUNT

export interface DashboardProductionSummary {
  promptId: string
  kind: 'writing' | 'speaking'
  aiScore: number | null
  aiLevel: string | null
  aiStatus: PositioningAiStatus
  aiConfidence: string | null
  aiJustification: string | null
  aiErrors: string[]
  competenceLabels: string[]
  responsePreview: string | null
  hasAudio: boolean
}

export interface DashboardParticipantRow {
  participantId: string
  fullName: string
  hotel: string
  organization: string
  department: string
  phone: string
  email: string
  participantStatus: string
  inviteStatus: string
  attemptStatus: string
  openedAt: string | null
  startedAt: string | null
  completedAt: string | null
  totalScore: number | null
  autoScore: number | null
  writingScore: number | null
  speakingScore: number | null
  provisionalScore: number | null
  aiStatus: PositioningAiStatus | null
  needsTrainerReview: boolean
  level: string | null
  levelLabel: string | null
  recommendedGroup: string | null
  durationSeconds: number | null
  deadlineAt: string | null
  absenceCategory: 'none' | 'not_sent' | 'non_opened' | 'non_started' | 'incomplete' | 'absent'
  sectionScores: Record<string, string>
  sectionDetails: Record<
    'reading' | 'listening' | 'vocabulary' | 'situations',
    { score: number; max: number } | null
  >
  answeredQuestions: number
  totalQuestions: number
  productionsSubmitted: number
  totalProductions: number
  completedItems: number
  totalItems: number
  hasAnomalies: boolean
  anomalies: string[]
  strongCompetences: string[]
  weakCompetences: string[]
  productions: DashboardProductionSummary[]
  latestMessageId: string | null
  latestMessageStatus: string | null
  latestMessageKind: string | null
  latestMessageBody: string | null
  latestDeliveryUrl: string | null
  latestAccessUrl: string | null
  latestMessageAt: string | null
}

export interface DashboardSummary {
  totalParticipants: number
  totalSent: number
  totalOpened: number
  totalStarted: number
  totalCompleted: number
  totalAbsents: number
  totalIncompletes: number
  totalNeedsReview: number
  completionRate: number
}

export interface DashboardGroup {
  groupName: string
  level: string
  count: number
  hotels: Record<string, number>
  organizations: Record<string, number>
  participants: Array<{
    participantId: string
    fullName: string
    hotel: string
    organization: string
    level: string
    totalScore: number | null
  }>
}

export interface PositioningDashboardData {
  summary: DashboardSummary
  rows: DashboardParticipantRow[]
  groups: DashboardGroup[]
  logs: OutboundMessageRow[]
}

function competenceLabels(ids: CompetenceId[] | null): string[] {
  if (!ids || ids.length === 0) return []
  return ids.map((id) => COMPETENCE_LABELS[id] || id)
}

function requiresTrainerReview(status: PositioningAiStatus | null | undefined) {
  return (
    status === 'needs_trainer_review' ||
    status === 'missing_answer' ||
    status === 'audio_unusable' ||
    status === 'ai_error'
  )
}

export function buildPositioningDashboardData({
  participants,
  invites,
  attempts,
  sectionResults,
  messages,
  groupRecommendations,
  productions = [],
}: {
  participants: ParticipantRow[]
  invites: TestInviteRow[]
  attempts: TestAttemptRow[]
  sectionResults: TestSectionResultRow[]
  messages: OutboundMessageRow[]
  groupRecommendations: GroupRecommendationRow[]
  productions?: TestProductionRow[]
}): PositioningDashboardData {
  const now = Date.now()
  const inviteMap = new Map(invites.map((invite) => [invite.participant_id, invite]))
  const attemptMap = new Map(attempts.map((attempt) => [attempt.participant_id, attempt]))
  const groupMap = new Map(groupRecommendations.map((group) => [group.participant_id, group]))
  const latestMessageMap = new Map<string, OutboundMessageRow>()
  const sectionMap = new Map<string, TestSectionResultRow[]>()
  const productionsByAttempt = new Map<string, TestProductionRow[]>()

  for (const message of messages) {
    const current = latestMessageMap.get(message.participant_id)
    if (!current || new Date(message.created_at).getTime() > new Date(current.created_at).getTime()) {
      latestMessageMap.set(message.participant_id, message)
    }
  }

  for (const result of sectionResults) {
    const current = sectionMap.get(result.attempt_id) ?? []
    current.push(result)
    sectionMap.set(result.attempt_id, current)
  }

  for (const production of productions) {
    const current = productionsByAttempt.get(production.attempt_id) ?? []
    current.push(production)
    productionsByAttempt.set(production.attempt_id, current)
  }

  const rows: DashboardParticipantRow[] = participants.map((participant) => {
    const invite = inviteMap.get(participant.id)
    const attempt = attemptMap.get(participant.id)
    const group = groupMap.get(participant.id)
    const latestMessage = latestMessageMap.get(participant.id)
    const sectionRows = attempt ? sectionMap.get(attempt.id) ?? [] : []
    const sectionScores = Object.fromEntries(
      sectionRows.map((section) => [section.section_key, `${section.score}/${section.max_score}`]),
    )
    const sectionDetails: DashboardParticipantRow['sectionDetails'] = {
      reading: null,
      listening: null,
      vocabulary: null,
      situations: null,
    }
    for (const section of sectionRows) {
      if (
        section.section_key === 'reading' ||
        section.section_key === 'listening' ||
        section.section_key === 'vocabulary' ||
        section.section_key === 'situations'
      ) {
        sectionDetails[section.section_key] = {
          score: section.score,
          max: section.max_score,
        }
      }
    }

    const attemptProductions = attempt ? productionsByAttempt.get(attempt.id) ?? [] : []
    const rawResult = (attempt?.raw_result_json ?? {}) as {
      responses?: Record<string, unknown>
      productions?: Record<string, unknown>
    }
    const answeredQuestions = rawResult.responses ? Object.keys(rawResult.responses).length : 0
    const productionsSubmittedRaw = rawResult.productions
      ? Object.keys(rawResult.productions).length
      : 0
    // En cas d'evaluation faite, on prefere le nombre de lignes test_productions
    // (productionsSubmittedRaw peut sous-compter si la sauvegarde brouillon a saute).
    const productionsSubmitted = Math.max(productionsSubmittedRaw, attemptProductions.length)
    const completedItems = answeredQuestions + productionsSubmitted
    const anomaliesRaw = Array.isArray(attempt?.anomalies_json)
      ? (attempt!.anomalies_json as unknown[]).filter(
          (item): item is string => typeof item === 'string',
        )
      : []
    const productionSummaries: DashboardProductionSummary[] = attemptProductions.map((row) => ({
      promptId: row.prompt_id,
      kind: row.kind,
      aiScore: row.ai_score,
      aiLevel: row.ai_level,
      aiStatus: row.ai_status,
      aiConfidence: row.ai_confidence,
      aiJustification: row.ai_justification,
      aiErrors: row.ai_errors || [],
      competenceLabels: competenceLabels(row.ai_competences),
      responsePreview: (row.transcription || row.response_text || '').slice(0, 240) || null,
      hasAudio: row.has_audio,
    }))
    const scoreSummary = attempt
      ? deriveAttemptScoreSummary({
          totalScore: attempt.total_score,
          provisionalScore: attempt.provisional_score,
          autoScore: attempt.auto_score,
          writingScore: attempt.writing_score,
          speakingScore: attempt.speaking_score,
          estimatedLevel: attempt.estimated_level,
          recommendedGroup: attempt.recommended_group,
        })
      : null

    const hasOpened = Boolean(invite?.opened_at)
    const hasStarted = Boolean(attempt?.started_at || invite?.started_at)
    const hasCompleted = Boolean(attempt?.completed_at || invite?.completed_at)
    const isExpired =
      Boolean(invite?.expires_at) &&
      new Date(invite!.expires_at as string).getTime() < now &&
      !hasCompleted

    const inviteStatus = !invite
      ? 'not_sent'
      : hasCompleted
        ? 'completed'
        : hasStarted
          ? 'started'
          : hasOpened
            ? 'opened'
            : isExpired
              ? 'expired'
              : invite.status

    let absenceCategory: DashboardParticipantRow['absenceCategory'] = 'none'
    if (!invite) absenceCategory = 'not_sent'
    else if (!hasOpened && !hasStarted && !hasCompleted) absenceCategory = isExpired ? 'absent' : 'non_opened'
    else if (hasOpened && !hasStarted && !hasCompleted) absenceCategory = isExpired ? 'absent' : 'non_started'
    else if (hasStarted && !hasCompleted) absenceCategory = 'incomplete'

    const aiStatus = (attempt?.ai_status as PositioningAiStatus | null) ?? null
    const needsTrainerReview =
      attempt?.status === 'completed'
        ? requiresTrainerReview(aiStatus) ||
          attemptProductions.some((production) => requiresTrainerReview(production.ai_status))
        : false

    return {
      participantId: participant.id,
      fullName: participant.full_name,
      hotel: participant.hotel,
      organization: participant.organization || 'Non renseignée',
      department: participant.department || 'Non renseigné',
      phone: participant.phone,
      email: participant.email || '',
      participantStatus: participant.status,
      inviteStatus,
      attemptStatus: attempt?.status ?? 'not_started',
      openedAt: invite?.opened_at ?? null,
      startedAt: attempt?.started_at ?? invite?.started_at ?? null,
      completedAt: attempt?.completed_at ?? invite?.completed_at ?? null,
      totalScore: scoreSummary?.totalScore ?? null,
      autoScore: attempt?.auto_score ?? null,
      writingScore: attempt?.writing_score ?? null,
      speakingScore: attempt?.speaking_score ?? null,
      provisionalScore: scoreSummary?.provisionalScore ?? null,
      aiStatus,
      needsTrainerReview,
      level: scoreSummary?.level ?? null,
      levelLabel: scoreSummary?.levelLabel ?? null,
      recommendedGroup: group?.recommended_group ?? scoreSummary?.recommendedGroup ?? null,
      durationSeconds: attempt?.duration_seconds ?? null,
      deadlineAt: invite?.deadline_at ?? null,
      absenceCategory,
      sectionScores,
      sectionDetails,
      answeredQuestions,
      totalQuestions: TOTAL_QUESTION_COUNT,
      productionsSubmitted,
      totalProductions: TOTAL_PRODUCTION_COUNT,
      completedItems,
      totalItems: TOTAL_EXPECTED_ITEMS,
      hasAnomalies: anomaliesRaw.length > 0,
      anomalies: anomaliesRaw,
      strongCompetences: competenceLabels(attempt?.strong_competences ?? null),
      weakCompetences: competenceLabels(attempt?.weak_competences ?? null),
      productions: productionSummaries,
      latestMessageId: latestMessage?.id ?? null,
      latestMessageStatus: latestMessage?.status ?? null,
      latestMessageKind: latestMessage?.message_kind ?? null,
      latestMessageBody: latestMessage?.message_body ?? null,
      latestDeliveryUrl: getDeliveryUrl(latestMessage),
      latestAccessUrl: getAccessUrl(latestMessage),
      latestMessageAt: latestMessage?.sent_at ?? latestMessage?.created_at ?? null,
    }
  })

  const summary: DashboardSummary = {
    totalParticipants: rows.length,
    totalSent: rows.filter((row) => row.inviteStatus !== 'not_sent').length,
    totalOpened: rows.filter((row) => Boolean(row.openedAt)).length,
    totalStarted: rows.filter((row) => Boolean(row.startedAt)).length,
    totalCompleted: rows.filter((row) => row.attemptStatus === 'completed').length,
    totalAbsents: rows.filter((row) => row.absenceCategory === 'absent').length,
    totalIncompletes: rows.filter((row) => row.absenceCategory === 'incomplete').length,
    totalNeedsReview: rows.filter((row) => row.needsTrainerReview).length,
    completionRate: rows.length > 0 ? Math.round((rows.filter((row) => row.attemptStatus === 'completed').length / rows.length) * 100) : 0,
  }

  const groupsMap = new Map<string, DashboardGroup>()
  for (const row of rows.filter((item) => item.recommendedGroup && item.attemptStatus === 'completed')) {
    const groupName = row.recommendedGroup as string
    const current = groupsMap.get(groupName) ?? {
      groupName,
      level: row.levelLabel || row.level || 'Niveau non estimé',
      count: 0,
      hotels: {},
      organizations: {},
      participants: [],
    }

    current.count += 1
    current.hotels[row.hotel] = (current.hotels[row.hotel] ?? 0) + 1
    current.organizations[row.organization] = (current.organizations[row.organization] ?? 0) + 1
    current.participants.push({
      participantId: row.participantId,
      fullName: row.fullName,
      hotel: row.hotel,
      organization: row.organization,
      level: row.levelLabel || row.level || 'Non estimé',
      totalScore: row.totalScore,
    })

    groupsMap.set(groupName, current)
  }

  const groups = Array.from(groupsMap.values()).sort((a, b) => a.groupName.localeCompare(b.groupName, 'fr'))
  const logs = [...messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return { summary, rows, groups, logs }
}

function getDeliveryUrl(message: OutboundMessageRow | undefined) {
  if (!message?.provider_payload || Array.isArray(message.provider_payload)) return null
  const value = (message.provider_payload as Record<string, unknown>).deliveryUrl
  return typeof value === 'string' && value.length > 0 ? value : null
}

function getAccessUrl(message: OutboundMessageRow | undefined) {
  if (!message?.provider_payload || Array.isArray(message.provider_payload)) return null
  const value = (message.provider_payload as Record<string, unknown>).accessUrl
  return typeof value === 'string' && value.length > 0 ? value : null
}
