// POST /api/evaluations
// Sauvegarde une évaluation des 15 compétences transverses
// Score total /45 calculé par Supabase (GENERATED ALWAYS)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const COMPETENCE_KEYS = [
  'accueillir_client',
  'comprendre_demande',
  'repondre_demande',
  'donner_information',
  'orienter_client',
  'verifier_information',
  'reformuler_confirmer',
  'gerer_reclamation',
  'proposer_solution',
  'gerer_situation_difficile',
  'utiliser_vocabulaire_metier',
  'maintenir_echange_fluide',
  'gerer_appel',
  'conclure_interaction',
  'dire_non_professionnellement',
] as const

type CompetenceKey = typeof COMPETENCE_KEYS[number]

interface EvalBody {
  learner_id: string
  type_evaluation: 'avant' | 'apres'
  promotion?: string
  observation_terrain?: string
  scores: Record<CompetenceKey, number>
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || !['hr', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await req.json() as EvalBody
  const { learner_id, type_evaluation, promotion, observation_terrain, scores } = body

  if (!learner_id || !type_evaluation) {
    return NextResponse.json({ error: 'learner_id et type_evaluation requis' }, { status: 400 })
  }

  const competenceScores: Record<string, number> = {}
  for (const key of COMPETENCE_KEYS) {
    const val = scores?.[key]
    competenceScores[key] = (typeof val === 'number' && val >= 0 && val <= 3) ? Math.round(val) : 0
  }

  const payload = {
    learner_id,
    evaluateur_id: user.id,
    type_evaluation,
    promotion: promotion || null,
    observation_terrain: observation_terrain || null,
    ...competenceScores,
  }

  const { data, error } = await supabase
    .from('evaluations_competences')
    .upsert(payload, { onConflict: 'learner_id,type_evaluation' })
    .select()
    .single()

  if (error) {
    console.error('Erreur upsert evaluation:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, evaluation: data })
}
