import { buildRecommendedGroupLabel, deriveAttemptScoreSummary } from '@/lib/positioning/scoring'
import { ParticipantRow, PositioningLevelKey, TestAttemptRow } from '@/lib/positioning/types'

export interface GroupAssignment {
  participantId: string
  attemptId: string
  recommendedGroup: string
  rationale: string
}

interface CompletedAttemptEntry {
  attempt: TestAttemptRow
  level: PositioningLevelKey
}

export function computeGroupAssignments({
  participants,
  attempts,
  targetGroupSize,
}: {
  participants: ParticipantRow[]
  attempts: TestAttemptRow[]
  targetGroupSize: number
}) {
  const participantMap = new Map(participants.map((participant) => [participant.id, participant]))
  const completedAttempts = attempts
    .filter((attempt) => attempt.status === 'completed')
    .map((attempt) => {
      const summary = deriveAttemptScoreSummary({
        totalScore: attempt.total_score,
        provisionalScore: attempt.provisional_score,
        autoScore: attempt.auto_score,
        writingScore: attempt.writing_score,
        speakingScore: attempt.speaking_score,
        estimatedLevel: attempt.estimated_level,
        recommendedGroup: attempt.recommended_group,
      })

      return summary.level
        ? {
            attempt,
            level: summary.level,
          }
        : null
    })
    .filter((entry): entry is CompletedAttemptEntry => Boolean(entry))
    .sort((a, b) => {
      const levelCompare = a.level.localeCompare(b.level, 'fr')
      if (levelCompare !== 0) return levelCompare

      const participantA = participantMap.get(a.attempt.participant_id)
      const participantB = participantMap.get(b.attempt.participant_id)
      const hotelCompare = (participantA?.hotel || '').localeCompare(participantB?.hotel || '', 'fr')
      if (hotelCompare !== 0) return hotelCompare

      return (participantA?.full_name || '').localeCompare(participantB?.full_name || '', 'fr')
    })

  const buckets = new Map<string, CompletedAttemptEntry[]>()
  for (const entry of completedAttempts) {
    const current = buckets.get(entry.level) ?? []
    current.push(entry)
    buckets.set(entry.level, current)
  }

  const assignments: GroupAssignment[] = []
  for (const [levelKey, bucket] of buckets.entries()) {
    const totalGroups = Math.max(1, Math.ceil(bucket.length / Math.max(1, targetGroupSize)))
    for (let groupIndex = 0; groupIndex < totalGroups; groupIndex += 1) {
      const members = bucket.slice(groupIndex * targetGroupSize, (groupIndex + 1) * targetGroupSize)
      const recommendedGroup = buildRecommendedGroupLabel(levelKey, groupIndex, totalGroups)

      const hotelBreakdown = members.reduce<Record<string, number>>((acc, member) => {
        const hotel = participantMap.get(member.attempt.participant_id)?.hotel || 'Non renseigne'
        acc[hotel] = (acc[hotel] ?? 0) + 1
        return acc
      }, {})

      const organizationBreakdown = members.reduce<Record<string, number>>((acc, member) => {
        const organization =
          participantMap.get(member.attempt.participant_id)?.organization || 'Non renseignee'
        acc[organization] = (acc[organization] ?? 0) + 1
        return acc
      }, {})

      const rationale = [
        `Niveau homogene ${levelKey}.`,
        `Effectif cible ${targetGroupSize}, effectif affecte ${members.length}.`,
        `Hotels: ${Object.entries(hotelBreakdown)
          .map(([name, count]) => `${name} (${count})`)
          .join(', ')}.`,
        `Repartition organisations: ${Object.entries(organizationBreakdown)
          .map(([name, count]) => `${name} (${count})`)
          .join(', ')}.`,
      ].join(' ')

      for (const member of members) {
        assignments.push({
          participantId: member.attempt.participant_id,
          attemptId: member.attempt.id,
          recommendedGroup,
          rationale,
        })
      }
    }
  }

  return assignments
}
