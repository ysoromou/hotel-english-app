'use client'

import { useState, useEffect, useCallback } from 'react'

// Carte phrase — affiche une phrase FR/EN avec bouton pour révéler la traduction
// + lecture audio TTS via Web Speech API (aucune dépendance externe)

interface PhraseCardProps {
  phraseFr: string
  phraseEn: string
  phase: string
  voiceType: string
  onComplete: () => void
}

// Lecture TTS — via notre proxy serveur /api/tts (fonctionne sur tous les navigateurs)
let currentAudio: HTMLAudioElement | null = null

function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') { onEnd?.(); return }

  // Arrêter l'audio en cours
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }

  const url = `/api/tts?text=${encodeURIComponent(text)}`
  const audio = new Audio(url)
  currentAudio = audio

  audio.onended = () => { currentAudio = null; onEnd?.() }
  audio.onerror = () => { currentAudio = null; onEnd?.() }
  audio.play().catch(() => { currentAudio = null; onEnd?.() })
}

export default function PhraseCard({ phraseFr, phraseEn, phase, voiceType, onComplete }: PhraseCardProps) {
  const [revealed, setRevealed] = useState(false)
  const [playing, setPlaying]   = useState(false)

  // Pré-charger les voix au montage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
    }
  }, [])

  const handleListen = useCallback(() => {
    if (playing) return
    setPlaying(true)
    speakText(phraseEn, () => setPlaying(false))
  }, [phraseEn, playing])

  const phaseLabel = phase === 'decouverte' ? 'Découverte'
    : phase === 'pratique' ? 'Pratique'
    : phase === 'maitrise' ? 'Maîtrise'
    : phase

  return (
    <div className="space-y-5">

      {/* Badge phase + voix */}
      <div className="flex items-center gap-2">
        <span className="text-xs bg-[#006633]/10 text-[#006633] px-3 py-1 rounded-full font-semibold">
          {phaseLabel}
        </span>
        <span className="text-xs text-[#999]">
          {voiceType === 'STAFF' ? 'Vous dites' : 'Le client dit'}
        </span>
      </div>

      {/* Carte phrase anglaise */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB]"
           style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#666]">
            English
          </p>

          {/* Bouton écouter — carré blanc bordure verte */}
          <button
            onClick={handleListen}
            disabled={playing}
            aria-label="Écouter la phrase"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              playing
                ? 'bg-[#4CAF50]/15 text-[#006633]'
                : 'bg-[#006633] text-white hover:bg-[#004d26] active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              {playing
                ? <><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></>
                : <path d="M8 5v14l11-7z"/>
              }
            </svg>
            {playing ? 'Lecture…' : 'Écouter'}
          </button>
        </div>

        <p className="text-[18px] font-extrabold text-[#000000] leading-snug">
          {phraseEn}
        </p>
      </div>

      {/* Traduction française (cachée puis révélée) */}
      {revealed ? (
        <div className="bg-[#006633]/5 border border-[#006633]/20 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#006633] mb-2">
            Français
          </p>
          <p className="text-base font-semibold text-[#000] leading-relaxed">
            {phraseFr}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-4 border-2 border-dashed border-[#E5E7EB] rounded-2xl text-[#999] text-sm font-medium hover:border-[#006633] hover:text-[#006633] transition-colors"
        >
          Voir la traduction en français
        </button>
      )}

      {/* Bouton Suivant */}
      {revealed && (
        <button
          onClick={onComplete}
          className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors shadow-md"
          style={{ boxShadow: '0 4px 16px rgba(0,102,51,0.25)' }}
        >
          Suivant
        </button>
      )}
    </div>
  )
}
