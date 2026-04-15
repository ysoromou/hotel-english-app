import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ONLINE_QUESTIONS_BANK } from '@/lib/testOnlineData'

// GET: Récupérer le statut actuel et les réponses
export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Chercher ou créer le statut
  let { data: status } = await supabase
    .from('test_online_status')
    .select('*')
    .eq('learner_id', user.id)
    .single()

  if (!status) {
    const { data: newStatus } = await supabase
      .from('test_online_status')
      .insert({ learner_id: user.id, statut: 'not_started' })
      .select()
      .single()
    status = newStatus
  }

  // Chercher les réponses déjà sauvegardées
  const { data: responses } = await supabase
    .from('test_online_responses')
    .select('*')
    .eq('learner_id', user.id)

  return NextResponse.json({ status, responses: responses || [] })
}

// POST: Enregistrer une réponse ou terminer le test
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const { action, question_id, answer_text, answer_audio, section } = body

  // Action SAVE_ANSWER : l'apprenant passe une question
  if (action === 'SAVE_ANSWER') {
    if (!question_id || !section) return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })

    // Auto-correction si QCM
    const question = ONLINE_QUESTIONS_BANK.find(q => q.id === question_id)
    let is_correct = null
    let pending_human_review = false

    if (question && question.type === 'mcq') {
      is_correct = (answer_text === question.correctOptionId)
    } else if (question && (question.type === 'recording' || question.type === 'open')) {
      pending_human_review = true // L'oral et l'écrit libre nécessitent relecture
    }

    // Upsert la réponse
    const { error: respError } = await supabase
      .from('test_online_responses')
      .upsert({
        learner_id: user.id,
        section,
        question_id,
        answer_text: answer_text || null,
        answer_audio: answer_audio || null,
        is_correct,
        pending_human_review
      }, { onConflict: 'learner_id,question_id' })

    if (respError) return NextResponse.json({ error: respError.message }, { status: 500 })

    // Marquer le statut comme in_progress
    await supabase
      .from('test_online_status')
      .update({ statut: 'in_progress', started_at: new Date().toISOString() })
      .eq('learner_id', user.id)
      .is('started_at', null) // Ne met à jour `started_at` que s'il est vide

    return NextResponse.json({ ok: true })
  }

  // Action COMPLETE_TEST : le candidat termine
  if (action === 'COMPLETE_TEST') {
    // 1. Calcul des scores automatiques
    const { data: responses } = await supabase
      .from('test_online_responses')
      .select('*')
      .eq('learner_id', user.id)

    let autoScore = 0
    let totalAuto = 0
    let hasPending = false

    if (responses) {
      for (const r of responses) {
        if (typeof r.is_correct === 'boolean') {
          totalAuto++
          if (r.is_correct) autoScore++
        }
        if (r.pending_human_review) {
          hasPending = true
        }
      }
    }

    // Score provisoire ramené sur 100 basé uniquement sur les questions auto-corrigées
    const score_global = totalAuto > 0 ? Math.round((autoScore / totalAuto) * 100) : 0
    
    // Niveau provisoire basé sur les 3 nouveaux groupes (MVP algorithm)
    const niveau_suggere = score_global >= 80 ? 'sufficient_level_candidate' : score_global >= 40 ? 'intermediate_group' : 'beginner_group'

    // FORCER LA VALIDATION HUMAINE SI NIVEAU SUFFISANT
    if (niveau_suggere === 'sufficient_level_candidate') {
      hasPending = true
    }

    const { error: statError } = await supabase
      .from('test_online_status')
      .update({
        statut: 'completed',
        completed_at: new Date().toISOString(),
        score_global,
        niveau_suggere,
        confiance: hasPending ? 'low' : 'medium', // Confiance faible tant que l'oral/écrit n'est pas validé
        oral_pending: hasPending,
        human_confirmation_required: hasPending
      })
      .eq('learner_id', user.id)

    if (statError) return NextResponse.json({ error: statError.message }, { status: 500 })

    return NextResponse.json({ ok: true, score_global, niveau_suggere })
  }

  return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })
}
