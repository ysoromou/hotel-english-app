import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileClient from './ProfileClient'

// Page profil — affiche les infos de l'utilisateur et permet de choisir son métier

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Récupérer les stats de progression
  const { data: progress } = await supabase
    .from('user_action_progress')
    .select('statut')
    .eq('user_id', user.id)

  const stats = {
    total: progress?.length ?? 0,
    completed: progress?.filter(p => p.statut === 'completed' || p.statut === 'mastered').length ?? 0,
    mastered: progress?.filter(p => p.statut === 'mastered').length ?? 0,
  }

  return (
    <ProfileClient
      profile={profile}
      email={user.email ?? ''}
      stats={stats}
    />
  )
}
