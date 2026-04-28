'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const COMPETENCES: { key: string; label: string }[] = [
  { key: 'accueillir_client', label: 'Accueillir un client en anglais' },
  { key: 'comprendre_demande', label: "Comprendre une demande simple a l'oral" },
  { key: 'repondre_demande', label: 'Repondre a une demande simple' },
  { key: 'donner_information', label: 'Donner une information claire' },
  { key: 'orienter_client', label: 'Orienter un client ou indiquer une direction' },
  { key: 'verifier_information', label: 'Verifier une information ou une demande' },
  { key: 'reformuler_confirmer', label: 'Reformuler pour valider la comprehension' },
  { key: 'gerer_reclamation', label: 'Gerer une reclamation simple' },
  { key: 'proposer_solution', label: 'Proposer une solution adaptee' },
  { key: 'gerer_situation_difficile', label: 'Gerer une situation difficile ou une incomprehension' },
  { key: 'utiliser_vocabulaire_metier', label: 'Utiliser le vocabulaire metier adapte en situation' },
  { key: 'maintenir_echange_fluide', label: 'Maintenir un echange fluide avec le client' },
  { key: 'gerer_appel', label: 'Gerer un echange telephonique simple' },
  { key: 'conclure_interaction', label: 'Cloturer un echange de maniere professionnelle' },
  { key: 'dire_non_professionnellement', label: 'Refuser ou poser une limite de facon professionnelle' },
]

const SCORE_MAX = 45
const SEUIL_VERT = 30
const SEUIL_ORANGE = 15

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

interface SessionCount {
  user_id: string
}

interface ManagerClientProps {
  learners: Learner[]
  allProgress: AppProgress[]
  allEvaluations: EvalRow[]
  sessionCounts: SessionCount[]
}

const METIER_LABELS: Record<string, string> = {
  RECEPTION: 'Reception',
  HOUSEKEEPING: 'Housekeeping',
  RESTAURANT: 'Restaurant',
  SECURITY: 'Securite',
}

type StatutKey = 'vert' | 'orange' | 'rouge' | 'nd'

const STATUT_LABELS: Record<StatutKey, string> = {
  vert: 'Operationnel',
  orange: 'Intermediaire',
  rouge: 'A risque',
  nd: 'Non evalue',
}

const STATUT_CLASSES: Record<StatutKey, string> = {
  vert: 'bg-green-50 text-green-700 ring-green-200',
  orange: 'bg-amber-50 text-amber-700 ring-amber-200',
  rouge: 'bg-red-50 text-red-700 ring-red-200',
  nd: 'bg-gray-100 text-gray-600 ring-gray-200',
}

function getScore(evaluation: EvalRow | null | undefined) {
  return evaluation?.score_total ?? 0
}

function getStatus(score: number, hasEval: boolean): StatutKey {
  if (!hasEval) return 'nd'
  if (score >= SEUIL_VERT) return 'vert'
  if (score >= SEUIL_ORANGE) return 'orange'
  return 'rouge'
}

function getProgressionPercent(before: number, after: number) {
  return Math.round(((after - before) / SCORE_MAX) * 100)
}

function formatMetier(value: string | null) {
  if (!value) return 'Donnee non disponible'
  return METIER_LABELS[value] || value
}

function formatHotel(value: string | null) {
  return value || 'Donnee non disponible'
}

function formatAppScore(progress: AppProgress | null) {
  return progress?.overall_score != null ? `${progress.overall_score}%` : 'Donnee non disponible'
}

function formatLastActivity(value: string | null) {
  if (!value) return 'Aucune session'
  return new Date(value).toLocaleDateString('fr-FR')
}

function formatSessions(count: number) {
  return count > 0 ? `${count} session${count > 1 ? 's' : ''}` : 'Aucune session'
}

function formatScoreValue(score: number | null, suffix = '/45') {
  return score !== null ? `${score}${suffix}` : 'Non evalue'
}

