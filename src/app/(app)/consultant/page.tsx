import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConsultantClient from './ConsultantClient'

// Page serveur — Interface consultant / auditeur
// Charge tous les apprenants + données nécessaires pour les 3 onglets

export default async function ConsultantPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || !['hr', 'admin'].includes(profile.role)) {
    redirect('/dashboard')
  }

  // Charger les apprenants
  const { data: learners } = await supabase
    .from('profiles')
    .select('id, email, nom_complet, metier_code, etablissement, role, niveau_actuel')
    .eq('role', 'learner')
    .order('nom_complet')

  // Charger les évaluations compétences
  const { data: evaluations } = await supabase
    .from('evaluations_competences')
    .select('learner_id, type_evaluation, score_total')

  // Charger la progression app
  const { data: appProgress } = await supabase
    .from('user_progress')
    .select('user_id, overall_score, actions_completed, current_level')

  // Charger les présences
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .order('session_date', { ascending: false })

  // Charger les validations orales J1
  const { data: oralValidations } = await supabase
    .from('oral_validation_j1')
    .select('*')

  // Charger le statut test online
  const { data: testStatus } = await supabase
    .from('test_online_status')
    .select('*')

  // Charger les réponses du test (uniquement celles avec audio pour la revue)
  const { data: testResponses } = await supabase
    .from('test_online_responses')
    .select('learner_id, question_id, section, answer_audio, pending_human_review')
    .eq('section', 'speaking')

  return (
    <ConsultantClient
      learners={learners || []}
      evaluations={evaluations || []}
      appProgress={appProgress || []}
      attendance={attendance || []}
      oralValidations={oralValidations || []}
      testStatus={testStatus || []}
      testResponses={testResponses || []}
    />
  )
}
