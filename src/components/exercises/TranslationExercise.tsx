'use client'

import { useState } from 'react'

// Exercice de traduction — l'apprenant doit traduire une phrase
// On compare sa réponse mot par mot (tolérance sur la casse et ponctuation)

interface TranslationExerciseProps {
  phraseSource: string   // La phrase à traduire
  phraseTarget: string   // La bonne réponse
  direction: 'fr_to_en' | 'en_to_fr'
  onComplete: (isCorrect: boolean) => void
}

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/[.,!?;:'"«»]/g, '').replace(/\s+/g, ' ')
}

function calculateScore(userAnswer: string, correctAnswer: string): number {
  const userWords = normalize(userAnswer).split(' ')
  const correctWords = normalize(correctAnswer).split(' ')

  if (normalize(userAnswer) === normalize(correctAnswer)) return 100

  let matched = 0
  for (const word of correctWords) {
    if (userWords.includes(word)) matched++
  }

  return Math.round((matched / correctWords.length) * 100)
}

export default function TranslationExercise({
  phraseSource, phraseTarget, direction, onComplete,
}: TranslationExerciseProps) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answer.trim() || submitted) return
    const s = calculateScore(answer, phraseTarget)
    setScore(s)
    setSubmitted(true)
  }

  const isGood = score >= 60

  return (
    <div className="space-y-5">
      {/* Tag type */}
      <span className="text-xs bg-[#006633]/10 text-[#006633] px-3 py-1 rounded-full font-semibold">
        Traduction
      </span>

      {/* Phrase source */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-2">
          {direction === 'fr_to_en' ? 'Meilleure traduction' : 'Best translation'}
        </p>
        <p className="text-[18px] font-extrabold text-[#000000] leading-snug">
          {phraseSource}
        </p>
      </div>

      {/* Zone de réponse */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={`flex items-center gap-2 border-2 rounded-2xl px-4 transition-all ${
          submitted
            ? isGood
              ? 'border-[#4CAF50] bg-[#4CAF50]/5'
              : 'border-red-300 bg-red-50'
            : 'border-[#E5E7EB] bg-white focus-within:border-[#006633] focus-within:ring-2 focus-within:ring-[#006633]/10'
        }`}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            autoFocus
            placeholder={direction === 'fr_to_en' ? 'Type in English…' : 'Écrivez en français…'}
            className="flex-1 py-4 bg-transparent text-[#000] placeholder-[#999] outline-none text-sm font-medium"
          />
          {submitted && !isGood && (
            <div className="w-6 h-6 shrink-0 rounded-full bg-red-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          )}
          {submitted && isGood && (
            <div className="w-6 h-6 shrink-0 rounded-full bg-[#4CAF50] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          )}
        </div>

        {/* Champ grisé (indice visuel 2e ligne comme dans la maquette) */}
        {!submitted && (
          <div className="border border-[#E5E7EB] rounded-2xl px-4 py-4 bg-[#F5F5F5]" />
        )}

        {!submitted && (
          <button
            type="submit"
            disabled={!answer.trim()}
            className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            style={{ boxShadow: '0 4px 16px rgba(0,102,51,0.25)' }}
          >
            Vérifier
          </button>
        )}
      </form>

      {/* Feedback */}
      {submitted && (
        <>
          <div className={`rounded-2xl p-4 border ${
            isGood
              ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-semibold text-sm ${isGood ? 'text-[#006633]' : 'text-red-700'}`}>
              {score === 100 ? 'Parfait !' : isGood ? 'Bien !' : 'Pas tout à fait…'}
            </p>
            {!isGood && (
              <p className="text-sm text-red-600 mt-1">
                La bonne réponse était : <strong>{phraseTarget}</strong>
              </p>
            )}
            {isGood && score < 100 && (
              <p className="text-sm text-[#006633] mt-1">
                Réponse attendue : <strong>{phraseTarget}</strong>
              </p>
            )}
          </div>

          <button
            onClick={() => onComplete(isGood)}
            className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors shadow-md"
            style={{ boxShadow: '0 4px 16px rgba(0,102,51,0.25)' }}
          >
            Valider
          </button>
        </>
      )}
    </div>
  )
}
