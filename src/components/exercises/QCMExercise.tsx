'use client'

import { useState, useMemo, useCallback } from 'react'
import { normalizeQuizType, QUIZ_TYPE_LABELS } from '@/lib/normalizeQuizType'

// Exercice QCM — rendu distinct selon le type canonique
// Chaque type_quiz est normalisé puis affiché avec son propre layout
// Audio TTS via Web Speech API pour LISTEN_AND_SELECT (aucune dépendance externe)

interface QCMExerciseProps {
  question: string
  optionA: string
  optionB: string
  optionC: string | null
  correctAnswer: string // 'A', 'B', ou 'C'
  typeQuiz: string
  onComplete: (isCorrect: boolean) => void
}

// Mélange stable d'un tableau (Fisher-Yates avec seed simple)
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

// Lecture TTS — synthèse vocale du navigateur
function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-GB'
  utterance.rate = 0.9

  const voices = window.speechSynthesis.getVoices()
  const enVoice = voices.find(v => v.lang.startsWith('en-GB'))
    || voices.find(v => v.lang.startsWith('en'))
  if (enVoice) utterance.voice = enVoice

  if (onEnd) utterance.onend = onEnd
  utterance.onerror = () => onEnd?.()

  window.speechSynthesis.speak(utterance)
}

export default function QCMExercise({
  question, optionA, optionB, optionC, correctAnswer, typeQuiz, onComplete,
}: QCMExerciseProps) {
  const canonical = normalizeQuizType(typeQuiz)
  const { tag, heading } = QUIZ_TYPE_LABELS[canonical]

  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [playing, setPlaying] = useState(false)

  // ORDER_SEQUENCE : tokens sélectionnés par l'utilisateur
  const [builtSequence, setBuiltSequence] = useState<string[]>([])
  const [orderValidated, setOrderValidated] = useState(false)

  // TTS pour LISTEN_AND_SELECT
  const handleListen = useCallback(() => {
    if (playing) return
    setPlaying(true)
    speakText(question, () => setPlaying(false))
  }, [question, playing])

  const allOptions = [
    { label: 'A', text: optionA },
    { label: 'B', text: optionB },
    ...(optionC ? [{ label: 'C', text: optionC }] : []),
  ]

  // TONE_CHECK n'utilise que A et B
  const visibleOptions = canonical === 'TONE_CHECK' ? allOptions.slice(0, 2) : allOptions

  function handleSelect(label: string) {
    if (answered) return
    setSelected(label)
    setAnswered(true)
  }

  const isCorrect = selected === correctAnswer

  // ORDER_SEQUENCE : mots cibles et mélangés
  // Garde-fou : si correctAnswer === 'C' mais optionC est null, fallback sur optionA
  const correctText = correctAnswer === 'A' ? optionA : correctAnswer === 'B' ? optionB : (optionC || optionA)
  const safeCorrectText = correctText || optionA || ''
  const targetTokens = useMemo(() => safeCorrectText.split(/\s+/).filter(Boolean), [safeCorrectText])
  const shuffledTokens = useMemo(
    () => shuffleWithSeed(targetTokens, question.length * 7 + 31),
    [targetTokens, question]
  )
  const remainingTokens = shuffledTokens.filter(
    (_, i) => !builtSequence.includes(String(i))
  )

  function handleTokenTap(globalIndex: number) {
    if (orderValidated) return
    setBuiltSequence(prev => [...prev, String(globalIndex)])
  }

  function handleTokenRemove(seqIndex: number) {
    if (orderValidated) return
    setBuiltSequence(prev => prev.filter((_, i) => i !== seqIndex))
  }

  function handleOrderValidate() {
    setOrderValidated(true)
    const assembled = builtSequence.map(i => shuffledTokens[Number(i)]).join(' ')
    const correct = targetTokens.join(' ')
    const ok = assembled.toLowerCase() === correct.toLowerCase()
    setSelected(ok ? correctAnswer : '__wrong__')
  }

  const orderIsCorrect = orderValidated && selected === correctAnswer

  // ===== Feedback partagé =====
  function renderFeedback(correct: boolean) {
    return (
      <div className={`rounded-2xl p-4 mt-4 ${correct ? 'bg-[#4CAF50]/10 border border-[#4CAF50]/30' : 'bg-red-50 border border-red-200'}`}>
        <p className={`font-semibold text-sm ${correct ? 'text-[#006633]' : 'text-red-700'}`}>
          {correct ? 'Bonne réponse !' : 'Pas tout à fait...'}
        </p>
        {!correct && (
          <p className="text-sm text-red-600 mt-1">
            La bonne réponse était : <strong>{correctAnswer === 'A' ? optionA : correctAnswer === 'B' ? optionB : (optionC || optionA)}</strong>
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

  // ===== RENDU PAR TYPE =====

  // --- ORDER_SEQUENCE ---
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

        {/* Zone de construction */}
        <div className="min-h-[3rem] bg-[#F5F5F5] rounded-xl p-3 border-2 border-dashed border-[#E5E7EB] flex flex-wrap gap-2">
          {builtSequence.length === 0 && (
            <span className="text-sm text-[#999]">Tapez les mots dans le bon ordre…</span>
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
              {shuffledTokens[Number(globalIdx)]}
            </button>
          ))}
        </div>

        {/* Tokens disponibles */}
        <div className="flex flex-wrap gap-2">
          {shuffledTokens.map((token, i) => {
            const used = builtSequence.includes(String(i))
            return (
              <button
                key={i}
                onClick={() => handleTokenTap(i)}
                disabled={used || orderValidated}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                  used
                    ? 'bg-[#F5F5F5] text-[#CCC] border-[#E5E7EB]'
                    : 'bg-white text-[#333] border-[#E5E7EB] hover:border-[#006633] active:scale-95'
                }`}
              >
                {token}
              </button>
            )
          })}
        </div>

        {/* Valider / Feedback */}
        {!orderValidated && builtSequence.length === shuffledTokens.length && (
          <button
            onClick={handleOrderValidate}
            className="btn-primary"
          >
            Vérifier
          </button>
        )}
        {orderValidated && renderFeedback(orderIsCorrect)}
        {orderValidated && renderNextButton(orderIsCorrect)}
      </div>
    )
  }

  // --- Tous les autres types (choix par clic) ---
  return (
    <div className="space-y-6">
      {/* Tag type — couleur unique verte */}
      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#006633]/10 text-[#006633]">
        {tag}
      </span>

      {/* Question / prompt */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-3">{heading}</p>

        {/* LISTEN_AND_SELECT : bouton play avec TTS réel */}
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

      {/* Options — pilule Premium Light */}
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
                {/* Icône résultat */}
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

      {/* Feedback */}
      {answered && renderFeedback(isCorrect)}
      {answered && renderNextButton(isCorrect)}
    </div>
  )
}
