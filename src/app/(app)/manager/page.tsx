import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ManagerClient from './ManagerClient'

// Page server — Dashboard manager pour HR/admin
// Vérifie le rôle, charge les données, passe au client component

export default async function ManagerPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Vérifier le rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'hr' && profile.role !== 'admin')) {
    redirect('/dashboard')
  }

  // Charger tous les apprenants avec leur profil
  const { data: learners } = await supabase
    .from('profiles')
    .select('id, email, nom_complet, metier_code, etablissement, role, date_inscription')
    .eq('role', 'learner')
    .order('nom_complet')

  // Charger toute la progression globale (usage app)
  const { data: allProgress } = await supabase
    .from('user_progress')
    .select('user_id, total_xp, current_level, actions_completed, overall_score, streak, last_activity_date, certification_status')

  // Charger toutes les évaluations compétences (grille formateur)
  const { data: allEvaluations } = await supabase
    .from('evaluations_competences')
    .select('*')

  // Compter les sessions app par apprenant (usage terrain)
  const { data: sessionCounts } = await supabase
    .from('learning_sessions')
    .select('user_id')

  return (
    <ManagerClient
      learners={learners || []}
      allProgress={allProgress || []}
      allEvaluations={allEvaluations || []}
      sessionCounts={sessionCounts || []}
    />
  )
}
