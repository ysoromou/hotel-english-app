import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RapportClient from './RapportClient'

// Page server — charge toutes les données pour le rapport client
export default async function RapportPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['hr', 'admin'].includes(profile.role)) {
    redirect('/dashboard')
  }

  // Apprenants
  const { data: learners } = await supabase
    .from('profiles')
    .select('id, nom_complet, email, metier_code, etablissement')
    .eq('role', 'learner')
    .order('nom_complet')

  // Évaluations compétences
  const { data: evaluations } = await supabase
    .from('evaluations_competences')
    .select('*')

  // Usage app
  const { data: appProgress } = await supabase
    .from('user_progress')
    .select('user_id, overall_score, actions_completed, streak, last_activity_date')

  // Sessions app
  const { data: sessions } = await supabase
    .from('learning_sessions')
    .select('user_id')

  return (
    <RapportClient
      learners={learners || []}
      evaluations={evaluations || []}
      appProgress={appProgress || []}
      sessions={sessions || []}
    />
  )
}
