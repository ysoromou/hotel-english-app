// POST /api/oral-validation — Saisie validation orale J1
// GET  /api/oral-validation — Liste toutes les validations orales

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ORAL_KEYS = [
  'comprend_demande',
  'repond_pertinent',
  'reste_fluide',
  'vocabulaire_metier',
  'ton_professionnel',
] as const

interface OralBody {
  learner_id: string
  scores: Record<string, number>
  niveau_suggere_app?: string
  niveau_confirme?: string
  a_revoir_seance_2?: boolean
  commentaire?: string
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

  const body = await req.json() as OralBody
  const { learner_id, scores, niveau_suggere_app, niveau_confirme, a_revoir_seance_2, commentaire } = body

  if (!learner_id) {
    return NextResponse.json({ error: 'learner_id requis' }, { status: 400 })
  }

  // Valider et borner les scores 0-3
  const oralScores: Record<string, number> = {}
  for (const key of ORAL_KEYS) {
    const val = scores?.[key]
    oralScores[key] = (typeof val === 'number' && val >= 0 && val <= 3) ? Math.round(val) : 0
  }

  const { data, error } = await supabase
    .from('oral_validation_j1')
    .upsert({
      learner_id,
      evaluateur_id: user.id,
      ...oralScores,
      niveau_suggere_app: niveau_suggere_app || null,
      niveau_confirme: niveau_confirme || null,
      a_revoir_seance_2: a_revoir_seance_2 ?? false,
      commentaire: commentaire || null,
    }, {
      onConflict: 'learner_id',
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur upsert oral_validation:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, validation: data })
}

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || !['hr', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('oral_validation_j1')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ validations: data || [] })
}
