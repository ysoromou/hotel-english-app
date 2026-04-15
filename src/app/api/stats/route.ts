import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/stats
// Learner → sa progression globale + ses actions
// HR/admin → summary agrégé + liste de tous les apprenants

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Récupérer le profil pour connaître le rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, metier_code, nom_complet')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
  }

  const isManager = profile.role === 'hr' || profile.role === 'admin'

  if (isManager) {
    // ── Vue manager : tous les apprenants ──
    const { data: learners } = await supabase
      .from('profiles')
      .select('id, email, nom_complet, metier_code, role, date_inscription')
      .eq('role', 'learner')
      .order('nom_complet')

    const { data: allProgress } = await supabase
      .from('user_progress')
      .select('*')

    const { data: allActionProgress } = await supabase
      .from('user_action_progress')
      .select('*')

    // Construire un map de progression par user_id
    const progressMap = new Map<string, typeof allProgress extends (infer T)[] | null ? T : never>()
    if (allProgress) {
      for (const p of allProgress) {
        progressMap.set(p.user_id, p)
      }
    }

    // Actions par user_id
    const actionsMap = new Map<string, typeof allActionProgress>()
    if (allActionProgress) {
      for (const a of allActionProgress) {
        const existing = actionsMap.get(a.user_id) || []
        existing.push(a)
        actionsMap.set(a.user_id, existing)
      }
    }

    // Assembler la liste des apprenants avec leurs stats
    const learnerStats = (learners || []).map(l => ({
      ...l,
      progress: progressMap.get(l.id) || null,
      actions: actionsMap.get(l.id) || [],
    }))

    // Summary agrégé
    const totalLearners = learnerStats.length
    const activeLearners = learnerStats.filter(l => l.progress && l.progress.actions_completed > 0).length
    const certifiedCount = learnerStats.filter(l => l.progress?.certification_status === 'certified').length
    const avgScore = totalLearners > 0
      ? Math.round(learnerStats.reduce((sum, l) => sum + (l.progress?.overall_score || 0), 0) / totalLearners * 100) / 100
      : 0

    return NextResponse.json({
      role: 'manager',
      summary: {
        total_learners: totalLearners,
        active_learners: activeLearners,
        average_score: avgScore,
        certified_count: certifiedCount,
      },
      learners: learnerStats,
    })
  }

  // ── Vue learner : sa propre progression ──
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: actions } = await supabase
    .from('user_action_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('derniere_activite', { ascending: false })

  return NextResponse.json({
    role: 'learner',
    progress: progress || null,
    actions: actions || [],
  })
}
