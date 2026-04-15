'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ── Grille unique 15 compétences transverses — v3 ──────────────────
// Score 0–3 · Total /45 · Seuil opérationnel ≥ 30

const COMPETENCES: { key: string; label: string }[] = [
  { key: 'accueillir_client',            label: 'Accueillir un client en anglais' },
  { key: 'comprendre_demande',           label: 'Comprendre une demande simple à l\'oral' },
  { key: 'repondre_demande',             label: 'Répondre à une demande simple' },
  { key: 'donner_information',           label: 'Donner une information claire' },
  { key: 'orienter_client',              label: 'Orienter un client ou indiquer une direction' },
  { key: 'verifier_information',         label: 'Vérifier une information ou une demande' },
  { key: 'reformuler_confirmer',         label: 'Reformuler pour valider la compréhension' },
  { key: 'gerer_reclamation',            label: 'Gérer une réclamation simple' },
  { key: 'proposer_solution',            label: 'Proposer une solution adaptée' },
  { key: 'gerer_situation_difficile',    label: 'Gérer une situation difficile ou une incompréhension' },
  { key: 'utiliser_vocabulaire_metier',  label: 'Utiliser le vocabulaire métier adapté en situation' },
  { key: 'maintenir_echange_fluide',     label: 'Maintenir un échange fluide avec le client' },
  { key: 'gerer_appel',                  label: 'Gérer un échange téléphonique simple' },
  { key: 'conclure_interaction',         label: 'Clôturer un échange de manière professionnelle' },
  { key: 'dire_non_professionnellement', label: 'Refuser ou poser une limite de façon professionnelle' },
]

const SCORE_MAX    = 45
const SEUIL_VERT   = 30
const SEUIL_ORANGE = 15

// ── Types ──────────────────────────────────────────────────────────

interface Learner {
  id: string
  email: string
  nom_complet: string | null
  metier_code: string | null
  etablissement: string | null
  role: string
  date_inscription: string
}

interface AppProgress {
  user_id: string
  overall_score: number
  actions_completed: number
  streak: number
  last_activity_date: string | null
}

interface EvalRow {
  id: string
  learner_id: string
  type_evaluation: 'avant' | 'apres'
  promotion: string | null
  observation_terrain: string | null
  score_total: number
  accueillir_client: number
  comprendre_demande: number
  repondre_demande: number
  donner_information: number
  orienter_client: number
  verifier_information: number
  reformuler_confirmer: number
  gerer_reclamation: number
  proposer_solution: number
  gerer_situation_difficile: number
  utiliser_vocabulaire_metier: number
  maintenir_echange_fluide: number
  gerer_appel: number
  conclure_interaction: number
  dire_non_professionnellement: number
}

interface SessionCount { user_id: string }

interface ManagerClientProps {
  learners: Learner[]
  allProgress: AppProgress[]
  allEvaluations: EvalRow[]
  sessionCounts: SessionCount[]
}

// ── Constantes UI ──────────────────────────────────────────────────

const METIER_LABELS: Record<string, string> = {
  RECEPTION:    'Réception',
  HOUSEKEEPING: 'Housekeeping',
  RESTAURANT:   'Restaurant',
  SECURITY:     'Sécurité',
}

const STATUT_COLORS = {
  vert:   'bg-green-100 text-green-700',
  orange: 'bg-amber-100 text-amber-700',
  rouge:  'bg-red-100 text-red-700',
  nd:     'bg-gray-100 text-gray-400',
}
const STATUT_LABELS = {
  vert:   'Opérationnel',
  orange: 'Intermédiaire',
  rouge:  'À risque',
  nd:     'Non évalué',
}

// ── Fonctions de calcul ────────────────────────────────────────────

function getScore(e: EvalRow | null | undefined): number {
  return e?.score_total ?? 0
}

function calcStatut(score: number, hasEval: boolean): 'vert' | 'orange' | 'rouge' | 'nd' {
  if (!hasEval) return 'nd'
  if (score >= SEUIL_VERT)   return 'vert'
  if (score >= SEUIL_ORANGE) return 'orange'
  return 'rouge'
}

function progPct(avant: number, apres: number): number {
  return Math.round(((apres - avant) / SCORE_MAX) * 100)
}

// ── Composant principal ────────────────────────────────────────────

