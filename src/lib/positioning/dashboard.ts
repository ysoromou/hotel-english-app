import {
  GroupRecommendationRow,
  OutboundMessageRow,
  ParticipantRow,
  TestAttemptRow,
  TestInviteRow,
  TestSectionResultRow,
} from '@/lib/positioning/types'
import { buildRecommendedGroupLabel, getLevelMeta } from '@/lib/positioning/scoring'

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
  level: string | null
  levelLabel: string | null
  recommendedGroup: string | null
  durationSeconds: number | null
  deadlineAt: string | null
  absenceCategory: 'none' | 'not_sent' | 'non_opened' | 'non_started' | 'incomplete' | 'absent'
  sectionScores: Record<string, string>
}

export interface DashboardSummary {
  totalParticipants: number
  totalSent: number
  totalOpened: number
  totalStarted: number
  totalCompleted: number
  totalAbsents: number
  totalIncompletes: number
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

export function buildPositioningDashboardData({
  participants,
  invites,
  attempts,
  sectionResults,
  messages,
  groupRecommendations,
}: {
  participants: ParticipantRow[]
  invites: TestInviteRow[]
  attempts: TestAttemptRow[]
  sectionResults: TestSectionResultRow[]
  messages: OutboundMessageRow[]
  groupRecommendations: GroupRecommendationRow[]
}): PositioningDashboardData {
  const now = Date.now()
  const inviteMap = new Map(invites.map((invite) => [invite.participant_id, invite]))
  const attemptMap = new Map(attempts.map((attempt) => [attempt.participant_id, attempt]))
  const groupMap = new Map(groupRecommendations.map((group) => [group.participant_id, group]))
  const sectionMap = new Map<string, TestSectionResultRow[]>()

  for (const result of sectionResults) {
    const current = sectionMap.get(result.attempt_id) ?? []
    current.push(result)
    sectionMap.set(result.attempt_id, current)
  }

  const rows: DashboardParticipantRow[] = participants.map((participant) => {
    const invite = inviteMap.get(participant.id)
    const attempt = attemptMap.get(participant.id)
    const levelMeta = getLevelMeta(attempt?.estimated_level ?? null)
    const group = groupMap.get(participant.id)
    const sectionScores = Object.fromEntries(
      (attempt ? sectionMap.get(attempt.id) ?? [] : []).map((section) => [
        section.section_key,
        `${section.score}/${section.max_score}`,
      ]),
    )

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
      totalScore: attempt?.total_score ?? null,
      level: attempt?.estimated_level ?? null,
      levelLabel: attempt?.estimated_level ? levelMeta.label : null,
      recommendedGroup:
        group?.recommended_group ??
        attempt?.recommended_group ??
        (attempt?.estimated_level ? buildRecommendedGroupLabel(attempt.estimated_level, 0, 1) : null),
      durationSeconds: attempt?.duration_seconds ?? null,
      deadlineAt: invite?.deadline_at ?? null,
      absenceCategory,
      sectionScores,
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

  return {
    summary,
    rows,
    groups,
    logs,
  }
}
