'use client'

import { useEffect, useMemo, useState } from 'react'

type PublicPayload = {
  participant?: {
    firstName: string
    lastName?: string
    fullName: string
    hotel: string
    service?: string | null
  }
  invite?: {
    status: string
    deadlineAt: string | null
    expiresAt: string | null
  }
  attempt?: {
    status: string
    remainingSeconds: number | null
    progress: {
      responses: Record<string, { answer: string; answeredAt: string }>
      currentQuestionIndex: number
    }
  } | null
  questions?: Array<{
    id: string
    section: 'reading' | 'listening' | 'vocabulary'
    prompt: string
    promptAudio: string | null
    audioUrl: string | null
    options: Array<{ id: string; text: string }>
  }>
  durationMinutes?: number
  isExpired?: boolean
  error?: string
}

type ClientStatus = 'loading' | 'intro' | 'in_progress' | 'completed' | 'expired' | 'error'

const SECTION_LABELS = {
  reading: 'Comprehension ecrite',
  listening: 'Comprehension orale',
  vocabulary: 'Vocabulaire metier',
} as const

const DEFAULT_DURATION_MINUTES = 45
const DEFAULT_DURATION_SECONDS = DEFAULT_DURATION_MINUTES * 60

export default function PositioningParticipantClient({ token }: { token: string }) {
  const [status, setStatus] = useState<ClientStatus>('loading')
  const [payload, setPayload] = useState<PublicPayload | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, { answer: string; answeredAt: string }>>({})
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION_SECONDS)

  async function loadPayload() {
    setStatus('loading')
    const response = await fetch(`/api/positioning/public/${token}`)
    const json = (await response.json()) as PublicPayload

    if (!response.ok) {
      setPayload(json)
      setStatus(response.status === 410 ? 'expired' : 'error')
      return
    }

    setPayload(json)
    const existingResponses = json.attempt?.progress.responses || {}
    setResponses(existingResponses)
    setCurrentIndex(json.attempt?.progress.currentQuestionIndex || 0)
    setTimeLeft(json.attempt?.remainingSeconds ?? (json.durationMinutes ?? DEFAULT_DURATION_MINUTES) * 60)

    if (json.isExpired || json.invite?.status === 'expired') setStatus('expired')
    else if (json.attempt?.status === 'completed') setStatus('completed')
    else if (json.attempt?.status === 'in_progress') setStatus('in_progress')
    else setStatus('intro')
  }

  useEffect(() => {
    loadPayload().catch(() => setStatus('error'))
  }, [token])

  useEffect(() => {
    if (status !== 'in_progress') return

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          handleSubmit().catch(() => undefined)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [status])

  const questions = payload?.questions || []
  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(responses[currentQuestion.id]?.answer || '')
    }
  }, [currentQuestion, responses])

  const answeredCount = useMemo(() => Object.keys(responses).length, [responses])

  async function handleStart() {
    setSubmitting(true)

    try {
      const response = await fetch(`/api/positioning/public/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'START_TEST',
          deviceInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
          },
        }),
      })

      if (!response.ok) throw new Error()
      setStatus('in_progress')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSaveAndNext() {
    if (!currentQuestion || !selectedAnswer) return

    setSubmitting(true)

    try {
      const nextQuestionIndex = currentIndex < questions.length - 1 ? currentIndex + 1 : currentIndex
      const response = await fetch(`/api/positioning/public/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_PROGRESS',
          questionId: currentQuestion.id,
          answer: selectedAnswer,
          currentQuestionIndex: nextQuestionIndex,
        }),
      })

      if (!response.ok) throw new Error()

      setResponses((current) => ({
        ...current,
        [currentQuestion.id]: {
          answer: selectedAnswer,
          answeredAt: new Date().toISOString(),
        },
      }))

      if (currentIndex >= questions.length - 1) {
        await handleSubmit()
      } else {
        setCurrentIndex((value) => value + 1)
      }
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)

    try {
      const response = await fetch(`/api/positioning/public/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SUBMIT_TEST' }),
      })

      if (!response.ok) throw new Error()
      await loadPayload()
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  function playAudio(audioUrl: string | null, text: string | null) {
    const source = audioUrl || (text ? `/api/tts?text=${encodeURIComponent(text)}` : null)
    if (!source) return

    const audio = new Audio(source)
    audio.play().catch(() => undefined)
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl bg-white px-6 py-8 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-medium text-gray-500">Chargement de votre acces...</p>
        </div>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <ScreenShell>
        <h1 className="text-2xl font-bold text-gray-900">Lien expire</h1>
        <p className="mt-3 text-sm text-gray-600">
          Ce lien de test n'est plus actif. Merci de contacter votre responsable pour recevoir un
          nouveau lien.
        </p>
      </ScreenShell>
    )
  }

  if (status === 'error' || !payload?.participant) {
    return (
      <ScreenShell>
        <h1 className="text-2xl font-bold text-gray-900">Acces indisponible</h1>
        <p className="mt-3 text-sm text-gray-600">
          Nous n'avons pas pu ouvrir votre test. Merci de reessayer avec votre lien personnel ou de
          contacter votre responsable.
        </p>
      </ScreenShell>
    )
  }

  if (status === 'completed') {
    return (
      <ScreenShell>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
          OK
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Test termine</h1>
        <p className="mt-3 text-sm text-gray-600">
          Merci {payload.participant.firstName}. Vos reponses ont bien ete enregistrees et
          transmises a l'equipe CAFORMAC.
        </p>
        <div className="mt-6 rounded-3xl bg-gray-50 p-4 text-left text-sm text-gray-600 ring-1 ring-gray-100">
          <p className="font-semibold text-gray-900">{payload.participant.hotel}</p>
          {payload.participant.service ? <p className="mt-1">{payload.participant.service}</p> : null}
          <p className="mt-1">Votre passation est complete. Les resultats seront revus par l'equipe CAFORMAC.</p>
          <p className="mt-1">Vous pouvez maintenant fermer cette page.</p>
        </div>
      </ScreenShell>
    )
  }

  if (status === 'intro') {
    return (
      <ScreenShell>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Test de positionnement
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{payload.participant.fullName}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {payload.participant.hotel}
          {payload.participant.service ? ` · ${payload.participant.service}` : ''}
        </p>
        <div className="mt-6 rounded-3xl bg-gray-50 p-5 text-left ring-1 ring-gray-100">
          <p className="font-semibold text-gray-900">Avant de commencer</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>Duree estimee : {payload.durationMinutes ?? DEFAULT_DURATION_MINUTES} minutes.</li>
            <li>Le test peut etre repris si la connexion coupe.</li>
            <li>Une seule reponse par question.</li>
            <li>Merci de rester concentre(e) jusqu'a la confirmation finale.</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={handleStart}
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? 'Demarrage...' : 'Demarrer le test'}
        </button>
      </ScreenShell>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5">
      <div className="mx-auto max-w-md rounded-[28px] bg-white shadow-sm ring-1 ring-gray-100">
        <div className="sticky top-0 rounded-t-[28px] border-b border-gray-100 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                {currentQuestion ? SECTION_LABELS[currentQuestion.section] : 'Test'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Question {currentIndex + 1} / {questions.length}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-100">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${Math.max(6, Math.round((answeredCount / Math.max(questions.length, 1)) * 100))}%` }}
            />
          </div>
        </div>

        {currentQuestion && (
          <div className="px-5 py-6">
            <p className="text-lg font-semibold leading-relaxed text-gray-900">{currentQuestion.prompt}</p>

            {(currentQuestion.audioUrl || currentQuestion.promptAudio) && (
              <button
                type="button"
                onClick={() => playAudio(currentQuestion.audioUrl, currentQuestion.promptAudio)}
                className="mt-4 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
              >
                Ecouter l'audio
              </button>
            )}

            <div className="mt-5 space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedAnswer(option.id)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                    selectedAnswer === option.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">{option.id}</span>
                  <span className="mt-1 block text-sm font-medium">{option.text}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveAndNext}
              disabled={!selectedAnswer || submitting}
              className="mt-6 w-full rounded-full bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-40"
            >
              {submitting ? 'Enregistrement...' : currentIndex === questions.length - 1 ? 'Terminer le test' : 'Question suivante'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6">
      <div className="w-full max-w-md rounded-[32px] bg-white px-6 py-8 text-center shadow-sm ring-1 ring-gray-100">
        {children}
      </div>
    </div>
  )
}
