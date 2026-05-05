import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LessonClient from './LessonClient'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ metier: string; actionId: string }>
}) {
  const { metier, actionId } = await params
  const prefix = decodeURIComponent(metier)
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: action } = await supabase
    .from('actions_metier')
    .select('*')
    .eq('id', actionId)
    .single()

  if (!action) redirect(`/lessons/${prefix}`)

  const [phrasesResult, quizzesResult] = await Promise.all([
    supabase
      .from('phrases')
      .select('*')
      .eq('action_id', actionId)
      .order('id'),
    supabase
      .from('quiz')
      .select('*')
      .eq('action_id', actionId)
      .order('id'),
  ])

  const quizzes = quizzesResult.data ?? []
  const quizIds = quizzes.map((quiz) => quiz.id)
  const quizOptionsResult = quizIds.length === 0
    ? { data: [] as Array<{ quiz_id: string; position: number; option_text: string }> }
    : await supabase
        .from('quiz_options')
        .select('quiz_id, position, option_text')
        .in('quiz_id', quizIds)
        .order('position')

  const quizOptions = quizOptionsResult.data ?? []
  const quizzesWithOptions = quizzes.map((quiz) => ({
    ...quiz,
    quiz_options: quizOptions.filter((option) => option.quiz_id === quiz.id),
  }))

  return (
    <LessonClient
      action={action}
      phrases={phrasesResult.data ?? []}
      quizzes={quizzesWithOptions}
      metierPrefix={prefix}
      userId={user.id}
    />
  )
}
