'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type SectionKey = 'reading' | 'listening' | 'vocabulary' | 'situations'
type Phase = 'qcm' | 'writing' | 'speaking' | 'review'

type PublicQuestion = {
  id: string
  section: SectionKey
  prompt: string
  requiresAudio: boolean
  options: Array<{ id: string; text: string }>
}

type PublicProduction = {
  id: string
  kind: 'writing' | 'speaking'
  level: string
  metier: string
  context: string
  task: string
  guidance: string | null
}

type ProductionDraft = {
  promptId: string
  kind: 'writing' | 'speaking'
  responseText?: string
  transcription?: string
  hasAudio?: boolean
  durationSeconds?: number
  submittedAt: string
}

type PublicPayload = {
  participant?: {
    firstName: string
    lastName?: string
    fullName: string
    hotel: string
    service?: string | null
  }
  invite?: { status: string; deadlineAt: string | null; expiresAt: string | null }
  attempt?: {
    status: string
    remainingSeconds: number | null
    progress: {
      responses: Record<string, { answer: string; answeredAt: string }>
      productions: Record<string, ProductionDraft>
      currentQuestionIndex: number
      phase: Phase
    }
  } | null
  questions?: PublicQuestion[]
  productions?: PublicProduction[]
  durationMinutes?: number
  isExpired?: boolean
  error?: string
}

type ClientStatus =
  | 'loading'
  | 'intro'
  | 'in_progress'
  | 'submitting'
  | 'submit_error'
  | 'completed'
  | 'expired'
  | 'error'

const SECTION_LABELS: Record<SectionKey, string> = {
  reading: 'Comprehension ecrite',
  listening: 'Comprehension orale',
  vocabulary: 'Vocabulaire metier',
  situations: 'Situations metier',
}

const DEFAULT_DURATION_MINUTES = 45
const DEFAULT_DURATION_SECONDS = DEFAULT_DURATION_MINUTES * 60

