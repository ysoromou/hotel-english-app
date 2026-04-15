import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // 1. Vérifier privilèges (Séparation auto vs officiel + Admin Only)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || !['hr', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Accès refusé. Réservé aux consultants.' }, { status: 403 })
  }

  // 2. Traiter le payload
  const body = await req.json()
  const { learner_id, niveau_confirme, a_revoir_seance_2, commentaire } = body

  if (!learner_id || !niveau_confirme) {
    return NextResponse.json({ error: 'Données incomplètes (learner_id, niveau_confirme)' }, { status: 400 })
  }

  if (niveau_confirme === 'sufficient_level_candidate' && (!commentaire || commentaire.trim() === '')) {
    return NextResponse.json({ error: 'Un commentaire est obligatoire pour valider le niveau suffisant (sortie du parcours collectif).' }, { status: 400 })
  }

  // 3. Mettre à jour `test_online_status`
  // Le niveau_confirme officiel (consultant) est stocké ici, indépendamment du niveau_suggere (auto)
  const { error: statError } = await supabase
    .from('test_online_status')
    .update({ 
        niveau_confirme, 
        a_revoir_seance_2: a_revoir_seance_2 || false,
        commentaire: commentaire || null,
        confirmation_consultant: true,
        human_confirmation_required: false,
        oral_pending: false,
        confiance: 'high' // L'humain a validé, la confiance devient maximale
    })
    .eq('learner_id', learner_id)

  if (statError) {
    return NextResponse.json({ error: statError.message }, { status: 500 })
  }

  // Optionnel : Mettre à jour test_online_responses pour marquer le pending_human_review à false
  await supabase
    .from('test_online_responses')
    .update({ pending_human_review: false })
    .eq('learner_id', learner_id)
    .eq('pending_human_review', true)

  return NextResponse.json({ ok: true })
}