function getCompletionRate(total: number, completed: number) {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export default function ManagerClient({
  learners,
  allProgress,
  allEvaluations,
  sessionCounts,
}: ManagerClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterMetier, setFilterMetier] = useState<string>('all')
  const [filterHotel, setFilterHotel] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const progressMap = new Map<string, AppProgress>()
  for (const progress of allProgress) progressMap.set(progress.user_id, progress)

  const evalMap = new Map<string, { avant: EvalRow | null; apres: EvalRow | null }>()
  for (const evaluation of allEvaluations) {
    const current = evalMap.get(evaluation.learner_id) || { avant: null, apres: null }
    if (evaluation.type_evaluation === 'avant') current.avant = evaluation
    else current.apres = evaluation
    evalMap.set(evaluation.learner_id, current)
  }

  const sessionMap = new Map<string, number>()
  for (const session of sessionCounts) {
    sessionMap.set(session.user_id, (sessionMap.get(session.user_id) || 0) + 1)
  }

  const hotels = Array.from(
    new Set(learners.map((learner) => learner.etablissement).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b, 'fr'))

  const filtered = learners.filter((learner) => {
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      (learner.nom_complet || '').toLowerCase().includes(query) ||
      learner.email.toLowerCase().includes(query)
    const matchesMetier = filterMetier === 'all' || learner.metier_code === filterMetier
    const matchesHotel = filterHotel === 'all' || learner.etablissement === filterHotel
    return matchesSearch && matchesMetier && matchesHotel
  })

  const withInitialEval = learners.filter((learner) => evalMap.get(learner.id)?.avant).length
  const withFinalEval = learners.filter((learner) => evalMap.get(learner.id)?.apres).length
  const withBothEvals = learners.filter(
    (learner) => evalMap.get(learner.id)?.avant && evalMap.get(learner.id)?.apres,
  )

  let statusGreen = 0
  let statusOrange = 0
  let statusRed = 0
  let beforeSum = 0
  let afterSum = 0

  for (const learner of learners) {
    const evaluation = evalMap.get(learner.id)
    const status = getStatus(getScore(evaluation?.apres), Boolean(evaluation?.apres))
    if (status === 'vert') statusGreen += 1
    else if (status === 'orange') statusOrange += 1
    else if (status === 'rouge') statusRed += 1
  }

  for (const learner of withBothEvals) {
    const evaluation = evalMap.get(learner.id)!
    beforeSum += getScore(evaluation.avant)
    afterSum += getScore(evaluation.apres)
  }

  const averageBefore =
    withBothEvals.length > 0 ? Math.round((beforeSum / withBothEvals.length) * 10) / 10 : null
  const averageAfter =
    withBothEvals.length > 0 ? Math.round((afterSum / withBothEvals.length) * 10) / 10 : null
  const averageProgression =
    averageBefore !== null && averageAfter !== null
      ? getProgressionPercent(averageBefore, averageAfter)
      : null
  const operationalRate = withFinalEval > 0 ? Math.round((statusGreen / withFinalEval) * 100) : null
  const activityRate = getCompletionRate(learners.length, new Set(sessionCounts.map((row) => row.user_id)).size)

  const selectedLearner = selectedId ? learners.find((learner) => learner.id === selectedId) || null : null

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
    <div className="mx-auto max-w-6xl px-4 py-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Pilotage RH</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Suivi des apprenants et des evaluations</h1>
            <p className="mt-2 text-sm text-gray-600">
              Vue terrain pour suivre les evaluations, l'usage de l'application et les profils a
              renforcer avant le pilote.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push('/manager/positioning')}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Ouvrir positioning
            </button>
            <button
              onClick={() => router.push('/manager/rapport')}
              className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300"
            >
              Ouvrir le rapport client
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Score initial moyen"
            value={averageBefore !== null ? `${averageBefore}/45` : 'Non evalue'}
            hint={`${withInitialEval} evaluation(s) initiale(s)`}
          />
          <KpiCard
            label="Score final moyen"
            value={averageAfter !== null ? `${averageAfter}/45` : 'Non evalue'}
            hint={`${withFinalEval} evaluation(s) finale(s)`}
            tone={averageAfter !== null && averageAfter >= SEUIL_VERT ? 'green' : 'neutral'}
          />
          <KpiCard
            label="Progression moyenne"
            value={
              averageProgression !== null
                ? `${averageProgression >= 0 ? '+' : ''}${averageProgression}%`
                : 'En attente'
            }
            hint={`${withBothEvals.length} apprenant(s) avec deux evaluations`}
            tone={averageProgression !== null && averageProgression > 0 ? 'blue' : 'neutral'}
          />
          <KpiCard
            label="Taux operationnel"
            value={operationalRate !== null ? `${operationalRate}%` : 'En attente'}
            hint="Base : evaluations finales"
            tone={operationalRate !== null && operationalRate >= 50 ? 'green' : 'neutral'}
          />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Lecture rapide
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <StatusOverviewCard
                label="Operationnels"
                value={statusGreen}
                range={`>= ${SEUIL_VERT}/45`}
                tone="green"
              />
              <StatusOverviewCard
                label="Intermediaires"
                value={statusOrange}
                range={`${SEUIL_ORANGE}-${SEUIL_VERT - 1}/45`}
                tone="amber"
              />
              <StatusOverviewCard label="A risque" value={statusRed} range={`< ${SEUIL_ORANGE}/45`} tone="red" />
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Usage application
            </p>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <SummaryLine label="Apprenants" value={String(learners.length)} />
              <SummaryLine label="Sessions remontees" value={String(sessionCounts.length)} />
              <SummaryLine label="Taux d'activite" value={`${activityRate}%`} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filtrer les apprenants</h2>
              <p className="text-sm text-gray-500">
                Recherche rapide par nom, email, metier et hotel.
              </p>
            </div>
            <div className="rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-gray-200">
              {filtered.length} resultat(s)
            </div>
          </div>

          <input
            type="text"
            placeholder="Rechercher un apprenant"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {['all', 'RECEPTION', 'HOUSEKEEPING', 'RESTAURANT', 'SECURITY'].map((metier) => (
                <FilterChip
                  key={metier}
                  active={filterMetier === metier}
                  label={metier === 'all' ? 'Tous les metiers' : formatMetier(metier)}
                  onClick={() => setFilterMetier(metier)}
                />
              ))}
            </div>

            {hotels.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={filterHotel === 'all'}
                  label="Tous les hotels"
                  tone="gray"
                  onClick={() => setFilterHotel('all')}
                />
                {hotels.map((hotel) => (
                  <FilterChip
                    key={hotel}
                    active={filterHotel === hotel}
                    label={hotel}
                    tone="gray"
                    onClick={() => setFilterHotel(hotel)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-5">
        {filtered.length === 0 ? (
          <EmptyStateCard
            title="Aucun apprenant a afficher"
            description="Aucun profil ne correspond aux filtres en cours. Ajustez la recherche ou les segments metier/hotel."
          />
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {filtered.map((learner) => {
              const evaluations = evalMap.get(learner.id)
              const progress = progressMap.get(learner.id) || null
              const scoreBefore = evaluations?.avant ? getScore(evaluations.avant) : null
              const scoreAfter = evaluations?.apres ? getScore(evaluations.apres) : null
              const status = getStatus(scoreAfter ?? 0, Boolean(evaluations?.apres))
              const progression =
                scoreBefore !== null && scoreAfter !== null
                  ? getProgressionPercent(scoreBefore, scoreAfter)
                  : null
              const appSessions = sessionMap.get(learner.id) || 0

              return (
                <button
                  key={learner.id}
                  onClick={() => setSelectedId(learner.id)}
                  className="rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-gray-900">
                        {learner.nom_complet || learner.email}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatMetier(learner.metier_code)} · {formatHotel(learner.etablissement)}
                      </p>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <MiniStat label="Initial" value={formatScoreValue(scoreBefore)} />
                    <MiniStat label="Final" value={formatScoreValue(scoreAfter)} />
                    <MiniStat
                      label="Progression"
                      value={
                        progression !== null
                          ? `${progression >= 0 ? '+' : ''}${progression}%`
                          : 'En attente'
                      }
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
                    <InfoPill label={formatSessions(appSessions)} />
                    <InfoPill label={`Score app : ${formatAppScore(progress)}`} />
                    <InfoPill label={`Derniere activite : ${formatLastActivity(progress?.last_activity_date || null)}`} />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function LearnerDetail({
  learner,
  progress,
  evals,
  sessions,
  onBack,
}: {
  learner: Learner
  progress: AppProgress | null
  evals: { avant: EvalRow | null; apres: EvalRow | null }
  sessions: number
  onBack: () => void
}) {
  const scoreBefore = evals.avant ? getScore(evals.avant) : null
  const scoreAfter = evals.apres ? getScore(evals.apres) : null
  const status = getStatus(scoreAfter ?? 0, Boolean(evals.apres))
  const progression =
    scoreBefore !== null && scoreAfter !== null
      ? getProgressionPercent(scoreBefore, scoreAfter)
      : null

  const [editType, setEditType] = useState<'avant' | 'apres' | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [promotion, setPromotion] = useState('')
  const [observation, setObservation] = useState('')
  const [saving, setSaving] = useState(false)

  function openEdit(type: 'avant' | 'apres') {
    const existing = type === 'avant' ? evals.avant : evals.apres
    const initialScores: Record<string, number> = {}
    for (const competence of COMPETENCES) {
      initialScores[competence.key] = (existing?.[competence.key as keyof EvalRow] as number) ?? 0
    }
    setScores(initialScores)
    setPromotion(existing?.promotion || '')
    setObservation(existing?.observation_terrain || '')
    setEditType(type)
  }

  async function handleSave() {
    if (!editType) return

    setSaving(true)
    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learner_id: learner.id,
          type_evaluation: editType,
          promotion,
          observation_terrain: observation,
          scores,
        }),
      })

      if (response.ok) {
        setEditType(null)
        window.location.reload()
      }
    } finally {
      setSaving(false)
    }
  }

  const liveScore = COMPETENCES.reduce((sum, competence) => sum + (scores[competence.key] ?? 0), 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <button
        onClick={onBack}
        className="mb-4 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
      >
        Retour a la liste
      </button>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Fiche apprenant
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {learner.nom_complet || learner.email}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {formatMetier(learner.metier_code)} · {formatHotel(learner.etablissement)}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Score initial" value={formatScoreValue(scoreBefore)} />
          <KpiCard label="Score final" value={formatScoreValue(scoreAfter)} />
          <KpiCard
            label="Progression"
            value={
              progression !== null ? `${progression >= 0 ? '+' : ''}${progression}%` : 'En attente'
            }
          />
          <KpiCard label="Usage app" value={formatSessions(sessions)} hint={formatAppScore(progress)} />
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openEdit('avant')}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {evals.avant ? 'Modifier eval. initiale' : 'Ajouter eval. initiale'}
              </button>
              <button
                onClick={() => openEdit('apres')}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {evals.apres ? 'Modifier eval. finale' : 'Ajouter eval. finale'}
              </button>
            </div>

            {editType && (
              <div className="mt-5 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">
                  {editType === 'avant' ? 'Evaluation initiale' : 'Evaluation finale'}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Barreme 0 a 3 par competence, total sur 45 points.
                </p>

                <input
                  type="text"
                  placeholder="Promotion (ex: NOOM Avril 2026)"
                  value={promotion}
                  onChange={(event) => setPromotion(event.target.value)}
                  className="mt-4 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-gray-600">
                  <LegendPill label="0 Incapable" tone="red" />
                  <LegendPill label="1 Partiel" tone="amber" />
                  <LegendPill label="2 Fonctionnel" tone="blue" />
                  <LegendPill label="3 Operationnel" tone="green" />
                </div>

                <div className="mt-4 space-y-4">
                  {COMPETENCES.map((competence, index) => (
                    <div key={competence.key}>
                      <p className="mb-2 text-sm text-gray-700">
                        <span className="mr-1 text-gray-400">{index + 1}.</span>
                        {competence.label}
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              setScores((current) => ({
                                ...current,
                                [competence.key]: value,
                              }))
                            }
                            className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                              scores[competence.key] === value
                                ? getEditorTone(value)
                                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${getLiveScoreTone(liveScore)}`}>
                  Score courant : {liveScore}/45
                </div>

                <textarea
                  placeholder="Observation terrain (facultatif)"
                  value={observation}
                  onChange={(event) => setObservation(event.target.value)}
                  rows={4}
                  className="mt-4 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditType(null)}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {(evals.avant || evals.apres) && !editType ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Detail des 15 competences</h2>
              <div className="mt-4 space-y-3">
                {COMPETENCES.map((competence, index) => {
                  const beforeValue = (evals.avant?.[competence.key as keyof EvalRow] as number) ?? null
                  const afterValue = (evals.apres?.[competence.key as keyof EvalRow] as number) ?? null

                  return (
                    <div key={competence.key} className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        <span className="mr-1 text-gray-400">{index + 1}.</span>
                        {competence.label}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                        <span>Avant : <ScorePill value={beforeValue} /></span>
                        <span>Apres : <ScorePill value={afterValue} /></span>
                        {beforeValue !== null && afterValue !== null && afterValue > beforeValue && (
                          <span className="font-semibold text-green-600">+{afterValue - beforeValue}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            !editType && (
              <EmptyStateCard
                title="Aucune evaluation disponible"
                description="Ajoutez une evaluation initiale ou finale pour afficher le detail pedagogique."
              />
            )
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Synthese terrain</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <DetailLine label="Sessions app" value={formatSessions(sessions)} />
              <DetailLine label="Score app" value={formatAppScore(progress)} />
              <DetailLine
                label="Derniere activite"
                value={formatLastActivity(progress?.last_activity_date || null)}
              />
              <DetailLine label="Hotel" value={formatHotel(learner.etablissement)} />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Observation terrain</h2>
            <p className="mt-3 text-sm text-gray-600">
              {evals.apres?.observation_terrain || 'Donnee non disponible'}
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

function KpiCard({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'neutral' | 'green' | 'blue'
}) {
  const toneClass =
    tone === 'green'
      ? 'border-green-200 bg-green-50'
      : tone === 'blue'
        ? 'border-blue-200 bg-blue-50'
        : 'border-gray-200 bg-gray-50'

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  )
}

function StatusOverviewCard({
  label,
  value,
  range,
  tone,
}: {
  label: string
  value: number
  range: string
  tone: 'green' | 'amber' | 'red'
}) {
  const toneClass =
    tone === 'green'
      ? 'border-green-200 bg-green-50 text-green-700'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-red-200 bg-red-50 text-red-700'

  return (
    <div className={`rounded-2xl border p-4 text-center ${toneClass}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-[11px] opacity-80">{range}</p>
    </div>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function FilterChip({
  active,
  label,
  onClick,
  tone = 'blue',
}: {
  active: boolean
  label: string
  onClick: () => void
  tone?: 'blue' | 'gray'
}) {
  const activeClass =
    tone === 'gray'
      ? 'border-gray-700 bg-gray-700 text-white'
      : 'border-blue-600 bg-blue-600 text-white'
  const inactiveClass =
    tone === 'gray'
      ? 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
      : 'border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200'

  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${active ? activeClass : inactiveClass}`}
    >
      {label}
    </button>
  )
}

function StatusBadge({ status }: { status: StatutKey }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUT_CLASSES[status]}`}>
      {STATUT_LABELS[status]}
    </span>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3 ring-1 ring-gray-100">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
      {label}
    </span>
  )
}

function LegendPill({ label, tone }: { label: string; tone: 'red' | 'amber' | 'blue' | 'green' }) {
  const className =
    tone === 'red'
      ? 'bg-red-100 text-red-700'
      : tone === 'amber'
        ? 'bg-amber-100 text-amber-700'
        : tone === 'blue'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-green-100 text-green-700'

  return <span className={`rounded-full px-3 py-1 font-semibold ${className}`}>{label}</span>
}

function getEditorTone(value: number) {
  if (value === 0) return 'border-red-500 bg-red-500 text-white'
  if (value === 1) return 'border-amber-400 bg-amber-400 text-white'
  if (value === 2) return 'border-blue-500 bg-blue-500 text-white'
  return 'border-green-500 bg-green-500 text-white'
}

function getLiveScoreTone(score: number) {
  if (score >= SEUIL_VERT) return 'bg-green-100 text-green-700'
  if (score >= SEUIL_ORANGE) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  )
}

function EmptyStateCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  )
}

function ScorePill({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="font-medium text-gray-500">Non evalue</span>
  }

  const colorMap = [
    'bg-red-100 text-red-700',
    'bg-amber-100 text-amber-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
  ]
  const labelMap = ['Incapable', 'Partiel', 'Fonctionnel', 'Operationnel']

  return (
    <span className={`inline-block rounded-full px-2 py-1 font-semibold ${colorMap[value]}`}>
      {value} · {labelMap[value]}
    </span>
  )
}