export default function ManagerClient({ learners, allProgress, allEvaluations, sessionCounts }: ManagerClientProps) {
  const router = useRouter()
  const [search, setSearch]             = useState('')
  const [filterMetier, setFilterMetier] = useState<string>('all')
  const [filterHotel, setFilterHotel]   = useState<string>('all')
  const [selectedId, setSelectedId]     = useState<string | null>(null)

  // Maps
  const progressMap = new Map<string, AppProgress>()
  for (const p of allProgress) progressMap.set(p.user_id, p)

  const evalMap = new Map<string, { avant: EvalRow | null; apres: EvalRow | null }>()
  for (const e of allEvaluations) {
    const entry = evalMap.get(e.learner_id) || { avant: null, apres: null }
    if (e.type_evaluation === 'avant') entry.avant = e
    else entry.apres = e
    evalMap.set(e.learner_id, entry)
  }

  const sessionMap = new Map<string, number>()
  for (const s of sessionCounts) sessionMap.set(s.user_id, (sessionMap.get(s.user_id) || 0) + 1)

  // Hôtels uniques pour filtre
  const hotels = Array.from(new Set(learners.map(l => l.etablissement).filter(Boolean) as string[])).sort()

  // Filtrage
  const filtered = learners.filter(l => {
    const matchSearch = !search ||
      (l.nom_complet || '').toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
    const matchMetier = filterMetier === 'all' || l.metier_code === filterMetier
    const matchHotel  = filterHotel  === 'all' || l.etablissement === filterHotel
    return matchSearch && matchMetier && matchHotel
  })

  // Stats globales
  const avecEvalAvant = learners.filter(l => evalMap.get(l.id)?.avant).length
  const avecEvalApres = learners.filter(l => evalMap.get(l.id)?.apres).length
  const avecDeuxEvals = learners.filter(l => evalMap.get(l.id)?.avant && evalMap.get(l.id)?.apres)

  let nbVert = 0, nbOrange = 0, nbRouge = 0
  let sumAvant = 0, sumApres = 0

  for (const l of learners) {
    const e = evalMap.get(l.id)
    const s = calcStatut(getScore(e?.apres), !!e?.apres)
    if (s === 'vert')   nbVert++
    else if (s === 'orange') nbOrange++
    else if (s === 'rouge')  nbRouge++
  }
  for (const l of avecDeuxEvals) {
    const e = evalMap.get(l.id)!
    sumAvant += getScore(e.avant)
    sumApres += getScore(e.apres)
  }

  const avgAvant   = avecDeuxEvals.length > 0 ? Math.round(sumAvant / avecDeuxEvals.length * 10) / 10 : null
  const avgApres   = avecDeuxEvals.length > 0 ? Math.round(sumApres / avecDeuxEvals.length * 10) / 10 : null
  const avgDeltaPct = (avgAvant !== null && avgApres !== null) ? progPct(avgAvant, avgApres) : null
  const pctVert    = avecEvalApres > 0 ? Math.round(nbVert / avecEvalApres * 100) : null

  // Vue détail
  const selectedLearner = selectedId ? learners.find(l => l.id === selectedId) || null : null

  if (selectedLearner) {
    return (
      <LearnerDetail
        learner={selectedLearner}
        progress={progressMap.get(selectedLearner.id) || null}
        evals={evalMap.get(selectedLearner.id) || { avant: null, apres: null }}
        sessions={sessionMap.get(selectedLearner.id) || 0}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
        <button
          onClick={() => router.push('/manager/rapport')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Rapport client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Score initial moyen" value={avgAvant !== null ? `${avgAvant}/45` : '—'} />
        <StatCard label="Score final moyen"   value={avgApres !== null ? `${avgApres}/45` : '—'} />
        <StatCard label="Progression moyenne" value={avgDeltaPct !== null ? `${avgDeltaPct >= 0 ? '+' : ''}${avgDeltaPct}%` : '—'} />
        <StatCard label="% Opérationnels"     value={pctVert !== null ? `${pctVert}%` : '—'} />
      </div>

      {/* Statuts */}
      <div className="mt-3 flex gap-2">
        {([['vert', nbVert, '≥30'], ['orange', nbOrange, '15–29'], ['rouge', nbRouge, '<15']] as const).map(([s, n, range]) => (
          <div key={s} className={`flex-1 rounded-xl p-3 text-center border ${
            s === 'vert'   ? 'bg-green-50 border-green-100' :
            s === 'orange' ? 'bg-amber-50 border-amber-100' :
                             'bg-red-50 border-red-100'
          }`}>
            <p className={`text-2xl font-bold ${
              s === 'vert' ? 'text-green-700' : s === 'orange' ? 'text-amber-700' : 'text-red-700'
            }`}>{n}</p>
            <p className={`text-xs mt-0.5 ${
              s === 'vert' ? 'text-green-600' : s === 'orange' ? 'text-amber-600' : 'text-red-600'
            }`}>{STATUT_LABELS[s]} {range}</p>
          </div>
        ))}
      </div>

      {/* Usage */}
      <div className="mt-3 bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
        <span><strong className="text-gray-900">{learners.length}</strong> apprenants</span>
        <span><strong className="text-gray-900">{avecEvalAvant}</strong> éval. initiales</span>
        <span><strong className="text-gray-900">{avecEvalApres}</strong> éval. finales</span>
        <span><strong className="text-gray-900">{sessionCounts.length}</strong> sessions app</span>
      </div>

      {/* Filtres */}
      <div className="mt-5 space-y-3">
        <input
          type="text"
          placeholder="Rechercher un apprenant..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'RECEPTION', 'HOUSEKEEPING', 'RESTAURANT', 'SECURITY'].map(m => (
            <button key={m} onClick={() => setFilterMetier(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filterMetier === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {m === 'all' ? 'Tous métiers' : METIER_LABELS[m] || m}
            </button>
          ))}
        </div>
        {hotels.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setFilterHotel('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filterHotel === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              Tous hôtels
            </button>
            {hotels.map(h => (
              <button key={h} onClick={() => setFilterHotel(h)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  filterHotel === h ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Liste */}
      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucun apprenant trouvé</p>
        ) : filtered.map(l => {
          const e         = evalMap.get(l.id)
          const scoreAvant = getScore(e?.avant)
          const scoreApres = getScore(e?.apres)
          const statut    = calcStatut(scoreApres, !!e?.apres)
          const dp        = (e?.avant && e?.apres) ? progPct(scoreAvant, scoreApres) : null
          const appSess   = sessionMap.get(l.id) || 0

          return (
            <button key={l.id} onClick={() => setSelectedId(l.id)}
              className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 text-left transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{l.nom_complet || l.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {l.metier_code ? METIER_LABELS[l.metier_code] || l.metier_code : '—'}
                    {l.etablissement ? ` · ${l.etablissement}` : ''}
                  </p>
                </div>
                <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUT_COLORS[statut]}`}>
                  {STATUT_LABELS[statut]}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                {e?.avant  && <span>Avant : <strong className="text-gray-700">{scoreAvant}/45</strong></span>}
                {e?.apres  && (
                  <span>Après : <strong className="text-gray-700">{scoreApres}/45</strong>
                    {dp !== null && (
                      <span className={`ml-1 font-semibold ${dp >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        ({dp >= 0 ? '+' : ''}{dp}%)
                      </span>
                    )}
                  </span>
                )}
                {!e?.avant && !e?.apres && <span className="text-gray-300">Pas encore évalué</span>}
                <span>{appSess} sessions app</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Fiche apprenant ────────────────────────────────────────────────

function LearnerDetail({ learner, progress, evals, sessions, onBack }: {
  learner: Learner
  progress: AppProgress | null
  evals: { avant: EvalRow | null; apres: EvalRow | null }
  sessions: number
  onBack: () => void
}) {
  const scoreAvant = getScore(evals.avant)
  const scoreApres = getScore(evals.apres)
  const statut     = calcStatut(scoreApres, !!evals.apres)
  const dp         = (evals.avant && evals.apres) ? progPct(scoreAvant, scoreApres) : null

  const [editType, setEditType]   = useState<'avant' | 'apres' | null>(null)
  const [scores, setScores]       = useState<Record<string, number>>({})
  const [promotion, setPromotion] = useState('')
  const [observation, setObs]     = useState('')
  const [saving, setSaving]       = useState(false)

  function openEdit(type: 'avant' | 'apres') {
    const existing = type === 'avant' ? evals.avant : evals.apres
    const init: Record<string, number> = {}
    for (const c of COMPETENCES) init[c.key] = (existing?.[c.key as keyof EvalRow] as number) ?? 0
    setScores(init)
    setPromotion(existing?.promotion || '')
    setObs(existing?.observation_terrain || '')
    setEditType(type)
  }

  async function handleSave() {
    if (!editType) return
    setSaving(true)
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learner_id: learner.id, type_evaluation: editType, promotion, observation_terrain: observation, scores }),
      })
      if (res.ok) { setEditType(null); window.location.reload() }
    } finally { setSaving(false) }
  }

  const liveScore = COMPETENCES.reduce((s, c) => s + (scores[c.key] ?? 0), 0)

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Retour à la liste
      </button>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{learner.nom_complet || learner.email}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {METIER_LABELS[learner.metier_code || ''] || learner.metier_code || '—'}
            {learner.etablissement ? ` · ${learner.etablissement}` : ''}
          </p>
        </div>
        {evals.apres && (
          <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${STATUT_COLORS[statut]}`}>
            {STATUT_LABELS[statut]}
          </span>
        )}
      </div>

      {/* Scores /45 */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-gray-800">{evals.avant ? scoreAvant : '—'}</p>
          <p className="text-xs text-gray-500 mt-0.5">Score initial /45</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-gray-800">{evals.apres ? scoreApres : '—'}</p>
          <p className="text-xs text-gray-500 mt-0.5">Score final /45</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className={`text-2xl font-bold ${dp !== null && dp > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {dp !== null ? `${dp >= 0 ? '+' : ''}${dp}%` : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Progression</p>
        </div>
      </div>

      {/* Usage app */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-gray-800">{sessions}</p>
          <p className="text-xs text-gray-500 mt-0.5">Sessions app</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {progress?.overall_score != null ? `${progress.overall_score}%` : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Score app</p>
        </div>
      </div>

      {/* Boutons évaluation */}
      <div className="mt-5 flex gap-2">
        <button onClick={() => openEdit('avant')}
          className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {evals.avant ? 'Modifier éval. initiale' : '+ Éval. initiale'}
        </button>
        <button onClick={() => openEdit('apres')}
          className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
          {evals.apres ? 'Modifier éval. finale' : '+ Éval. finale'}
        </button>
      </div>

      {/* Formulaire 15 compétences */}
      {editType && (
        <div className="mt-5 bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            Grille — {editType === 'avant' ? 'Évaluation initiale' : 'Évaluation finale'}
          </h2>
          <input type="text" placeholder="Promotion (ex: NOOM Avril 2026)" value={promotion}
            onChange={e => setPromotion(e.target.value)}
            className="w-full mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400" />

          <div className="flex gap-2 mb-4 text-[10px] text-gray-500 flex-wrap">
            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-semibold">0 Incapable</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 font-semibold">1 Partiel</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 font-semibold">2 Fonctionnel</span>
            <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">3 Opérationnel</span>
          </div>

          <div className="space-y-3">
            {COMPETENCES.map((c, i) => (
              <div key={c.key}>
                <p className="text-xs text-gray-700 mb-1">
                  <span className="text-gray-400 mr-1">{i + 1}.</span>{c.label}
                </p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(v => (
                    <button key={v} type="button"
                      onClick={() => setScores(prev => ({ ...prev, [c.key]: v }))}
                      className={`flex-1 py-1.5 rounded text-xs font-semibold border transition-colors ${
                        scores[c.key] === v
                          ? v === 0 ? 'bg-red-500 border-red-500 text-white'
                          : v === 1 ? 'bg-amber-400 border-amber-400 text-white'
                          : v === 2 ? 'bg-blue-500 border-blue-500 text-white'
                          :           'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-center ${
            liveScore >= SEUIL_VERT ? 'bg-green-100 text-green-700'
            : liveScore >= SEUIL_ORANGE ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-600'
          }`}>
            Score : {liveScore}/45 — {
              liveScore >= SEUIL_VERT ? 'Opérationnel'
              : liveScore >= SEUIL_ORANGE ? 'Intermédiaire'
              : 'À risque'
            }
          </div>

          <textarea placeholder="Observation terrain (facultatif)" value={observation}
            onChange={e => setObs(e.target.value)} rows={3}
            className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />

          <div className="mt-3 flex gap-2">
            <button onClick={() => setEditType(null)}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
              Annuler
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* Détail compétences */}
      {(evals.avant || evals.apres) && !editType && (
        <div className="mt-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Détail des 15 compétences</h2>
          <div className="space-y-2">
            {COMPETENCES.map((c, i) => {
              const va = (evals.avant?.[c.key as keyof EvalRow] as number) ?? null
              const vb = (evals.apres?.[c.key as keyof EvalRow] as number) ?? null
              return (
                <div key={c.key} className="bg-white rounded-lg border border-gray-100 p-3">
                  <p className="text-xs font-medium text-gray-700">
                    <span className="text-gray-400 mr-1">{i + 1}.</span>{c.label}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    {evals.avant && <span>Avant : <ScorePill v={va} /></span>}
                    {evals.apres && <span>Après : <ScorePill v={vb} /></span>}
                    {va !== null && vb !== null && vb > va && (
                      <span className="text-green-600 font-medium">+{vb - va}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {evals.apres?.observation_terrain && !editType && (
        <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">Observation terrain</p>
          <p className="text-sm text-gray-700">{evals.apres.observation_terrain}</p>
        </div>
      )}
    </div>
  )
}

// ── Utilitaires ────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function ScorePill({ v }: { v: number | null }) {
  if (v === null) return <span className="text-gray-300">—</span>
  const colors = ['bg-red-100 text-red-600', 'bg-amber-100 text-amber-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-700']
  const labels = ['Incapable', 'Partiel', 'Fonctionnel', 'Opérationnel']
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${colors[v]}`}>
      {v} – {labels[v]}
    </span>
  )
}

