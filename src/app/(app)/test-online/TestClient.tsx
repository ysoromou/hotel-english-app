'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateTestSession, OnlineQuestion } from '@/lib/testOnlineData'

type TestStatus = 'loading' | 'identification' | 'not_started' | 'in_progress' | 'completed'
type ResponsesMap = Record<string, { answer_text?: string; answer_audio?: string }>

type ParticipantIdentity = {
  first_name: string | null
  last_name: string | null
  full_name: string | null
  hotel: string | null
  service_code: string | null
  service_label: string | null
  phone: string | null
  email: string | null
}

type IdentificationForm = {
  first_name: string
  last_name: string
  hotel: 'NOOM' | 'SEEN' | ''
  service_code: 'RECEPTION' | 'HOUSEKEEPING' | 'RESTAURANT' | 'SECURITY' | ''
  phone: string
  email: string
}

const INITIAL_FORM: IdentificationForm = {
  first_name: '',
  last_name: '',
  hotel: '',
  service_code: '',
  phone: '',
  email: '',
}

const SECTION_LABELS = {
  reading: 'Lecture',
  listening: 'Écoute',
  writing: 'Expression écrite',
  speaking: 'Expression orale',
} as const

const SECTION_COLORS = {
  reading: 'text-emerald-600',
  listening: 'text-blue-600',
  writing: 'text-purple-600',
  speaking: 'text-rose-600',
} as const

const SERVICE_OPTIONS = [
  { value: 'RECEPTION', label: 'Réception' },
  { value: 'HOUSEKEEPING', label: 'Housekeeping' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'SECURITY', label: 'Sécurité' },
] as const