type SpeechRecognitionInstance = {
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: unknown) => void) | null
  onend: (() => void) | null
  continuous: boolean
  interimResults: boolean
  lang: string
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export default function PositioningParticipantClient({ token }: { token: string }) {
  const [status, setStatus] = useState<ClientStatus>('loading')
  const [payload, setPayload] = useState<PublicPayload | null>(null)
  const [phase, setPhase] = useState<Phase>('qcm')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, { answer: string; answeredAt: string }>>({})
  const [productions, setProductions] = useState<Record<string, ProductionDraft>>({})
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION_SECONDS)
  const [audioPlayedFor, setAudioPlayedFor] = useState<Record<string, boolean>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitElapsedSeconds, setSubmitElapsedSeconds] = useState(0)
  const submitInFlightRef = useRef(false)

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
    const existingProductions = json.attempt?.progress.productions || {}
    setResponses(existingResponses)
    setProductions(existingProductions)
    setCurrentIndex(json.attempt?.progress.currentQuestionIndex || 0)
    setPhase(json.attempt?.progress.phase || 'qcm')
    setTimeLeft(
      json.attempt?.remainingSeconds ?? (json.durationMinutes ?? DEFAULT_DURATION_MINUTES) * 60,
    )

    if (json.isExpired || json.invite?.status === 'expired') setStatus('expired')
    else if (json.attempt?.status === 'completed') setStatus('completed')
    else if (json.attempt?.status === 'in_progress') setStatus('in_progress')
    else setStatus('intro')
  }

  useEffect(() => {
    loadPayload().catch(() => setStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const questions = payload?.questions || []
  const productionPrompts = payload?.productions || []
  const writingPrompts = productionPrompts.filter((p) => p.kind === 'writing')
  const speakingPrompts = productionPrompts.filter((p) => p.kind === 'speaking')
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
          deviceInfo: { userAgent: navigator.userAgent, language: navigator.language },
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

  async function persistProduction(draft: ProductionDraft) {
    await fetch(`/api/positioning/public/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SAVE_PRODUCTION',
        promptId: draft.promptId,
        kind: draft.kind,
        responseText: draft.responseText,
        transcription: draft.transcription,
        hasAudio: draft.hasAudio,
        durationSeconds: draft.durationSeconds,
      }),
    })
  }

  async function persistPhase(nextPhase: Phase) {
    await fetch(`/api/positioning/public/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SET_PHASE', phase: nextPhase }),
    })
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
        [currentQuestion.id]: { answer: selectedAnswer, answeredAt: new Date().toISOString() },
      }))

      if (currentIndex >= questions.length - 1) {
        await persistPhase('writing')
        setPhase('writing')
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
    // Idempotence: empeche le double-clic et la double-soumission concurrente.
    if (submitInFlightRef.current) return
    submitInFlightRef.current = true
    setSubmitting(true)
    setSubmitError(null)
    setSubmitElapsedSeconds(0)
    setStatus('submitting')

    const started = Date.now()
    const elapsedTimer = window.setInterval(() => {
      setSubmitElapsedSeconds(Math.round((Date.now() - started) / 1000))
    }, 1000)

    // Timeout client large (5 min) > timeout IA serveur (60 s par appel,
    // executes en parallele). Si depasse, on garde les reponses cote serveur.
    const controller = new AbortController()
    const clientTimeout = window.setTimeout(() => controller.abort(), 5 * 60 * 1000)

    try {
      const response = await fetch(`/api/positioning/public/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SUBMIT_TEST' }),
        signal: controller.signal,
      })
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(text || `HTTP ${response.status}`)
      }
      await loadPayload()
    } catch (error) {
      const isAbort = (error as Error)?.name === 'AbortError'
      setSubmitError(
        isAbort
          ? 'Le traitement IA prend plus de temps que prevu. Vos reponses sont enregistrees mais l\'analyse n\'a pas abouti. Merci de reessayer.'
          : 'Vos reponses n\'ont pas pu etre transmises. Merci de verifier votre connexion et de reessayer.',
      )
      setStatus('submit_error')
    } finally {
      window.clearInterval(elapsedTimer)
      window.clearTimeout(clientTimeout)
      setSubmitting(false)
      submitInFlightRef.current = false
    }
  }

  async function playAudio(question: PublicQuestion) {
    if (!question.requiresAudio) return
    const source = `/api/positioning/public/${token}/audio/${question.id}`
    const audio = new Audio(source)
    setAudioPlayedFor((current) => ({ ...current, [question.id]: true }))
    audio.play().catch(() => undefined)
  }

  if (status === 'loading') {
    return (
      <ScreenShell>
        <p className="text-sm font-medium text-gray-500">Chargement de votre acces...</p>
      </ScreenShell>
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
  if (status === 'submitting') {
    return <SubmittingScreen elapsedSeconds={submitElapsedSeconds} />
  }
  if (status === 'submit_error') {
    return (
      <SubmitErrorScreen
        message={submitError}
        onRetry={() => {
          setStatus('in_progress')
          handleSubmit().catch(() => undefined)
        }}
        onBackToReview={() => {
          setStatus('in_progress')
          setPhase('review')
        }}
      />
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
          Merci {payload.participant.firstName}. Vos reponses ont bien ete enregistrees.
          Les resultats seront consolides par l&apos;equipe formation.
        </p>
        <div className="mt-6 rounded-3xl bg-gray-50 p-4 text-left text-sm text-gray-600 ring-1 ring-gray-100">
          <p className="font-semibold text-gray-900">{payload.participant.hotel}</p>
          {payload.participant.service ? <p className="mt-1">{payload.participant.service}</p> : null}
          <p className="mt-1">
            Vos resultats seront consolides par l'equipe formation. Vous pouvez maintenant fermer
            cette page.
          </p>
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
            <li>Le test contient {questions.length} questions a choix unique, {writingPrompts.length} productions ecrites et {speakingPrompts.length} productions orales.</li>
            <li>Pour la comprehension orale, ecoutez chaque audio avant de repondre.</li>
            <li>Pour les productions orales, autorisez l'acces au micro lorsque demande.</li>
            <li>Le test peut etre repris si la connexion coupe.</li>
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
                {phase === 'qcm' && currentQuestion
                  ? SECTION_LABELS[currentQuestion.section]
                  : phase === 'writing'
                    ? 'Production ecrite'
                    : phase === 'speaking'
                      ? 'Production orale'
                      : 'Validation finale'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {phase === 'qcm'
                  ? `Question ${currentIndex + 1} / ${questions.length}`
                  : phase === 'writing'
                    ? `Ecrits ${Object.values(productions).filter((p) => p.kind === 'writing').length} / ${writingPrompts.length}`
                    : phase === 'speaking'
                      ? `Oraux ${Object.values(productions).filter((p) => p.kind === 'speaking').length} / ${speakingPrompts.length}`
                      : 'Recapitulatif'}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-100">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${Math.max(6, Math.round((answeredCount / Math.max(questions.length, 1)) * 100))}%`,
              }}
            />
          </div>
        </div>

        {phase === 'qcm' && currentQuestion && (
          <QcmPanel
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            onSaveAndNext={handleSaveAndNext}
            submitting={submitting}
            isLast={currentIndex === questions.length - 1}
            onPlayAudio={playAudio}
            audioPlayed={Boolean(audioPlayedFor[currentQuestion.id])}
          />
        )}

        {phase === 'writing' && (
          <WritingPanel
            prompts={writingPrompts}
            productions={productions}
            onSave={async (draft) => {
              await persistProduction(draft)
              setProductions((current) => ({ ...current, [draft.promptId]: draft }))
            }}
            onContinue={async () => {
              await persistPhase('speaking')
              setPhase('speaking')
            }}
          />
        )}

        {phase === 'speaking' && (
          <SpeakingPanel
            prompts={speakingPrompts}
            productions={productions}
            onSave={async (draft) => {
              await persistProduction(draft)
              setProductions((current) => ({ ...current, [draft.promptId]: draft }))
            }}
            onContinue={async () => {
              await persistPhase('review')
              setPhase('review')
            }}
          />
        )}

        {phase === 'review' && (
          <ReviewPanel
            answeredCount={answeredCount}
            totalQuestions={questions.length}
            writingDone={Object.values(productions).filter((p) => p.kind === 'writing').length}
            speakingDone={Object.values(productions).filter((p) => p.kind === 'speaking').length}
            writingTotal={writingPrompts.length}
            speakingTotal={speakingPrompts.length}
            submitting={submitting}
            onSubmit={handleSubmit}
            onBackWriting={async () => {
              await persistPhase('writing')
              setPhase('writing')
            }}
          />
        )}
      </div>
    </div>
  )
}

