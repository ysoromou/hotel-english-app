'use client'

import { useState } from 'react'

interface ScenarioExerciseProps {
  scenario: {
    type_scenario: string
    contexte: string
    objectif_salarie: string
    dialogue_modele: string
    criteres_reussite: string
  }
  onComplete: () => void
}

export default function ScenarioExercise({ scenario, onComplete }: ScenarioExerciseProps) {
  const [dialogueVisible, setDialogueVisible] = useState(false)

  return (
    <div className="space-y-6">
      <span className="text-xs px-3 py-1 rounded-full font-semibold bg-[#006633]/10 text-[#006633]">
        Scénario {scenario.type_scenario.toLowerCase()}
      </span>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] space-y-4">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-2">Contexte</p>
          <p className="text-sm text-[#333] leading-relaxed whitespace-pre-line">{scenario.contexte}</p>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-2">Objectif salarié</p>
          <p className="text-sm text-[#333] leading-relaxed whitespace-pre-line">{scenario.objectif_salarie}</p>
        </section>
      </div>

      {!dialogueVisible ? (
        <button
          onClick={() => setDialogueVisible(true)}
          className="w-full py-4 border-2 border-dashed border-[#006633]/30 rounded-2xl text-[#006633] text-sm font-semibold hover:bg-[#006633]/5 transition-colors"
        >
          Voir le dialogue modèle et les critères de réussite
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] space-y-4">
            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-2">Dialogue modèle</p>
              <p className="text-sm text-[#333] leading-relaxed whitespace-pre-line">{scenario.dialogue_modele}</p>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#666] mb-2">Critères de réussite</p>
              <p className="text-sm text-[#333] leading-relaxed whitespace-pre-line">{scenario.criteres_reussite}</p>
            </section>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors shadow-md"
          >
            Terminer le scénario
          </button>
        </div>
      )}
    </div>
  )
}
