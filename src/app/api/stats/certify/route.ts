import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { BadgeCode } from '@/types'

// POST /api/stats/certify
// Permet à un HR/admin de certifier un apprenant
// Body : { learner_id: string }

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Vérifier que l'utilisateur est HR ou admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'hr' && profile.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé — rôle HR ou admin requis' }, { status: 403 })
  }

  // Lire le body
  const body = await request.json()
  const learnerId = body.learner_id

  if (!learnerId || typeof learnerId !== 'string') {
    return NextResponse.json({ error: 'learner_id requis' }, { status: 400 })
  }

  // Vérifier que l'apprenant existe et est éligible
  const { data: learnerProgress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', learnerId)
    .single()

  if (!learnerProgress) {
    return NextResponse.json({ error: 'Apprenant introuvable' }, { status: 404 })
  }

  if (learnerProgress.certification_status === 'certified') {
    return NextResponse.json({ error: 'Apprenant déjà certifié' }, { status: 400 })
  }

  // Ajouter le badge CERTIFIED aux badges existants
  const badges: BadgeCode[] = learnerProgress.badges || []
  if (!badges.includes('CERTIFIED')) {
    badges.push('CERTIFIED')
  }

  // Mettre à jour la certification
  const { error } = await supabase
    .from('user_progress')
    .update({
      certification_status: 'certified',
      certified_at: new Date().toISOString(),
      certified_by: user.id,
      badges,
    })
    .eq('user_id', learnerId)

  if (error) {
    return NextResponse.json({ error: 'Erreur mise à jour certification' }, { status: 500 })
  }

  return NextResponse.json({ success: true, learner_id: learnerId })
}
