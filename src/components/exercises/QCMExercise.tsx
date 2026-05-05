'use client'

import { useState, useMemo, useCallback } from 'react'
import { normalizeQuizType, QUIZ_TYPE_LABELS } from '@/lib/normalizeQuizType'

interface QuizOption {
  position: number
  option_text: string
}

interface QCMExerciseProps {
  question: string
  optionA: string | null
  optionB: string | null
  optionC: string | null
  correctAnswer: string
  typeQuiz: string
  expectedAnswer?: string | null
  audioUrl?: string | null
  quizOptions?: QuizOption[]
  onComplete: (isCorrect: boolean) => void
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildAudioSource(audioUrl: string | null | undefined, fallbackText: string): string {
  if (!audioUrl) {
    return `/api/tts?text=${encodeURIComponent(fallbackText)}`
  }

  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://') || audioUrl.startsWith('/')) {
    return audioUrl
  }

  return `/${audioUrl}`
}

let currentAudio: HTMLAudioElement | null = null

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

export default function QCMExercise({
  question,
  optionA,
  optionB,
  optionC,
  correctAnswer,
  typeQuiz,
  expectedAnswer = null,
  audioUrl = null,
  quizOptions = [],
  onComplete,
}: QCMExerciseProps) {
  const canonical = normalizeQuizType(typeQuiz)
  const { tag, heading } = QUIZ_TYPE_LABELS[canonical]

  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [builtSequence, setBuiltSequence] = useState<string[]>([])
  const [orderValidated, setOrderValidated] = useState(false)
  const [orderIsCorrect, setOrderIsCorrect] = useState(false)

  const audioSource = useMemo(
    () => buildAudioSource(audioUrl, question),
    [audioUrl, question]
  )

  const orderedQuizOptions = useMemo(
    () => [...quizOptions].sort((a, b) => a.position - b.position),
    [quizOptions]
  )

  const allOptions = useMemo(() => {
    if (orderedQuizOptions.length > 0 && canonical === 'LISTEN_AND_SELECT') {
      return orderedQuizOptions.map((option, index) => ({
        label: String.fromCharCode(65 + index),
        text: option.option_text,
      }))
    }

    return [
      optionA ? { label: 'A', text: optionA } : null,
      optionB ? { label: 'B', text: optionB } : null,
      optionC ? { label: 'C', text: optionC } : null,
    ].filter((option): option is { label: string; text: string } => option !== null)
  }, [canonical, optionA, optionB, optionC, orderedQuizOptions])

  const visibleOptions = canonical === 'TONE_CHECK' ? allOptions.slice(0, 2) : allOptions
  const correctOptionText = allOptions.find((option) => option.label === correctAnswer)?.text ?? expectedAnswer ?? ''

  const targetItems = useMemo(() => {
    if (canonical !== 'ORDER_SEQUENCE') return []

    if (orderedQuizOptions.length > 0) {
      return orderedQuizOptions.map((option) => option.option_text.trim()).filter(Boolean)
    }

    if (expectedAnswer) {
      return expectedAnswer.split('||').map((item) => item.trim()).filter(Boolean)
    }

    return correctOptionText ? correctOptionText.split(/\s+/).filter(Boolean) : []
  }, [canonical, correctOptionText, expectedAnswer, orderedQuizOptions])

  const shuffledItems = useMemo(
    () => shuffleWithSeed(targetItems, question.length * 7 + 31),
    [question, targetItems]
  )

  const handleListen = useCallback(() => {
    if (playing) return
    setPlaying(true)
    playAudio(audioSource, () => setPlaying(false))
  }, [audioSource, playing])

  function handleSelect(label: string) {
    if (answered) return
    setSelected(label)
    setAnswered(true)
  }

  function handleTokenTap(globalIndex: number) {
    if (orderValidated) return
    setBuiltSequence((prev) => [...prev, String(globalIndex)])
  }

  function handleTokenRemove(seqIndex: number) {
    if (orderValidated) return
    setBuiltSequence((prev) => prev.filter((_, index) => index !== seqIndex))
  }

  function handleOrderValidate() {
    setOrderValidated(true)
    const assembled = builtSequence.map((index) => shuffledItems[Number(index)]).join(' || ')
    const expected = targetItems.join(' || ')
    const isCorrect = assembled.toLowerCase() === expected.toLowerCase()
    setOrderIsCorrect(isCorrect)
  }

  function renderFeedback(correct: boolean, expectedText?: string) {
    return (
      <div className={`rounded-2xl p-4 mt-4 ${correct ? 'bg-[#4CAF50]/10 border border-[#4CAF50]/30' : 'bg-red-50 border border-red-200'}`}>
        <p className={`font-semibold text-sm ${correct ? 'text-[#006633]' : 'text-red-700'}`}>
          {correct ? 'Bonne réponse !' : 'Pas tout à fait...'}
        </p>
        {!correct && expectedText && (
          <p className="text-sm text-red-600 mt-1">
            Réponse attendue : <strong>{expectedText}</strong>
          </p>
        )}
      </div>
    )
  }

  function renderNextButton(correct: boolean) {
    return (
      <button
        onClick={() => onComplete(correct)}
        className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors shadow-md shadow-[#006633]/20 mt-4"
      >
        Valider
      </button>
    )
  }

  if (canonical === 'ORDER_SEQUENCE') {
    return (
      <div className="space-y-6">
        <span className="text-xs bg-[#006633]/10 text-[#006633] px-3 py-1 rounded-full font-semibold">
          {tag}
        </span>

        <div className="bg-white rounded-2xl p-5 shadow-soft border border-[#E5E7EB]">
          <p className="text-xs uppercase tracking-wider text-[#666] mb-2">{heading}</p>
          <p className="text-base font-semibold text-[#000] leading-relaxed">{question}</p>
        </div>

        <div className="min-h-[3rem] bg-[#F5F5F5] rounded-xl p-3 border-2 border-dashed border-[#E5E7EB] flex flex-wrap gap-2">
          {builtSequence.length === 0 && (
            <span className="text-sm text-[#999]">Placez les étapes dans le bon ordre...</span>
          )}
          {builtSequence.map((globalIdx, seqIdx) => (
            <button
              key={seqIdx}
              onClick={() => handleTokenRemove(seqIdx)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                orderValidated
                  ? orderIsCorrect
                    ? 'bg-[#4CAF50]/15 text-[#006633]'
                    : 'bg-red-50 text-red-700'
                  : 'bg-[#006633]/10 text-[#006633] border border-[#006633]/30'
              }`}
            >
              {shuffledItems[Number(globalIdx)]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {shuffledItems.map((item, index) => {
            const used = builtSequence.includes(String(index))
            return (
              <button
                key={index}
                onClick={() => handleTokenTap(index)}
                disabled={used || orderValidated}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                  used
                    ? 'bg-[#F5F5F5] text-[#CCC] border-[#E5E7EB]'
                    : 'bg-white text-[#333] border-[#E5E7EB] hover:border-[#006633] active:scale-95'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>

        {!orderValidated && builtSequence.length === shuffledItems.length && shuffledItems.length > 0 && (
          <button
            onClick={handleOrderValidate}
            className="btn-primary"
          >
            Vérifier
          </button>
        )}
        {orderValidated && renderFeedback(orderIsCorrect, targetItems.join(' -> '))}
        {orderValidated && renderNextButton(orderIsCorrect)}
      </div>
    )
  }

  if (visibleOptions.length === 0) {
    return (
      <div className="space-y-6">
        <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#006633]/10 text-[#006633]">
          {tag}
        </span>
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-[#E5E7EB]">
          <p className="text-xs uppercase tracking-wider text-[#666] mb-2">{heading}</p>
          <p className="text-base font-semibold text-[#000] leading-relaxed">{question}</p>
        </div>
        <div className="rounded-2xl p-4 border border-amber-200 bg-amber-50 text-sm text-amber-800">
          Les options de cet exercice ne sont pas disponibles dans les données chargées.
        </div>
        {renderNextButton(false)}
      </div>
    )
  }

  const isCorrect = selected === correctAnswer

  return (
    <div className="space-y-6">
      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#006633]/10 text-[#006633]">
        {tag}
      </span>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-3">{heading}</p>

        {canonical === 'LISTEN_AND_SELECT' && (
          <button
            onClick={handleListen}
            disabled={playing}
            className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-5 shadow-sm transition-all ${
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
        )}

        <h2 className="text-[18px] font-extrabold text-[#000000] leading-snug">{question}</h2>
      </div>

      <div className="space-y-3">
        {visibleOptions.map((option) => {
          let cardStyle = 'bg-white border-[#E5E7EB] text-[#333]'
          let showCheck = false
          let showCross = false

          if (answered) {
            if (option.label === correctAnswer) {
              cardStyle = 'bg-[#4CAF50]/10 border-[#4CAF50] text-[#006633]'
              showCheck = true
            } else if (option.label === selected && !isCorrect) {
              cardStyle = 'bg-red-50 border-red-300 text-red-700'
              showCross = true
            } else {
              cardStyle = 'bg-white border-[#E5E7EB] text-[#999] opacity-60'
            }
          } else if (option.label === selected) {
            cardStyle = 'bg-[#006633]/5 border-[#006633] text-[#006633]'
          }

          return (
            <button
              key={option.label}
              onClick={() => handleSelect(option.label)}
              disabled={answered}
              className={`w-full text-left px-5 py-4 rounded-full border-2 outline-none transition-all duration-200 ${cardStyle}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold leading-snug">{option.text}</span>
                {showCheck && (
                  <div className="w-6 h-6 shrink-0 rounded-full bg-[#4CAF50] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {showCross && (
                  <div className="w-6 h-6 shrink-0 rounded-full bg-red-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {answered && renderFeedback(isCorrect, correctOptionText)}
      {answered && renderNextButton(isCorrect)}
    </div>
  )
}
