'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { generateTestSession, OnlineQuestion } from '@/lib/testOnlineData'

// Types internes
type TestStatus = 'loading' | 'not_started' | 'in_progress' | 'completed'
type ResponsesMap = Record<string, { answer_text?: string; answer_audio?: string }>

export default function TestClient() {
  const [status, setStatus] = useState<TestStatus>('loading')
  const [questions, setQuestions] = useState<OnlineQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<ResponsesMap>({})
  
  // Timer (MVP: 45 min = 2700 sec)
  const [timeLeft, setTimeLeft] = useState(2700)
  
  // Stats post-test
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [finalLevel, setFinalLevel] = useState<string | null>(null)

  // ── INIT ────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadState() {
      try {
        const res = await fetch('/api/test-online')
        const data = await res.json()
        if (data.status) {
          if (data.status.statut === 'completed') {
            setStatus('completed')
            setFinalScore(data.status.score_global)
            setFinalLevel(data.status.niveau_suggere)
            return
          }
          
          setStatus(data.status.statut)
          
          // Hydrate responses
          const savedMap: ResponsesMap = {}
          for (const r of data.responses) {
            savedMap[r.question_id] = { answer_text: r.answer_text, answer_audio: r.answer_audio }
          }
          setResponses(savedMap)

          // Load questions (statique pour ce MVP)
          const session = generateTestSession()
          setQuestions(session)
          
          // Reprendre à la première question non répondue
          const firstUnanswered = session.findIndex(q => !savedMap[q.id])
          if (firstUnanswered > -1) setCurrentIndex(firstUnanswered)
          else setCurrentIndex(0)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadState()
  }, [])

  // ── TIMER ───────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'in_progress' || timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft(l => l - 1), 1000)
    return () => clearInterval(t)
  }, [status, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && status === 'in_progress') {
      handleComplete() // Fin du temps imparti
    }
  }, [timeLeft, status])

  // ── ACTIONS ─────────────────────────────────────────────────────
  async function handleStart() {
    setStatus('in_progress')
  }

  async function handleNext(answerText?: string, answerAudio?: string) {
    const q = questions[currentIndex]
    
    // Save local
    if (answerText || answerAudio) {
      setResponses(prev => ({ ...prev, [q.id]: { answer_text: answerText, answer_audio: answerAudio } }))
      
      // Save backend (transparent, ne bloque pas l'UI)
      fetch('/api/test-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_ANSWER',
          section: q.section,
          question_id: q.id,
          answer_text: answerText,
          answer_audio: answerAudio,
        })
      }).catch(console.error)
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      await handleComplete()
    }
  }

  async function handleComplete() {
    setStatus('loading')
    try {
      const res = await fetch('/api/test-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'COMPLETE_TEST' })
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('completed')
        setFinalScore(data.score_global)
        setFinalLevel(data.niveau_suggere)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ── RENDERERS ───────────────────────────────────────────────────
  if (status === 'loading') return <div className="p-8 text-center text-gray-400">Chargement du test...</div>

  if (status === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Terminé</h2>
          <p className="text-gray-500 text-sm mb-6">Tes réponses ont été envoyées pour analyse.</p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Score partiel automatique</p>
            <p className="text-3xl font-black text-blue-900 mt-1">{finalScore}<span className="text-lg text-blue-400">/100</span></p>
            <p className="text-xs text-blue-500 mt-1">Niveau suggéré : <strong>{finalLevel}</strong></p>
          </div>

          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-3">
             ⏳ L'épreuve orale et écrite nécessite la de confirmation de ton formateur.<br/>La note finale sera ajustée.
          </p>

          <a href="/dashboard" className="mt-6 block w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm">
            Retour au Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (status === 'not_started') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="text-5xl mb-4">⏱️</div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Test de Positionnement</h1>
        <p className="text-gray-600 mb-8 max-w-sm">
          Ce test détermine ton niveau de départ officiel. Tu auras <strong>45 minutes</strong> pour répondre aux 4 épreuves : Lecture, Écoute, Écrit et Oral.
        </p>
        <button onClick={handleStart} className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-blue-600/20 active:scale-95 transition-transform">
          Démarrer le test
        </button>
      </div>
    )
  }

  // In_progress
  if (questions.length === 0) return null
  const currentQ = questions[currentIndex]
  
  const SECTION_LABELS = { reading: 'Lecture', listening: 'Écoute', writing: 'Expression Écrite', speaking: 'Expression Orale' }
  const SECTION_COLORS = { reading: 'text-emerald-600', listening: 'text-blue-600', writing: 'text-purple-600', speaking: 'text-rose-600' }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      {/* Header : Timer + Section */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Épreuve {currentIndex + 1} / {questions.length}</span>
          <span className={`text-sm font-black ${SECTION_COLORS[currentQ.section]}`}>{SECTION_LABELS[currentQ.section]}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          <span className="text-xs font-bold text-gray-700">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full mb-8 overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${((currentIndex) / questions.length) * 100}%` }} />
        </div>

        {/* Dynamic Renderer */}
        <QuestionRenderer 
          key={currentQ.id} 
          question={currentQ} 
          onNext={handleNext}
        />
      </div>
    </div>
  )
}

// ── RENDERER CENTRAL ──────────────────────────────────────────────

function QuestionRenderer({ question, onNext }: { question: OnlineQuestion, onNext: (t?: string, a?: string) => void }) {
  if (question.type === 'mcq') return <MCQRenderer q={question} onNext={onNext} />
  if (question.type === 'open') return <TextRenderer q={question} onNext={onNext} />
  if (question.type === 'recording') return <AudioRenderer q={question} onNext={onNext} />
  return <div className="text-red-500">Erreur de rendu</div>
}

// 1. QCM
function MCQRenderer({ q, onNext }: { q: OnlineQuestion, onNext: (t?: string) => void }) {
  if (q.type !== 'mcq') return null
  const [sel, setSel] = useState('')

  // TTS helper for listening section MVP
  const playAudio = useCallback(() => {
    if (q.section === 'listening' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(q.prompt.replace('[Audio]', '').trim())
      u.lang = 'en-GB'
      window.speechSynthesis.speak(u)
    }
  }, [q])

  useEffect(() => {
    if (q.section === 'listening') playAudio()
    return () => window.speechSynthesis.cancel()
  }, [q.section, playAudio])

  return (
    <div className="space-y-6 slide-in">
      <div className="text-lg font-medium text-gray-900 border-l-4 border-blue-500 pl-4 py-1">
        {q.prompt}
      </div>

      {q.section === 'listening' && (
        <button onClick={playAudio} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
          🔊 Réécouter l'audio
        </button>
      )}

      <div className="space-y-3 pt-4">
        {q.options.map(opt => (
          <button key={opt.id} onClick={() => setSel(opt.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              sel === opt.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}>
            <span className={`font-bold mr-3 ${sel === opt.id ? 'text-blue-600' : 'text-gray-400'}`}>{opt.id}</span>
            <span className="text-gray-800">{opt.text}</span>
          </button>
        ))}
      </div>

      <button disabled={!sel} onClick={() => onNext(sel)}
        className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-xl disabled:opacity-30">
        Valider la réponse
      </button>
    </div>
  )
}

// 2. TEXT (Writing)
function TextRenderer({ q, onNext }: { q: OnlineQuestion, onNext: (t?: string) => void }) {
  const [text, setText] = useState('')

  return (
    <div className="space-y-6 slide-in">
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800 text-sm">
        {q.prompt}
      </div>
      
      <textarea 
        value={text} 
        onChange={e => setText(e.target.value)}
        rows={6}
        placeholder="Tapez votre réponse ici en anglais..."
        className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-blue-600 resize-none text-gray-800"
      />

      <button disabled={text.length < 10} onClick={() => onNext(text)}
        className="w-full mt-2 py-4 bg-gray-900 text-white font-bold rounded-xl disabled:opacity-30">
        Terminer l'épreuve écrite
      </button>
    </div>
  )
}

// 3. AUDIO (Speaking - MediaRecorder)
function AudioRenderer({ q, onNext }: { q: OnlineQuestion, onNext: (t?: string, a?: string) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [time, setTime] = useState(0)
  const [base64Audio, setBase64Audio] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let t: NodeJS.Timeout
    if (isRecording) {
      t = setInterval(() => {
        setTime(prev => {
          if (prev >= 45) {
            stopRecording()
            return 45
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(t)
  }, [isRecording])

  async function startRecording() {
    try {
      setBase64Audio(null)
      chunksRef.current = []
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => setBase64Audio(reader.result as string)
        reader.readAsDataURL(blob)
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
      setTime(0)
    } catch (e) {
      alert("Impossible d'accéder au micro. Vérifiez les permissions de votre navigateur.")
      console.error(e)
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-6 slide-in text-center">
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl text-rose-900 font-medium mb-8">
        {q.prompt}
      </div>

      {!base64Audio ? (
        <div className="flex flex-col items-center">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-28 h-28 rounded-full flex items-center justify-center mb-4 transition-transform ${
              isRecording ? 'bg-red-600 animate-pulse scale-110' : 'bg-gray-900 hover:bg-gray-800'
            }`}>
            <span className="text-4xl">{isRecording ? '⏹' : '🎙'}</span>
          </button>
          
          <div className="text-sm font-bold text-gray-500 font-mono">
            00:{time.toString().padStart(2, '0')} / 00:45
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {isRecording ? "Enregistrement en cours..." : "Touchez le micro pour répondre"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
            <p className="text-emerald-600 font-bold mb-4">✅ Audio capturé avec succès</p>
            <button onClick={startRecording} className="text-sm text-gray-500 underline">
              Recommencer l'enregistrement
            </button>
          </div>

          <button onClick={() => onNext(undefined, base64Audio)}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30">
            Valider et Terminer
          </button>
        </div>
      )}
    </div>
  )
}