export default function TestClient() {
  const [status, setStatus] = useState<TestStatus>('loading')
  const [questions, setQuestions] = useState<OnlineQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<ResponsesMap>({})
  const [timeLeft, setTimeLeft] = useState(2700)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [finalLevel, setFinalLevel] = useState<string | null>(null)
  const [participant, setParticipant] = useState<ParticipantIdentity | null>(null)
  const [publicMode, setPublicMode] = useState(false)
  const [form, setForm] = useState<IdentificationForm>(INITIAL_FORM)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadState() {
      try {
        const res = await fetch('/api/test-online')
        const data = await res.json()

        if (data.requires_identification) {
          setPublicMode(true)
          setParticipant(null)
          setStatus('identification')
          setQuestions(generateTestSession())
          setTimeLeft(2700)
          return
        }

        if (data.participant) {
          setParticipant(data.participant)
          setForm((current) => ({
            ...current,
            first_name: data.participant.first_name || '',
            last_name: data.participant.last_name || '',
            hotel: data.participant.hotel || '',
            service_code: data.participant.service_code || '',
            phone: data.participant.phone || '',
            email: data.participant.email || '',
          }))
        }

        setPublicMode(Boolean(data.public_mode))
        setTimeLeft(typeof data.remaining_seconds === 'number' ? data.remaining_seconds : 2700)

        if (data.status?.statut === 'completed') {
          setStatus('completed')
          setFinalScore(data.status.score_global)
          setFinalLevel(data.status.niveau_suggere)
        } else {
          setStatus(data.status?.statut || 'not_started')
        }

        const session = generateTestSession()
        setQuestions(session)

        const savedMap: ResponsesMap = {}
        for (const response of data.responses || []) {
          savedMap[response.question_id] = {
            answer_text: response.answer_text,
            answer_audio: response.answer_audio,
          }
        }
        setResponses(savedMap)

        const firstUnanswered = session.findIndex((question) => !savedMap[question.id])
        setCurrentIndex(firstUnanswered > -1 ? firstUnanswered : 0)
      } catch (loadError) {
        console.error(loadError)
        setError('Impossible de charger le test pour le moment.')
        setStatus('identification')
        setPublicMode(true)
      }
    }

    loadState()
  }, [])

  useEffect(() => {
    if (status !== 'in_progress' || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((current) => current - 1), 1000)
    return () => clearInterval(timer)
  }, [status, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && status === 'in_progress') {
      handleComplete()
    }
  }, [timeLeft, status])

  async function handleBeginPublicTest() {
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/test-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BEGIN_PUBLIC_TEST',
          ...form,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Impossible de démarrer le test.')
        return
      }

      setParticipant(data.participant || null)
      setPublicMode(Boolean(data.public_mode))
      setTimeLeft(typeof data.remaining_seconds === 'number' ? data.remaining_seconds : 2700)
      setFinalScore(null)
      setFinalLevel(null)

      const session = generateTestSession()
      setQuestions(session)

      const savedMap: ResponsesMap = {}
      for (const saved of data.responses || []) {
        savedMap[saved.question_id] = {
          answer_text: saved.answer_text,
          answer_audio: saved.answer_audio,
        }
      }
      setResponses(savedMap)

      const firstUnanswered = session.findIndex((question) => !savedMap[question.id])
      setCurrentIndex(firstUnanswered > -1 ? firstUnanswered : 0)
      setStatus(data.status?.statut || 'not_started')
    } catch (requestError) {
      console.error(requestError)
      setError('Le test ne peut pas démarrer pour le moment.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResetPublicSession() {
    try {
      await fetch('/api/test-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET_PUBLIC_SESSION' }),
      })
    } catch (resetError) {
      console.error(resetError)
    } finally {
      setForm(INITIAL_FORM)
      setParticipant(null)
      setResponses({})
      setCurrentIndex(0)
      setTimeLeft(2700)
      setFinalScore(null)
      setFinalLevel(null)
      setError(null)
      setStatus('identification')
      setPublicMode(true)
    }
  }

  async function handleStart() {
    try {
      const response = await fetch('/api/test-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START_TEST' }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Impossible de démarrer le test.')
        return
      }

      if (data.status?.statut === 'completed') {
        setStatus('completed')
        setFinalScore(data.score_global ?? null)
        setFinalLevel(data.niveau_suggere ?? null)
        return
      }

      setStatus('in_progress')
      setError(null)
    } catch (startError) {
      console.error(startError)
      setError('Impossible de démarrer le test.')
    }
  }

  async function handleNext(answerText?: string, answerAudio?: string) {
    const question = questions[currentIndex]

    if (answerText || answerAudio) {
      setResponses((current) => ({
        ...current,
        [question.id]: { answer_text: answerText, answer_audio: answerAudio },
      }))

      fetch('/api/test-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_ANSWER',
          section: question.section,
          question_id: question.id,
          answer_text: answerText,
          answer_audio: answerAudio,
        }),
      }).catch(console.error)
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1)
    } else {
      await handleComplete()
    }
  }

  async function handleComplete() {
    setStatus('loading')
    try {
      const response = await fetch('/api/test-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'COMPLETE_TEST' }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Impossible de finaliser le test.')
        setStatus('in_progress')
        return
      }

      setStatus('completed')
      setFinalScore(data.score_global)
      setFinalLevel(data.niveau_suggere)
    } catch (completeError) {
      console.error(completeError)
      setError('Impossible de finaliser le test.')
      setStatus('in_progress')
    }
  }

  if (status === 'loading') {
    return <div className="p-8 text-center text-gray-400">Chargement du test...</div>
  }

  if (status === 'identification') {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-4 py-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Passation immédiate</p>
          <h1 className="mt-2 text-2xl font-black text-gray-900">Test de positionnement anglais</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Renseigne tes informations avant de commencer. Aucun compte salarié n’est à créer :
            ce lien suffit pour passer le test sur téléphone.
          </p>

          <div className="mt-5 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Prénom"
                value={form.first_name}
                onChange={(value) => setForm((current) => ({ ...current, first_name: value }))}
              />
              <Field
                label="Nom"
                value={form.last_name}
                onChange={(value) => setForm((current) => ({ ...current, last_name: value }))}
              />
            </div>

            <SelectField
              label="Hôtel"
              value={form.hotel}
              options={[
                { value: '', label: 'Sélectionner un hôtel' },
                { value: 'NOOM', label: 'NOOM' },
                { value: 'SEEN', label: 'SEEN' },
              ]}
              onChange={(value) => setForm((current) => ({ ...current, hotel: value as IdentificationForm['hotel'] }))}
            />

            <SelectField
              label="Service"
              value={form.service_code}
              options={[
                { value: '', label: 'Sélectionner un service' },
                ...SERVICE_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
              ]}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  service_code: value as IdentificationForm['service_code'],
                }))
              }
            />

            <Field
              label="Téléphone"
              type="tel"
              value={form.phone}
              onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
              placeholder="+225 07 00 00 00 00"
            />

            <Field
              label="Email (optionnel)"
              type="email"
              value={form.email}
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
              placeholder="prenom.nom@entreprise.com"
            />
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-5 rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-500 ring-1 ring-gray-100">
            Durée estimée : 45 minutes. Le test comporte lecture, écoute, écrit et oral.
          </div>

          <button
            type="button"
            onClick={handleBeginPublicTest}
            disabled={
              submitting ||
              !form.first_name.trim() ||
              !form.last_name.trim() ||
              !form.hotel ||
              !form.service_code ||
              !form.phone.trim()
            }
            className="mt-5 w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-40"
          >
            {submitting ? 'Préparation du test...' : 'Continuer'}
          </button>
        </div>
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-4 text-4xl">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900">Test terminé</h2>
          <p className="mt-2 text-sm text-gray-500">
            {participant?.full_name
              ? `${participant.full_name}, tes réponses ont bien été enregistrées.`
              : 'Tes réponses ont bien été enregistrées.'}
          </p>

          <p className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            Vos réponses ont bien été enregistrées. Les résultats seront consolidés
            par l’équipe formation. Vous serez recontacté(e) pour la suite.
          </p>

          <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs text-amber-700">
            L’écrit libre et l’expression orale doivent être validés par un
            formateur avant toute communication du niveau final. Aucun score
            définitif n’est affiché à ce stade.
          </p>

          {publicMode ? (
            <button
              type="button"
              onClick={handleResetPublicSession}
              className="mt-6 w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white"
            >
              Nouveau participant
            </button>
          ) : (
            <a
              href="/dashboard"
              className="mt-6 block w-full rounded-2xl bg-gray-900 py-3 text-sm font-bold text-white"
            >
              Retour au dashboard
            </a>
          )}
        </div>
      </div>
    )
  }

  if (questions.length === 0) return null

  if (status === 'not_started') {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-8 text-center">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-5xl">⏱️</div>
          <h1 className="text-2xl font-black text-gray-900">Test de positionnement</h1>
          {participant?.full_name ? (
            <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-left text-sm text-gray-600 ring-1 ring-gray-100">
              <p className="font-semibold text-gray-900">{participant.full_name}</p>
              <p className="mt-1">{participant.hotel || 'Hôtel non renseigné'}</p>
              <p>{participant.service_label || 'Service non renseigné'}</p>
            </div>
          ) : null}
          <p className="mt-5 text-sm leading-relaxed text-gray-600">
            Tu auras <strong>45 minutes</strong> pour répondre aux 4 épreuves :
            lecture, écoute, écrit et oral. La progression est sauvegardée si la connexion coupe.
          </p>
          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <button
            onClick={handleStart}
            className="mt-6 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Démarrer le test
          </button>
          {publicMode ? (
            <button
              type="button"
              onClick={handleResetPublicSession}
              className="mt-3 w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600"
            >
              Changer de participant
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="mx-auto max-w-md min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 p-4 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Épreuve {currentIndex + 1} / {questions.length}
          </span>
          <span className={`text-sm font-black ${SECTION_COLORS[currentQuestion.section]}`}>
            {SECTION_LABELS[currentQuestion.section]}
          </span>
          {participant?.full_name ? (
            <span className="mt-1 truncate text-[11px] text-gray-500">
              {participant.full_name}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
          <span className="text-xs font-bold text-gray-700">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <QuestionRenderer key={currentQuestion.id} question={currentQuestion} onNext={handleNext} />
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <span className="font-medium">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function QuestionRenderer({
  question,
  onNext,
}: {
  question: OnlineQuestion
  onNext: (text?: string, audio?: string) => void
}) {
  if (question.type === 'mcq') return <MCQRenderer q={question} onNext={onNext} />
  if (question.type === 'open') return <TextRenderer q={question} onNext={onNext} />
  if (question.type === 'recording') return <AudioRenderer q={question} onNext={onNext} />
  return <div className="text-red-500">Erreur de rendu</div>
}

function MCQRenderer({ q, onNext }: { q: OnlineQuestion; onNext: (text?: string) => void }) {
  if (q.type !== 'mcq') return null
  const [selected, setSelected] = useState('')

  const playAudio = useCallback(() => {
    if (q.section === 'listening' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(q.prompt.replace('[Audio]', '').trim())
      utterance.lang = 'en-GB'
      window.speechSynthesis.speak(utterance)
    }
  }, [q])

  useEffect(() => {
    if (q.section === 'listening') playAudio()
    return () => window.speechSynthesis.cancel()
  }, [q.section, playAudio])

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-blue-500 py-1 pl-4 text-lg font-medium text-gray-900">
        {q.prompt}
      </div>

      {q.section === 'listening' ? (
        <button
          onClick={playAudio}
          className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          🔊 Réécouter l’audio
        </button>
      ) : null}

      <div className="space-y-3 pt-4">
        {q.options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
              selected === option.id
                ? 'border-blue-600 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className={`mr-3 font-bold ${selected === option.id ? 'text-blue-600' : 'text-gray-400'}`}>
              {option.id}
            </span>
            <span className="text-gray-800">{option.text}</span>
          </button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => onNext(selected)}
        className="mt-8 w-full rounded-xl bg-gray-900 py-4 font-bold text-white disabled:opacity-30"
      >
        Valider la réponse
      </button>
    </div>
  )
}

function TextRenderer({ q, onNext }: { q: OnlineQuestion; onNext: (text?: string) => void }) {
  const [text, setText] = useState('')

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
        {q.prompt}
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        placeholder="Tapez votre réponse ici en anglais..."
        className="w-full resize-none rounded-xl border-2 border-gray-200 p-4 text-gray-800 outline-none focus:border-blue-600"
      />

      <button
        disabled={text.trim().length < 10}
        onClick={() => onNext(text)}
        className="mt-2 w-full rounded-xl bg-gray-900 py-4 font-bold text-white disabled:opacity-30"
      >
        Terminer l’épreuve écrite
      </button>
    </div>
  )
}

function AudioRenderer({
  q,
  onNext,
}: {
  q: OnlineQuestion
  onNext: (text?: string, audio?: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [time, setTime] = useState(0)
  const [base64Audio, setBase64Audio] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRecording) {
      timer = setInterval(() => {
        setTime((current) => {
          if (current >= 45) {
            stopRecording()
            return 45
          }
          return current + 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRecording])

  async function startRecording() {
    try {
      setBase64Audio(null)
      chunksRef.current = []
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => setBase64Audio(reader.result as string)
        reader.readAsDataURL(blob)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      setTime(0)
    } catch (recordingError) {
      alert("Impossible d'accéder au micro. Vérifiez les permissions de votre navigateur.")
      console.error(recordingError)
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mb-8 rounded-xl border border-rose-100 bg-rose-50 p-6 font-medium text-rose-900">
        {q.prompt}
      </div>

      {!base64Audio ? (
        <div className="flex flex-col items-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`mb-4 flex h-28 w-28 items-center justify-center rounded-full transition-transform ${
              isRecording ? 'scale-110 animate-pulse bg-red-600' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            <span className="text-4xl">{isRecording ? '⏹' : '🎙'}</span>
          </button>

          <div className="font-mono text-sm font-bold text-gray-500">
            00:{time.toString().padStart(2, '0')} / 00:45
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {isRecording ? 'Enregistrement en cours...' : 'Touchez le micro pour répondre'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-6">
            <p className="mb-4 font-bold text-emerald-600">✅ Audio capturé avec succès</p>
            <button onClick={startRecording} className="text-sm text-gray-500 underline">
              Recommencer l’enregistrement
            </button>
          </div>

          <button
            onClick={() => onNext(undefined, base64Audio)}
            className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/30"
          >
            Valider et terminer
          </button>
        </div>
      )}
    </div>
  )
}
