import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loadLearningSessionsWithFallback } from '@/lib/learning-sessions'
import { computeProgressUpdate } from '@/lib/progress-scoring'
import { checkAndAwardBadges, checkCertificationEligibility } from '@/lib/badge-logic'
import type { ActionProgressRow, SessionRow } from '@/lib/progress-scoring'

async function loadActionProgress(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ActionProgressRow[]> {
  const richResult = await supabase
    .from('user_action_progress')
    .select('action_id, phrases_completed, phrases_total, quiz_score_avg, quiz_attempts, scenario_completed, scenario_score, statut')
    .eq('user_id', userId)

  if (!richResult.error) {
    return (richResult.data || []) as ActionProgressRow[]
  }

  const fallbackResult = await supabase
    .from('user_action_progress')
    .select('action_id, phrases_completed, phrases_total, quiz_score_avg, quiz_attempts, statut')
    .eq('user_id', userId)

  return (fallbackResult.data || []).map((row) => ({
    ...row,
    scenario_completed: false,
    scenario_score: null,
  })) as ActionProgressRow[]
}

// POST /api/stats/refresh
// Recalcule la progression globale du user connecte
// Appele par LessonClient apres chaque lecon
export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
    }

    const [actions, sessionResult, progressResult] = await Promise.all([
      loadActionProgress(supabase, user.id),
      loadLearningSessionsWithFallback(supabase, user.id),
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    const sessions = sessionResult.rows as SessionRow[]
    const currentProgress = progressResult.data

    const update = computeProgressUpdate(
      actions,
      sessions,
      currentProgress?.streak || 0,
      currentProgress?.last_activity_date || null
    )

    const existingBadges = currentProgress?.badges || []
    const updatedBadges = checkAndAwardBadges(actions, update, existingBadges)

    const certStatus = currentProgress?.certification_status === 'certified'
      ? 'certified'
      : checkCertificationEligibility(actions)
        ? 'eligible'
        : 'not_eligible'

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        total_xp: update.total_xp,
        current_level: update.current_level,
        actions_completed: update.actions_completed,
        actions_mastered: update.actions_mastered,
        overall_score: update.overall_score,
        streak: update.streak,
        last_activity_date: new Date().toISOString().split('T')[0],
        badges: updatedBadges,
        certification_status: certStatus,
      }, {
        onConflict: 'user_id',
      })

    if (error) {
      return NextResponse.json({ error: 'Erreur mise a jour progression' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      progress: {
        ...update,
        badges: updatedBadges,
        certification_status: certStatus,
      },
    })
  } catch (error) {
    console.error('stats/refresh: erreur learning_sessions', error)
    return NextResponse.json({ error: 'Erreur lecture learning_sessions' }, { status: 500 })
  }
}
