'use client'

import { useMemo, useState } from 'react'
import QCMExercise from '@/components/exercises/QCMExercise'
import TranslationExercise from '@/components/exercises/TranslationExercise'
import { normalizeQuizType, QUIZ_TYPE_LABELS } from '@/lib/normalizeQuizType'

interface QuizOption {
  position: number
  option_text: string
}

interface QuizExerciseProps {
  quiz: {
    id: string
    type_quiz: string
    question: string
    option_a: string | null
    option_b: string | null
    option_c: string | null
    reponse_correcte: string
    expected_answer: string | null
    audio_url: string | null
    phrase_id: string | null
    quiz_options: QuizOption[]
  }
  onComplete: (isCorrect: boolean) => void
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"«»]/g, '')
    .replace(/\s+/g, ' ')
}

function calculateFreeTextScore(userAnswer: string, correctAnswer: string): number {
  const userWords = normalizeText(userAnswer).split(' ')
  const correctWords = normalizeText(correctAnswer).split(' ')

  if (normalizeText(userAnswer) === normalizeText(correctAnswer)) return 100

  let matched = 0
  for (const word of correctWords) {
    if (userWords.includes(word)) matched++
  }

  return Math.round((matched / correctWords.length) * 100)
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const copy = [...arr]
  let s = seed
  for (let index = copy.length - 1; index > 0; index--) {
    s = (s * 9301 + 49297) % 233280
    const randomIndex = s % (index + 1)
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }
  return copy
}

function extractTranslationPrompt(question: string): string {
  const [, ...rest] = question.split(':')
  return rest.length > 0 ? rest.join(':').trim() : question
}

function inferTranslationDirection(question: string): 'fr_to_en' | 'en_to_fr' {
  const normalized = question.toLowerCase()
  if (normalized.includes('into french') || normalized.includes('en français')) {
    return 'en_to_fr'
  }

  return 'fr_to_en'
}

function parseMatchPairs(expectedAnswer: string | null, quizOptions: QuizOption[]): Array<{ left: string; right: string }> {
  if (quizOptions.length > 0) {
    return quizOptions
      .map((option) => {
        const match = option.option_text.match(/EN:\s*(.*?)\s*→\s*FR:\s*(.*)/)
        if (!match) return null
        return {
          left: match[1].trim(),
          right: match[2].trim(),
        }
      })
      .filter((pair): pair is { left: string; right: string } => pair !== null)
  }

  if (!expectedAnswer) return []

  return expectedAnswer
    .split('||')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separatorIndex = part.indexOf(':')
      if (separatorIndex < 0) return null
      return {
        left: part.slice(0, separatorIndex).trim(),
        right: part.slice(separatorIndex + 1).trim(),
      }
    })
    .filter((pair): pair is { left: string; right: string } => pair !== null)
}

let currentAudio: HTMLAudioElement | null = null

function buildAudioSource(audioUrl: string | null | undefined, fallbackText: string): string {
  if (!audioUrl) {
    return `/api/tts?text=${encodeURIComponent(fallbackText)}`
  }

  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://') || audioUrl.startsWith('/')) {
    return audioUrl
  }

  return `/${audioUrl}`
}

function playAudio(source: string, onEnd?: () => void) {
  if (typeof window === 'undefined') { onEnd?.(); return }

  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }

  const audio = new Audio(source)
  currentAudio = audio

  audio.onended = () => { currentAudio = null; onEnd?.() }
  audio.onerror = () => { currentAudio = null; onEnd?.() }
  audio.play().catch(() => { currentAudio = null; onEnd?.() })
}

export default function QuizExercise({ quiz, onComplete }: QuizExerciseProps) {
  const canonical = normalizeQuizType(quiz.type_quiz)

  if (canonical === 'TRANSLATION_ACTIVE') {
    return (
      <TranslationExercise
        phraseSource={extractTranslationPrompt(quiz.question)}
        phraseTarget={quiz.expected_answer || ''}
        direction={inferTranslationDirection(quiz.question)}
        onComplete={onComplete}
      />
    )
  }

  if (canonical === 'LISTEN_AND_SPEAK') {
    return (
      <ListenAndSpeakExercise
        question={quiz.question}
        expectedAnswer={quiz.expected_answer || ''}
        audioUrl={quiz.audio_url}
        onComplete={onComplete}
      />
    )
  }

  if (canonical === 'MATCH_TRANSLATION') {
    return (
      <MatchTranslationExercise
        question={quiz.question}
        expectedAnswer={quiz.expected_answer}
        quizOptions={quiz.quiz_options}
        onComplete={onComplete}
      />
    )
  }

  return (
    <QCMExercise
      question={quiz.question}
      optionA={quiz.option_a}
      optionB={quiz.option_b}
      optionC={quiz.option_c}
      correctAnswer={quiz.reponse_correcte}
      typeQuiz={quiz.type_quiz}
      expectedAnswer={quiz.expected_answer}
      audioUrl={quiz.audio_url}
      quizOptions={quiz.quiz_options}
      onComplete={onComplete}
    />
  )
}

