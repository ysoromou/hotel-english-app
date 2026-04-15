'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PhraseCard from '@/components/exercises/PhraseCard'
import QCMExercise from '@/components/exercises/QCMExercise'
import TranslationExercise from '@/components/exercises/TranslationExercise'
import ProgressBar from '@/components/ui/ProgressBar'
import { ArrowLeft } from 'lucide-react'

// Composant client qui gère le déroulement de la leçon
// Enchaîne : 5 phrases → 2 traductions → quiz disponibles
// Sauvegarde la progression dans Supabase à la fin

const phaseLabels: Record<string, string> = {
  decouverte: 'Découverte',
  pratique: 'Pratique',
  maitrise: 'Maîtrise',
}

interface LessonClientProps {
  action: {
    id: string
    metier: string
    action: string
    description: string
    niveau_cible: string
  }
  phrases: {
    id: string
    phrase_fr: string
    phrase_en: string
    phase: string
    voice_type: string
  }[]
  quizzes: {
    id: string
    type_quiz: string
    question: string
    option_a: string
    option_b: string
    option_c: string | null
    reponse_correcte: string
  }[]
  metierPrefix: string
  userId: string
}

// Construire la séquence d'exercices pour la leçon
function buildExerciseSequence(
  phrases: LessonClientProps['phrases'],
  quizzes: LessonClientProps['quizzes']
) {
  const steps: Array<
    | { type: 'phrase'; data: LessonClientProps['phrases'][0] }
    | { type: 'translation'; data: LessonClientProps['phrases'][0] }
    | { type: 'quiz'; data: LessonClientProps['quizzes'][0] }
  > = []

  // Prendre les 5 premières phrases (écoute/lecture)
  const phrasesToShow = phrases.slice(0, 5)
  for (const p of phrasesToShow) {
    steps.push({ type: 'phrase', data: p })
  }

  // Ajouter 2 exercices de traduction (phrases suivantes)
  const phrasesForTranslation = phrases.slice(5, 7)
  for (const p of phrasesForTranslation) {
    steps.push({ type: 'translation', data: p })
  }

  // Ajouter tous les quiz disponibles
  for (const q of quizzes) {
    steps.push({ type: 'quiz', data: q })
  }

  return steps
}

export default function LessonClient({
  action, phrases, quizzes, metierPrefix, userId,
}: LessonClientProps) {
  const steps = buildExerciseSequence(phrases, quizzes)
  const [currentStep, setCurrentStep] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [finished, setFinished] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const progress = steps.length > 0 ? Math.round((currentStep / steps.length) * 100) : 0

  async function saveProgress() {
    // Garde-fou : ne pas sauvegarder si données essentielles manquantes
    if (!userId || !action?.id) {
      console.warn('saveProgress: userId ou action.id manquant, sauvegarde ignorée')
      return
    }

    try {
      const score = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0

      await supabase.from('user_action_progress').upsert({
        user_id: userId,
        action_id: action.id,
        phrases_completed: Math.min(currentStep, phrases.length),
        phrases_total: phrases.length,
        quiz_score_avg: score,
        quiz_attempts: totalAnswered,
        statut: 'completed',
        derniere_activite: new Date().toISOString(),
      }, {
        onConflict: 'user_id,action_id',
      })

      // Recalculer la progression globale (badges, XP, streak, etc.)
      fetch('/api/stats/refresh', { method: 'POST' }).catch(() => {})
    } catch (err) {
      console.error('saveProgress: erreur Supabase', err)
    }
  }

  function handleNext(isCorrect?: boolean) {
    if (isCorrect !== undefined) {
      setTotalAnswered(prev => prev + 1)
      if (isCorrect) setCorrectCount(prev => prev + 1)
    }

    if (currentStep + 1 >= steps.length) {
      setFinished(true)
      saveProgress()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Écran de fin
  if (finished) {
    const score = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 100
    const isGood = score >= 60

    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isGood ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <span className="text-4xl">{isGood ? '🎉' : '💪'}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {isGood ? 'Bravo !' : 'Continue !'}
          </h1>
          <p className="mt-2 text-gray-500">
            {action.action}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-3xl font-bold text-primary">{score}%</p>
              <p className="text-xs text-gray-500 mt-1">Score</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-3xl font-bold text-success">{correctCount}/{totalAnswered}</p>
              <p className="text-xs text-gray-500 mt-1">Bonnes réponses</p>
            </div>
          </div>

          {/* Boutons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => {
                setCurrentStep(0)
                setCorrectCount(0)
                setTotalAnswered(0)
                setFinished(false)
              }}
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
            >
              Refaire la leçon
            </button>
            <button
              onClick={() => router.push(`/lessons/${metierPrefix}`)}
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Retour aux actions
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Écran d'exercice en cours
  const step = steps[currentStep]

  return (
    <div className="min-h-dvh bg-gray-50/50">
      {/* Barre Header Clean White */}
      <div className="bg-white px-5 pt-6 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-md mx-auto flex flex-col gap-5">
          {/* Header row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/lessons/${metierPrefix}`)}
              className="text-gray-900 hover:text-brand-dark p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight line-clamp-1 flex-1">
              {step.type === 'phrase' && phaseLabels[step.data.phase as keyof typeof phaseLabels] || 'Quiz'} - {action.action}
            </h1>
          </div>
          
          {/* Progress Row */}
          <div className="px-1">
            <p className="text-[11px] font-black uppercase text-brand-dark tracking-widest mb-2">Question {currentStep + 1} sur {steps.length}</p>
            <ProgressBar value={progress} color="bg-brand-dark" size="md" />
          </div>
        </div>
      </div>

      {/* Contenu de l'exercice */}
      <div className="px-5 pt-8 pb-24">
        <div className="max-w-md mx-auto">
          {step.type === 'phrase' && (
            <PhraseCard
              key={step.data.id}
              phraseFr={step.data.phrase_fr}
              phraseEn={step.data.phrase_en}
              phase={step.data.phase}
              voiceType={step.data.voice_type}
              onComplete={() => handleNext()}
            />
          )}

          {step.type === 'translation' && (
            <TranslationExercise
              key={step.data.id}
              phraseSource={step.data.phrase_fr}
              phraseTarget={step.data.phrase_en}
              direction="fr_to_en"
              onComplete={(isCorrect) => handleNext(isCorrect)}
            />
          )}

          {step.type === 'quiz' && (
            <QCMExercise
              key={step.data.id}
              question={step.data.question}
              optionA={step.data.option_a}
              optionB={step.data.option_b}
              optionC={step.data.option_c}
              correctAnswer={step.data.reponse_correcte}
              typeQuiz={step.data.type_quiz}
              onComplete={(isCorrect) => handleNext(isCorrect)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
