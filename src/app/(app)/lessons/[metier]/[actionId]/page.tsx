import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LessonClient from './LessonClient'

// Page serveur — récupère les données de la leçon depuis Supabase
// puis passe tout au composant client qui gère l'interactivité

export default async function LessonPage({
  params,
}: {
  params: Promise<{ metier: string; actionId: string }>
}) {
  const { metier, actionId } = await params
  const prefix = decodeURIComponent(metier)
  const supabase = await createClient()

  // Vérifier la connexion
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupérer l'action
  const { data: action } = await supabase
    .from('actions_metier')
    .select('*')
    .eq('id', actionId)
    .single()

  if (!action) redirect(`/lessons/${prefix}`)

  // Récupérer les phrases de cette action
  const { data: phrases } = await supabase
    .from('phrases')
    .select('*')
    .eq('action_id', actionId)
    .order('id')

  // Récupérer les quiz de cette action
  const { data: quizzes } = await supabase
    .from('quiz')
    .select('*')
    .eq('action_id', actionId)
    .order('id')

  return (
    <LessonClient
      action={action}
      phrases={phrases ?? []}
      quizzes={quizzes ?? []}
      metierPrefix={prefix}
      userId={user.id}
    />
  )
}