function QcmPanel({
  question,
  selectedAnswer,
  setSelectedAnswer,
  onSaveAndNext,
  submitting,
  isLast,
  onPlayAudio,
  audioPlayed,
}: {
  question: PublicQuestion
  selectedAnswer: string
  setSelectedAnswer: (value: string) => void
  onSaveAndNext: () => void
  submitting: boolean
  isLast: boolean
  onPlayAudio: (question: PublicQuestion) => void
  audioPlayed: boolean
}) {
  return (
    <div className="px-5 py-6">
      <p className="text-lg font-semibold leading-relaxed text-gray-900">{question.prompt}</p>

      {question.requiresAudio && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => onPlayAudio(question)}
            className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
          >
            {audioPlayed ? 'Reecouter l\'audio' : 'Ecouter l\'audio'}
          </button>
          {!audioPlayed && (
            <p className="mt-2 text-xs text-amber-700">
              Ecoutez l&apos;audio avant de choisir votre reponse.
            </p>
          )}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {question.options.map((option, index) => (
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
            <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="mt-1 block text-sm font-medium">{option.text}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSaveAndNext}
        disabled={!selectedAnswer || submitting}
        className="mt-6 w-full rounded-full bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-40"
      >
        {submitting
          ? 'Enregistrement...'
          : isLast
            ? 'Passer aux productions'
            : 'Question suivante'}
      </button>
    </div>
  )
}

function WritingPanel({
  prompts,
  productions,
  onSave,
  onContinue,
}: {
  prompts: PublicProduction[]
  productions: Record<string, ProductionDraft>
  onSave: (draft: ProductionDraft) => Promise<void>
  onContinue: () => void
}) {
  const [index, setIndex] = useState(0)
  const prompt = prompts[index]
  const initial = productions[prompt?.id || '']?.responseText || ''
  const [text, setText] = useState(initial)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setText(productions[prompt?.id || '']?.responseText || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt?.id])

  if (!prompt) {
    return (
      <div className="px-5 py-6">
        <p className="text-sm text-gray-600">Aucune production ecrite a remplir.</p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-4 w-full rounded-full bg-gray-900 px-5 py-4 text-base font-semibold text-white"
        >
          Passer aux productions orales
        </button>
      </div>
    )
  }

  const isLast = index === prompts.length - 1

  async function handleSaveAndNext() {
    setBusy(true)
    try {
      await onSave({
        promptId: prompt.id,
        kind: 'writing',
        responseText: text.trim(),
        submittedAt: new Date().toISOString(),
      })
      if (isLast) {
        onContinue()
      } else {
        setIndex((i) => i + 1)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="px-5 py-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        Ecrit {index + 1} / {prompts.length}
      </p>
      <p className="mt-2 text-sm text-gray-600">{prompt.context}</p>
      <p className="mt-3 text-base font-semibold text-gray-900">{prompt.task}</p>
      {prompt.guidance ? (
        <p className="mt-2 text-xs text-gray-500">{prompt.guidance}</p>
      ) : null}

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        maxLength={4000}
        placeholder="Tapez votre reponse en anglais ici..."
        className="mt-4 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-emerald-500"
      />
      <p className="mt-1 text-right text-xs text-gray-400">{text.length} / 4000</p>

      <button
        type="button"
        onClick={handleSaveAndNext}
        disabled={busy || text.trim().length < 10}
        className="mt-4 w-full rounded-full bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-40"
      >
        {busy ? 'Enregistrement...' : isLast ? 'Passer aux oraux' : 'Ecrit suivant'}
      </button>
    </div>
  )
}

function SpeakingPanel({
  prompts,
  productions,
  onSave,
  onContinue,
}: {
  prompts: PublicProduction[]
  productions: Record<string, ProductionDraft>
  onSave: (draft: ProductionDraft) => Promise<void>
  onContinue: () => void
}) {
  const [index, setIndex] = useState(0)
  const prompt = prompts[index]
  const [transcript, setTranscript] = useState('')
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)
  const [recognitionUnavailable, setRecognitionUnavailable] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const startedAtRef = useRef<number>(0)

  useEffect(() => {
    setTranscript(productions[prompt?.id || '']?.transcription || '')
    setHasAudio(Boolean(productions[prompt?.id || '']?.hasAudio))
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt?.id])

  useEffect(() => {
    setRecognitionUnavailable(!getSpeechRecognition())
  }, [])

  if (!prompt) {
    return (
      <div className="px-5 py-6">
        <p className="text-sm text-gray-600">Aucune production orale a remplir.</p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-4 w-full rounded-full bg-gray-900 px-5 py-4 text-base font-semibold text-white"
        >
          Passer a la validation finale
        </button>
      </div>
    )
  }

  const isLast = index === prompts.length - 1

  async function startRecording() {
    setError(null)
    setTranscript('')
    setHasAudio(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      const chunks: Blob[] = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }
      recorder.onstop = () => {
        setHasAudio(chunks.length > 0)
        stream.getTracks().forEach((track) => track.stop())
      }
      recorder.start()
      startedAtRef.current = Date.now()

      const Recognition = getSpeechRecognition()
      if (Recognition) {
        const recognition = new Recognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-GB'
        recognition.onresult = (event) => {
          let combined = ''
          for (let i = 0; i < event.results.length; i += 1) {
            const result = event.results[i]
            const alt = result[0]
            if (alt) combined += `${alt.transcript} `
          }
          setTranscript(combined.trim())
        }
        recognition.onerror = () => undefined
        recognition.onend = () => undefined
        try {
          recognition.start()
          recognitionRef.current = recognition
        } catch {
          recognitionRef.current = null
        }
      }

      setRecording(true)
    } catch {
      setError('Impossible d\'acceder au micro. Autorisez le micro dans le navigateur.')
    }
  }

  function stopRecording() {
    try {
      mediaRecorderRef.current?.stop()
    } catch {
      // ignore
    }
    try {
      recognitionRef.current?.stop()
    } catch {
      // ignore
    }
    setRecording(false)
  }

  async function handleSaveAndNext() {
    setBusy(true)
    try {
      const durationSeconds =
        startedAtRef.current > 0
          ? Math.round((Date.now() - startedAtRef.current) / 1000)
          : undefined
      await onSave({
        promptId: prompt.id,
        kind: 'speaking',
        transcription: transcript.trim(),
        hasAudio,
        durationSeconds,
        submittedAt: new Date().toISOString(),
      })
      if (isLast) {
        onContinue()
      } else {
        setIndex((i) => i + 1)
      }
    } finally {
      setBusy(false)
    }
  }

  const canSave = hasAudio || transcript.trim().length >= 10

  return (
    <div className="px-5 py-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        Oral {index + 1} / {prompts.length}
      </p>
      <p className="mt-2 text-sm text-gray-600">{prompt.context}</p>
      <p className="mt-3 text-base font-semibold text-gray-900">{prompt.task}</p>
      {prompt.guidance ? (
        <p className="mt-2 text-xs text-gray-500">{prompt.guidance}</p>
      ) : null}

      <div className="mt-5 rounded-3xl bg-gray-50 p-4 ring-1 ring-gray-100">
        {recording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Arreter l&apos;enregistrement
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Demarrer l&apos;enregistrement
          </button>
        )}

        <p className="mt-3 text-xs text-gray-500">
          {recognitionUnavailable
            ? 'Transcription automatique non disponible sur ce navigateur. Vous pouvez taper votre reponse ci-dessous pour qu\'elle soit evaluee.'
            : 'Parlez en anglais. La transcription apparait ci-dessous.'}
        </p>

        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={4}
          maxLength={4000}
          placeholder={
            recognitionUnavailable
              ? 'Tapez ce que vous avez dit en anglais...'
              : 'Transcription automatique (modifiable si besoin)'
          }
          className="mt-3 w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500"
        />
      </div>

      {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={handleSaveAndNext}
        disabled={busy || !canSave}
        className="mt-4 w-full rounded-full bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-40"
      >
        {busy ? 'Enregistrement...' : isLast ? 'Validation finale' : 'Oral suivant'}
      </button>
    </div>
  )
}

function ReviewPanel({
  answeredCount,
  totalQuestions,
  writingDone,
  speakingDone,
  writingTotal,
  speakingTotal,
  submitting,
  onSubmit,
  onBackWriting,
}: {
  answeredCount: number
  totalQuestions: number
  writingDone: number
  speakingDone: number
  writingTotal: number
  speakingTotal: number
  submitting: boolean
  onSubmit: () => void
  onBackWriting: () => void
}) {
  const allQcm = answeredCount >= totalQuestions
  const allWriting = writingDone >= writingTotal
  const allSpeaking = speakingDone >= speakingTotal
  return (
    <div className="px-5 py-6">
      <p className="text-base font-semibold text-gray-900">Validation finale</p>
      <p className="mt-2 text-sm text-gray-600">
        Verifiez que toutes les sections sont completees avant d&apos;envoyer votre test.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2">
          <span>QCM</span>
          <span className={allQcm ? 'font-semibold text-emerald-700' : 'font-semibold text-amber-700'}>
            {answeredCount} / {totalQuestions}
          </span>
        </li>
        <li className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2">
          <span>Productions ecrites</span>
          <span className={allWriting ? 'font-semibold text-emerald-700' : 'font-semibold text-amber-700'}>
            {writingDone} / {writingTotal}
          </span>
        </li>
        <li className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2">
          <span>Productions orales</span>
          <span className={allSpeaking ? 'font-semibold text-emerald-700' : 'font-semibold text-amber-700'}>
            {speakingDone} / {speakingTotal}
          </span>
        </li>
      </ul>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="w-full rounded-full bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? 'Envoi...' : 'Envoyer mes reponses'}
        </button>
        <button
          type="button"
          onClick={onBackWriting}
          className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700"
        >
          Revenir aux productions
        </button>
      </div>
    </div>
  )
}

function SubmittingScreen({ elapsedSeconds }: { elapsedSeconds: number }) {
  // Sequencage simule cote client: les durees correspondent a peu pres
  // au pipeline serveur (sauvegarde quasi instantanee, IA writing+speaking
  // en parallele ~30-90 s, consolidation finale).
  const steps = [
    { label: 'Enregistrement de vos reponses', threshold: 0 },
    { label: 'Analyse des productions ecrites et orales par IA', threshold: 5 },
    { label: 'Consolidation des resultats', threshold: 60 },
    { label: 'Finalisation du test', threshold: 110 },
  ]
  return (
    <ScreenShell>
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Transmission en cours</h1>
      <p className="mt-2 text-sm text-gray-600">
        Transmission de vos reponses et analyse des productions ecrites et orales.
      </p>
      <p className="mt-1 text-sm font-semibold text-amber-700">
        Merci de ne pas fermer cette page. Cette etape peut prendre 1 a 3 minutes.
      </p>
      <ul className="mt-6 space-y-2 text-left text-sm">
        {steps.map((step) => {
          const reached = elapsedSeconds >= step.threshold
          return (
            <li
              key={step.label}
              className={`flex items-center gap-2 rounded-2xl px-3 py-2 ring-1 ${
                reached
                  ? 'bg-emerald-50 text-emerald-900 ring-emerald-100'
                  : 'bg-gray-50 text-gray-500 ring-gray-100'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  reached ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-white'
                }`}
              >
                {reached ? 'OK' : '...'}
              </span>
              <span>{step.label}</span>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-gray-400">Temps ecoule : {elapsedSeconds}s</p>
    </ScreenShell>
  )
}

function SubmitErrorScreen({
  message,
  onRetry,
  onBackToReview,
}: {
  message: string | null
  onRetry: () => void
  onBackToReview: () => void
}) {
  return (
    <ScreenShell>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-700">
        !
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Transmission interrompue</h1>
      <p className="mt-3 text-sm text-gray-600">
        {message ||
          'Vos reponses n\'ont pas pu etre transmises. Merci de verifier votre connexion et de reessayer.'}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Vos reponses deja enregistrees ne sont pas perdues. Vous pouvez reessayer la soumission.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-full bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Reessayer la soumission
        </button>
        <button
          type="button"
          onClick={onBackToReview}
          className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700"
        >
          Revenir a la validation finale
        </button>
      </div>
    </ScreenShell>
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
