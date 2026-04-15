import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeProgressUpdate } from '@/lib/progress-scoring'
import { checkAndAwardBadges, checkCertificationEligibility } from '@/lib/badge-logic'
import type { ActionProgressRow, SessionRow } from '@/lib/progress-scoring'

// POST /api/stats/refresh
// Recalcule la progression globale du user connecté
// Appelé par LessonClient après chaque leçon

export async function POST() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Récupérer les données nécessaires au calcul
  const [actionResult, sessionResult, progressResult] = await Promise.all([
    supabase
      .from('user_action_progress')
      .select('action_id, phrases_completed, phrases_total, quiz_score_avg, quiz_attempts, scenario_completed, scenario_score, statut')
      .eq('user_id', user.id),
    supabase
      .from('learning_sessions')
      .select('score_session, exercises_completed, start_time')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false }),
    supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single(),
  ])

  const actions = (actionResult.data || []) as ActionProgressRow[]
  const sessions = (sessionResult.data || []) as SessionRow[]
  const currentProgress = progressResult.data

  // Calculer la nouvelle progression
  const update = computeProgressUpdate(
    actions,
    sessions,
    currentProgress?.streak || 0,
    currentProgress?.last_activity_date || null
  )

  // Calculer les badges
  const existingBadges = currentProgress?.badges || []
  const updatedBadges = checkAndAwardBadges(actions, update, existingBadges)

  // Vérifier l'éligibilité à la certification
  const certStatus = currentProgress?.certification_status === 'certified'
    ? 'certified'
    : checkCertificationEligibility(actions)
      ? 'eligible'
      : 'not_eligible'

  // Upsert la progression globale
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
    return NextResponse.json({ error: 'Erreur mise à jour progression' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    progress: {
      ...update,
      badges: updatedBadges,
      certification_status: certStatus,
    },
  })
}
