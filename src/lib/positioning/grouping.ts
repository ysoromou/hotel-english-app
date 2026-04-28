import { buildRecommendedGroupLabel } from '@/lib/positioning/scoring'
import { ParticipantRow, TestAttemptRow } from '@/lib/positioning/types'

export interface GroupAssignment {
  participantId: string
  attemptId: string
  recommendedGroup: string
  rationale: string
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
    .filter((attempt) => attempt.status === 'completed' && attempt.estimated_level)
    .sort((a, b) => {
      const levelCompare = String(a.estimated_level).localeCompare(String(b.estimated_level), 'fr')
      if (levelCompare !== 0) return levelCompare

      const participantA = participantMap.get(a.participant_id)
      const participantB = participantMap.get(b.participant_id)
      const hotelCompare = (participantA?.hotel || '').localeCompare(participantB?.hotel || '', 'fr')
      if (hotelCompare !== 0) return hotelCompare

      return (participantA?.full_name || '').localeCompare(participantB?.full_name || '', 'fr')
    })

  const buckets = new Map<string, TestAttemptRow[]>()
  for (const attempt of completedAttempts) {
    const levelKey = attempt.estimated_level as string
    const current = buckets.get(levelKey) ?? []
    current.push(attempt)
    buckets.set(levelKey, current)
  }

  const assignments: GroupAssignment[] = []
  for (const [levelKey, bucket] of buckets.entries()) {
    const totalGroups = Math.max(1, Math.ceil(bucket.length / Math.max(1, targetGroupSize)))
    for (let groupIndex = 0; groupIndex < totalGroups; groupIndex += 1) {
      const members = bucket.slice(groupIndex * targetGroupSize, (groupIndex + 1) * targetGroupSize)
      const recommendedGroup = buildRecommendedGroupLabel(levelKey, groupIndex, totalGroups)

      const hotelBreakdown = members.reduce<Record<string, number>>((acc, attempt) => {
        const hotel = participantMap.get(attempt.participant_id)?.hotel || 'Non renseigné'
        acc[hotel] = (acc[hotel] ?? 0) + 1
        return acc
      }, {})

      const organizationBreakdown = members.reduce<Record<string, number>>((acc, attempt) => {
        const organization = participantMap.get(attempt.participant_id)?.organization || 'Non renseignée'
        acc[organization] = (acc[organization] ?? 0) + 1
        return acc
      }, {})

      const rationale = [
        `Niveau homogène ${levelKey}.`,
        `Effectif cible ${targetGroupSize}, effectif affecté ${members.length}.`,
        `Hôtels: ${Object.entries(hotelBreakdown)
          .map(([name, count]) => `${name} (${count})`)
          .join(', ')}.`,
        `Répartition organisations: ${Object.entries(organizationBreakdown)
          .map(([name, count]) => `${name} (${count})`)
          .join(', ')}.`,
      ].join(' ')

      for (const member of members) {
        assignments.push({
          participantId: member.participant_id,
          attemptId: member.id,
          recommendedGroup,
          rationale,
        })
      }
    }
  }

  return assignments
}
