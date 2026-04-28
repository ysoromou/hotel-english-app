import { NextRequest, NextResponse } from 'next/server'
import { POSITIONING_DEFAULT_GROUP_SIZE } from '@/lib/positioning/config'
import { getManagerRequestAccess } from '@/lib/positioning/access'
import { computeGroupAssignments } from '@/lib/positioning/grouping'
import { ParticipantRow, TestAttemptRow } from '@/lib/positioning/types'

export async function POST(request: NextRequest) {
  const { supabase, userId, allowed } = await getManagerRequestAccess()

  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  if (!allowed) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = (await request.json().catch(() => ({}))) as { targetGroupSize?: number }
  const targetGroupSize = Math.max(1, body.targetGroupSize || POSITIONING_DEFAULT_GROUP_SIZE)

  const [{ data: participants }, { data: attempts }] = await Promise.all([
    supabase.from('participants').select('*'),
    supabase.from('test_attempts').select('*'),
  ])

  const assignments = computeGroupAssignments({
    participants: (participants || []) as ParticipantRow[],
    attempts: (attempts || []) as TestAttemptRow[],
    targetGroupSize,
  })

  for (const assignment of assignments) {
    await supabase.from('group_recommendations').upsert(
      {
        participant_id: assignment.participantId,
        attempt_id: assignment.attemptId,
        recommended_group: assignment.recommendedGroup,
        rationale: assignment.rationale,
      },
      { onConflict: 'participant_id' },
    )

    await supabase
      .from('test_attempts')
      .update({ recommended_group: assignment.recommendedGroup })
      .eq('id', assignment.attemptId)
  }

  return NextResponse.json({
    updatedCount: assignments.length,
    groups: Array.from(new Set(assignments.map((assignment) => assignment.recommendedGroup))),
  })
}