function ListenAndSpeakExercise({
  question,
  expectedAnswer,
  audioUrl,
  onComplete,
}: {
  question: string
  expectedAnswer: string
  audioUrl: string | null
  onComplete: (isCorrect: boolean) => void
}) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [playing, setPlaying] = useState(false)
  const { tag, heading } = QUIZ_TYPE_LABELS.LISTEN_AND_SPEAK

  const audioSource = useMemo(
    () => buildAudioSource(audioUrl, expectedAnswer || question),
    [audioUrl, expectedAnswer, question]
  )

  const isGood = score >= 60

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answer.trim() || submitted) return
    const nextScore = calculateFreeTextScore(answer, expectedAnswer)
    setScore(nextScore)
    setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#006633]/10 text-[#006633]">
        {tag}
      </span>

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#666]">{heading}</p>

        <button
          onClick={() => {
            if (playing) return
            setPlaying(true)
            playAudio(audioSource, () => setPlaying(false))
          }}
          disabled={playing}
          className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto shadow-sm transition-all ${
            playing
              ? 'bg-[#4CAF50]/20 text-[#006633]'
              : 'bg-[#4CAF50]/15 text-[#006633] hover:bg-[#4CAF50] hover:text-white'
          }`}
        >
          <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
            {playing
              ? <rect x="6" y="5" width="4" height="14" rx="1" />
              : <path d="M8 5v14l11-7z" />
            }
          </svg>
        </button>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB]">
          <p className="text-[18px] font-extrabold text-[#000000] leading-snug">{question}</p>
          <p className="text-sm text-[#666] mt-2">Écoutez puis retapez la phrase entendue pour valider l’exercice.</p>
        </div>
      </div>

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
            onChange={(event) => setAnswer(event.target.value)}
            disabled={submitted}
            autoFocus
            placeholder="Retapez la phrase entendue..."
            className="flex-1 py-4 bg-transparent text-[#000] placeholder-[#999] outline-none text-sm font-medium"
          />
        </div>

        {!submitted && (
          <button
            type="submit"
            disabled={!answer.trim()}
            className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            Vérifier
          </button>
        )}
      </form>

      {submitted && (
        <>
          <div className={`rounded-2xl p-4 border ${
            isGood
              ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-semibold text-sm ${isGood ? 'text-[#006633]' : 'text-red-700'}`}>
              {score === 100 ? 'Parfait !' : isGood ? 'Bien !' : 'Pas tout à fait...'}
            </p>
            <p className={`text-sm mt-1 ${isGood ? 'text-[#006633]' : 'text-red-600'}`}>
              Phrase attendue : <strong>{expectedAnswer}</strong>
            </p>
          </div>

          <button
            onClick={() => onComplete(isGood)}
            className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors shadow-md"
          >
            Valider
          </button>
        </>
      )}
    </div>
  )
}

function MatchTranslationExercise({
  question,
  expectedAnswer,
  quizOptions,
  onComplete,
}: {
  question: string
  expectedAnswer: string | null
  quizOptions: QuizOption[]
  onComplete: (isCorrect: boolean) => void
}) {
  const pairs = useMemo(
    () => parseMatchPairs(expectedAnswer, quizOptions),
    [expectedAnswer, quizOptions]
  )
  const translations = useMemo(
    () => shuffleWithSeed(Array.from(new Set(pairs.map((pair) => pair.right))), question.length * 13 + 17),
    [pairs, question]
  )
  const { tag, heading } = QUIZ_TYPE_LABELS.MATCH_TRANSLATION
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = submitted && pairs.length > 0
    ? Math.round(
        (pairs.filter((pair, index) => answers[index] === pair.right).length / pairs.length) * 100
      )
    : 0
  const isPerfect = score === 100 && pairs.length > 0

  return (
    <div className="space-y-6">
      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#006633]/10 text-[#006633]">
        {tag}
      </span>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-2">{heading}</p>
        <p className="text-[18px] font-extrabold text-[#000000] leading-snug">{question}</p>
      </div>

      <div className="space-y-3">
        {pairs.map((pair, index) => (
          <label key={`${pair.left}-${index}`} className="block">
            <span className="block text-sm font-semibold text-[#333] mb-2">{pair.left}</span>
            <select
              value={answers[index] || ''}
              disabled={submitted}
              onChange={(event) => setAnswers((prev) => ({ ...prev, [index]: event.target.value }))}
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#333] outline-none focus:border-[#006633]"
            >
              <option value="">Choisissez la traduction...</option>
              {translations.map((translation) => (
                <option key={translation} value={translation}>
                  {translation}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={pairs.length === 0 || Object.keys(answers).length !== pairs.length}
          className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          Vérifier
        </button>
      )}

      {submitted && (
        <>
          <div className={`rounded-2xl p-4 border ${
            isPerfect
              ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-semibold text-sm ${isPerfect ? 'text-[#006633]' : 'text-red-700'}`}>
              {isPerfect ? 'Toutes les associations sont correctes.' : 'Certaines associations sont à revoir.'}
            </p>
            {!isPerfect && (
              <ul className="mt-2 space-y-1 text-sm text-red-600">
                {pairs.map((pair) => (
                  <li key={pair.left}>
                    <strong>{pair.left}</strong> = {pair.right}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => onComplete(isPerfect)}
            className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors shadow-md"
          >
            Valider
          </button>
        </>
      )}
    </div>
  )
}
