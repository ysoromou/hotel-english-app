'use client'

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
  nom_complet: string | null
  email: string
  metier_code: string | null
  etablissement: string | null
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

interface AppProgress {
  user_id: string
  overall_score: number
  actions_completed: number
  last_activity_date: string | null
}

interface SessionRow {
  user_id: string
}

interface RapportClientProps {
  learners: Learner[]
  evaluations: EvalRow[]
  appProgress: AppProgress[]
  sessions: SessionRow[]
}

const METIER_LABELS: Record<string, string> = {
  RECEPTION: 'Reception',
  HOUSEKEEPING: 'Housekeeping',
  RESTAURANT: 'Restaurant',
  SECURITY: 'Securite',
}

const STATUS_LABELS = {
  vert: 'Operationnel',
  orange: 'Intermediaire',
  rouge: 'A risque',
} as const

const STATUS_COLORS = {
  vert: '#16a34a',
  orange: '#d97706',
  rouge: '#dc2626',
} as const

const STATUS_BACKGROUNDS = {
  vert: '#f0fdf4',
  orange: '#fffbeb',
  rouge: '#fef2f2',
} as const

const STATUS_BORDERS = {
  vert: '#bbf7d0',
  orange: '#fde68a',
  rouge: '#fecaca',
} as const

type StatusKey = 'vert' | 'orange' | 'rouge'

function getScore(evaluation: EvalRow | null | undefined) {
  return evaluation?.score_total ?? 0
}

function getPercent(score: number) {
  return Math.round((score / SCORE_MAX) * 100)
}

function getProgressPercent(before: number, after: number) {
  return Math.round(((after - before) / SCORE_MAX) * 100)
}

function getStatus(score: number): StatusKey {
  if (score >= SEUIL_VERT) return 'vert'
  if (score >= SEUIL_ORANGE) return 'orange'
  return 'rouge'
}

function formatEmptyValue(value: string | null | undefined, fallback = 'Donnee non disponible') {
  return value && value.trim().length > 0 ? value : fallback
}

function formatScore(score: number | null) {
  return score !== null ? `${score}/45` : 'Non evalue'
}

function formatSessions(count: number) {
  return count > 0 ? `${count} session${count > 1 ? 's' : ''}` : 'Aucune session'
}

function buildLearnerComment(afterScore: number, delta: number | null, sessionCount: number) {
  const status = getStatus(afterScore)
  if (status === 'vert' && delta !== null && delta > 0) return 'Progression confirmee. Niveau operationnel.'
  if (status === 'vert') return 'Niveau operationnel.'
  if (status === 'orange' && sessionCount === 0) return "Renforcement a engager. Aucun usage app constate."
  if (status === 'orange' && delta !== null && delta > 0) return 'En progression. Renforcement a poursuivre.'
  if (status === 'orange') return 'Niveau intermediaire. Renforcement cible recommande.'
  if (sessionCount === 0) return 'Aucune session app. Accompagnement prioritaire.'
  if (delta !== null && delta > 0) return 'Progression visible mais encore insuffisante.'
  return 'Sous le seuil operationnel. Suivi individuel recommande.'
}

export default function RapportClient({
  learners,
  evaluations,
  appProgress,
  sessions,
}: RapportClientProps) {
  const evalMap = new Map<string, { avant: EvalRow | null; apres: EvalRow | null }>()
  for (const evaluation of evaluations) {
    const current = evalMap.get(evaluation.learner_id) || { avant: null, apres: null }
    if (evaluation.type_evaluation === 'avant') current.avant = evaluation
    else current.apres = evaluation
    evalMap.set(evaluation.learner_id, current)
  }

  const progressMap = new Map<string, AppProgress>()
  for (const progress of appProgress) progressMap.set(progress.user_id, progress)

  const sessionMap = new Map<string, number>()
  for (const session of sessions) {
    sessionMap.set(session.user_id, (sessionMap.get(session.user_id) || 0) + 1)
  }

  const withFinalEval = learners.filter((learner) => evalMap.get(learner.id)?.apres)
  const withBothEval = learners.filter(
    (learner) => evalMap.get(learner.id)?.avant && evalMap.get(learner.id)?.apres,
  )

  let beforeSum = 0
  let afterSum = 0
  let countGreen = 0
  let countOrange = 0
  let countRed = 0

  for (const learner of withBothEval) {
    const evaluation = evalMap.get(learner.id)!
    beforeSum += getScore(evaluation.avant)
    afterSum += getScore(evaluation.apres)
  }

  for (const learner of withFinalEval) {
    const status = getStatus(getScore(evalMap.get(learner.id)?.apres))
    if (status === 'vert') countGreen += 1
    else if (status === 'orange') countOrange += 1
    else countRed += 1
  }

  const averageBefore =
    withBothEval.length > 0 ? Math.round((beforeSum / withBothEval.length) * 10) / 10 : null
  const averageAfter =
    withBothEval.length > 0 ? Math.round((afterSum / withBothEval.length) * 10) / 10 : null
  const averageDelta =
    averageBefore !== null && averageAfter !== null
      ? Math.round((averageAfter - averageBefore) * 10) / 10
      : null
  const averageDeltaPercent =
    averageBefore !== null && averageAfter !== null
      ? getProgressPercent(averageBefore, averageAfter)
      : null
  const operationalRate =
    withFinalEval.length > 0 ? Math.round((countGreen / withFinalEval.length) * 100) : null

  let heterogeneous = false
  if (withBothEval.length >= 2) {
    const deltas = withBothEval.map((learner) => {
      const evaluation = evalMap.get(learner.id)!
      return getScore(evaluation.apres) - getScore(evaluation.avant)
    })
    heterogeneous = Math.max(...deltas) - Math.min(...deltas) >= 10
  }

  const totalSessions = sessions.length
  const activeLearners = learners.filter((learner) => (sessionMap.get(learner.id) || 0) > 0).length
  const activityRate = learners.length > 0 ? Math.round((activeLearners / learners.length) * 100) : 0
  const averageSessionsPerActive =
    activeLearners > 0 ? Math.round((totalSessions / activeLearners) * 10) / 10 : null

  const greenSessions = withFinalEval
    .filter((learner) => getStatus(getScore(evalMap.get(learner.id)?.apres)) === 'vert')
    .map((learner) => sessionMap.get(learner.id) || 0)
  const redSessions = withFinalEval
    .filter((learner) => getStatus(getScore(evalMap.get(learner.id)?.apres)) === 'rouge')
    .map((learner) => sessionMap.get(learner.id) || 0)
  const averageGreenSessions =
    greenSessions.length > 0
      ? Math.round(greenSessions.reduce((sum, value) => sum + value, 0) / greenSessions.length)
      : null
  const averageRedSessions =
    redSessions.length > 0
      ? Math.round(redSessions.reduce((sum, value) => sum + value, 0) / redSessions.length)
      : null
  const appUsageLooksDeterminant =
    averageGreenSessions !== null &&
    averageRedSessions !== null &&
    averageGreenSessions > averageRedSessions + 2

  const competenceAverages: { key: string; label: string; avg: number }[] = []
  if (withFinalEval.length > 0) {
    for (const competence of COMPETENCES) {
      const sum = withFinalEval.reduce((acc, learner) => {
        const evaluation = evalMap.get(learner.id)?.apres
        return acc + ((evaluation?.[competence.key as keyof EvalRow] as number) ?? 0)
      }, 0)
      competenceAverages.push({
        key: competence.key,
        label: competence.label,
        avg: Math.round((sum / withFinalEval.length) * 10) / 10,
      })
    }
  }

  const competenceByScore = [...competenceAverages].sort((a, b) => b.avg - a.avg)
  const topThree = competenceByScore.slice(0, 3)
  const bottomThree = competenceByScore.slice(-3).reverse()

  const rankedByDelta = withBothEval
    .map((learner) => {
      const evaluation = evalMap.get(learner.id)!
      return {
        learner,
        before: getScore(evaluation.avant),
        after: getScore(evaluation.apres),
        delta: getScore(evaluation.apres) - getScore(evaluation.avant),
      }
    })
    .sort((a, b) => b.delta - a.delta)

  const bestProgression = rankedByDelta[0] || null
  const lowestProgression = rankedByDelta[rankedByDelta.length - 1] || null
  const riskProfile =
    withFinalEval
      .map((learner) => ({
        learner,
        score: getScore(evalMap.get(learner.id)?.apres),
        sessions: sessionMap.get(learner.id) || 0,
      }))
      .filter((row) => getStatus(row.score) === 'rouge')
      .sort((a, b) => a.score - b.score)[0] || null

  const promotion = evaluations.find((evaluation) => evaluation.promotion)?.promotion || 'En attente'
  const hotels =
    Array.from(new Set(learners.map((learner) => learner.etablissement).filter(Boolean))).join(', ') ||
    'Donnee non disponible'
  const reportDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const averageAppScore =
    appProgress.length > 0
      ? Math.round(
          appProgress.reduce((sum, progress) => sum + (progress.overall_score || 0), 0) /
            appProgress.length,
        )
      : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="print:hidden sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <a
            href="/manager"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
          >
            Retour au tableau de bord
          </a>
          <button
            onClick={() => window.print()}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Imprimer ou exporter PDF
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <section className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <img
                src="/logo-caformac.png"
                alt="CAFORMAC AFRICONSULT"
                className="h-14 w-auto max-w-[240px] object-contain"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Rapport client
                </p>
                <h1 className="mt-1 text-3xl font-bold text-gray-900">Resultats de la formation</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Anglais professionnel hotelier - synthese exploitable pour le pilote NOOM / SEEN.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 ring-1 ring-gray-100">
              <p>
                <span className="font-semibold text-gray-900">Date :</span> {reportDate}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-gray-900">Promotion :</span> {promotion}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-gray-900">Effectif :</span> {learners.length} apprenant(s)
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Score initial moyen"
              value={averageBefore !== null ? `${averageBefore}/45` : 'Non evalue'}
              hint={averageBefore !== null ? `${getPercent(averageBefore)}% du score max` : 'En attente'}
            />
            <MetricCard
              label="Score final moyen"
              value={averageAfter !== null ? `${averageAfter}/45` : 'Non evalue'}
              hint={averageAfter !== null ? `${getPercent(averageAfter)}% du score max` : 'En attente'}
              tone={averageAfter !== null && averageAfter >= SEUIL_VERT ? 'green' : 'neutral'}
            />
            <MetricCard
              label="Progression moyenne"
              value={
                averageDelta !== null ? `${averageDelta >= 0 ? '+' : ''}${averageDelta} pts` : 'En attente'
              }
              hint={
                averageDeltaPercent !== null
                  ? `${averageDeltaPercent >= 0 ? '+' : ''}${averageDeltaPercent}% du score max`
                  : 'En attente'
              }
              tone={averageDelta !== null && averageDelta > 0 ? 'blue' : 'neutral'}
            />
            <MetricCard
              label={`Operationnels >= ${SEUIL_VERT}/45`}
              value={operationalRate !== null ? `${operationalRate}%` : 'En attente'}
              hint={operationalRate !== null ? `${countGreen} sur ${withFinalEval.length} evalues` : 'En attente'}
              tone={operationalRate !== null && operationalRate >= 50 ? 'green' : 'neutral'}
            />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Repartition des statuts
              </p>
              {withFinalEval.length > 0 ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <StatusCard status="vert" value={countGreen} range={`>= ${SEUIL_VERT}/45`} />
                  <StatusCard status="orange" value={countOrange} range={`${SEUIL_ORANGE}-${SEUIL_VERT - 1}/45`} />
                  <StatusCard status="rouge" value={countRed} range={`< ${SEUIL_ORANGE}/45`} />
                </div>
              ) : (
                <EmptyInline label="Aucun resultat final disponible a ce stade." />
              )}
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Cadre du rapport
              </p>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <SummaryLine label="Etablissement(s)" value={hotels} />
                <SummaryLine label="Sessions app" value={String(totalSessions)} />
                <SummaryLine
                  label="Score app moyen"
                  value={averageAppScore !== null ? `${averageAppScore}%` : 'Donnee non disponible'}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle index="1" title="Synthese executive" />
          {withFinalEval.length === 0 ? (
            <EmptyPanel
              title="Resultats en attente"
              description="Les evaluations finales ne sont pas encore disponibles. La synthese executive sera alimentee automatiquement des que les scores seront renseignes."
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gray-900 px-5 py-4 text-sm leading-relaxed text-white">
                <p>
                  {averageBefore !== null && averageAfter !== null ? (
                    <>
                      Le groupe passe de <strong>{averageBefore}/45</strong> a{' '}
                      <strong>{averageAfter}/45</strong>. La progression moyenne est de{' '}
                      <strong>
                        {averageDelta !== null ? `${averageDelta >= 0 ? '+' : ''}${averageDelta} pts` : '0 pt'}
                      </strong>
                      {averageDeltaPercent !== null
                        ? ` (${averageDeltaPercent >= 0 ? '+' : ''}${averageDeltaPercent}%). `
                        : '. '}
                    </>
                  ) : (
                    'Les evaluations finales sont disponibles mais la comparaison complete reste en attente. '
                  )}
                  <span style={{ color: countGreen > 0 ? '#86efac' : '#e5e7eb' }}>
                    {operationalRate !== null ? `${operationalRate}% du groupe est operationnel` : 'Lecture operationnelle en attente'}
                  </span>
                  {countOrange > 0 ? `, ${countOrange} profil(s) est/sont a consolider` : ''}
                  {countRed > 0 ? `, ${countRed} profil(s) reste(nt) sous le seuil.` : '.'}
                </p>
                <p className="mt-2 text-xs text-gray-300">
                  {heterogeneous
                    ? 'Progressions heterogenes : ecart sensible entre les meilleurs resultats et les profils les plus faibles.'
                    : 'Progressions homogenes : le groupe evolue de facon relativement cohérente.'}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <NarrativeCard
                  tone="green"
                  title="Impact immediat"
                  text={`${countGreen} collaborateur(s) sont exploitables en situation client.`}
                />
                <NarrativeCard
                  tone="amber"
                  title="Consolidation"
                  text={
                    countOrange > 0
                      ? `${countOrange} profil(s) necessitent un renforcement cible pour atteindre le seuil.`
                      : 'Aucun profil intermediaire a consolider.'
                  }
                />
                <NarrativeCard
                  tone="red"
                  title="Risque terrain"
                  text={
                    countRed > 0
                      ? `${countRed} profil(s) restent sous le seuil operationnel et demandent un suivi prioritaire.`
                      : 'Aucun profil critique identifie.'
                  }
                />
              </div>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle index="2" title="Usage de l'application" />
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard label="Sessions totales" value={String(totalSessions)} hint="learning_sessions" />
            <MetricCard
              label="Taux d'activite"
              value={`${activityRate}%`}
              hint={`${activeLearners}/${learners.length} actif(s)`}
            />
            <MetricCard
              label="Moy. sessions / actif"
              value={averageSessionsPerActive !== null ? String(averageSessionsPerActive) : 'Aucune session'}
              hint="Base : apprenants actifs"
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Lecture usage
              </p>
              <p className="mt-3 text-sm text-gray-700">
                {appUsageLooksDeterminant
                  ? `Les apprenants operationnels realisent en moyenne ${averageGreenSessions} sessions, contre ${averageRedSessions} pour les profils a risque. L'engagement app semble contribuer au resultat.`
                  : totalSessions === 0
                    ? "Aucune session app n'a ete enregistree sur ce groupe."
                    : "L'usage app est observable, mais l'ecart entre les groupes reste trop faible pour conclure a un effet net."}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Comparatif sessions
              </p>
              {(averageGreenSessions !== null || averageRedSessions !== null) ? (
                <div className="mt-3 space-y-3 text-sm">
                  <SummaryLine
                    label="Operationnels"
                    value={
                      averageGreenSessions !== null
                        ? `moy. ${averageGreenSessions} sessions`
                        : 'Donnee non disponible'
                    }
                  />
                  <SummaryLine
                    label="Profils a risque"
                    value={
                      averageRedSessions !== null
                        ? `moy. ${averageRedSessions} sessions`
                        : 'Donnee non disponible'
                    }
                  />
                </div>
              ) : (
                <EmptyInline label="Donnee non disponible" />
              )}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle index="3" title="Resultats par apprenant" />
          {learners.length === 0 ? (
            <EmptyPanel
              title="Aucun apprenant"
              description="Le rapport ne peut pas etre genere sans apprenants rattaches a cette promotion."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-3 py-3">Apprenant</th>
                      <th className="px-3 py-3">Metier</th>
                      <th className="px-3 py-3 text-center">Avant</th>
                      <th className="px-3 py-3 text-center">Apres</th>
                      <th className="px-3 py-3 text-center">Progression</th>
                      <th className="px-3 py-3 text-center">Usage app</th>
                      <th className="px-3 py-3">Lecture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learners.map((learner) => {
                      const evaluation = evalMap.get(learner.id)
                      const beforeScore = evaluation?.avant ? getScore(evaluation.avant) : null
                      const afterScore = evaluation?.apres ? getScore(evaluation.apres) : null
                      const delta =
                        beforeScore !== null && afterScore !== null ? afterScore - beforeScore : null
                      const deltaPercent =
                        beforeScore !== null && afterScore !== null
                          ? getProgressPercent(beforeScore, afterScore)
                          : null
                      const status = afterScore !== null ? getStatus(afterScore) : null
                      const sessionCount = sessionMap.get(learner.id) || 0
                      const comment =
                        afterScore !== null ? buildLearnerComment(afterScore, delta, sessionCount) : 'Non evalue'

                      return (
                        <tr key={learner.id} className="border-b border-gray-100 align-top">
                          <td className="px-3 py-3">
                            <p className="font-semibold text-gray-900">
                              {learner.nom_complet || learner.email}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatEmptyValue(learner.etablissement)}
                            </p>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {formatEmptyValue(
                              learner.metier_code ? METIER_LABELS[learner.metier_code] || learner.metier_code : null,
                            )}
                          </td>
                          <td className="px-3 py-3 text-center text-sm text-gray-600">
                            {formatScore(beforeScore)}
                          </td>
                          <td className="px-3 py-3 text-center text-sm font-semibold text-gray-900">
                            {formatScore(afterScore)}
                          </td>
                          <td className="px-3 py-3 text-center text-sm">
                            {delta !== null ? (
                              <div className={delta >= 0 ? 'text-green-700' : 'text-red-700'}>
                                <p className="font-semibold">{delta >= 0 ? `+${delta}` : `${delta}`}</p>
                                <p className="text-xs text-gray-500">
                                  {deltaPercent !== null ? `${deltaPercent >= 0 ? '+' : ''}${deltaPercent}%` : ''}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-500">En attente</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center text-sm text-gray-600">
                            {formatSessions(sessionCount)}
                          </td>
                          <td className="px-3 py-3">
                            {status ? (
                              <>
                                <span
                                  className="rounded-full px-2 py-1 text-xs font-semibold"
                                  style={{
                                    color: STATUS_COLORS[status],
                                    background: STATUS_BACKGROUNDS[status],
                                  }}
                                >
                                  {STATUS_LABELS[status]}
                                </span>
                                <p className="mt-2 text-xs leading-relaxed text-gray-500">{comment}</p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500">Non evalue</p>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Score sur 45 points. Seuil operationnel : {SEUIL_VERT}/45.
              </p>
            </>
          )}
        </section>

        <section className="mt-5 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle index="4" title="Lecture pedagogique" />
          {withFinalEval.length === 0 || competenceAverages.length === 0 ? (
            <EmptyPanel
              title="Lecture pedagogique en attente"
              description="Les competences seront consolidees des qu'un volume suffisant d'evaluations finales sera disponible."
            />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <CompetencePanel
                  title="Points forts du groupe"
                  items={topThree}
                  tone="green"
                  emptyLabel="Donnee non disponible"
                />
                <CompetencePanel
                  title="Points a renforcer"
                  items={bottomThree}
                  tone="red"
                  emptyLabel="Donnee non disponible"
                />
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-gray-700">
                <p className="font-semibold text-amber-800">Lecture client</p>
                <p className="mt-1">
                  {bottomThree.length > 0
                    ? `Les competences les plus faibles concernent ${bottomThree
                        .map((item) => item.label.toLowerCase())
                        .join(', ')}. Elles doivent etre traitees en priorite avant passage a l'echelle.`
                    : 'Aucun point faible prioritaire n apparait dans les donnees disponibles.'}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle index="5" title="Observations terrain" />
          {evaluations.filter((evaluation) => evaluation.type_evaluation === 'apres' && evaluation.observation_terrain).length === 0 ? (
            <EmptyPanel
              title="Aucune observation terrain"
              description="Les remarques qualitatives n'ont pas encore ete renseignees."
            />
          ) : (
            <div className="space-y-3">
              {evaluations
                .filter((evaluation) => evaluation.type_evaluation === 'apres' && evaluation.observation_terrain)
                .map((evaluation) => {
                  const learner = learners.find((row) => row.id === evaluation.learner_id)
                  const status = getStatus(getScore(evaluation))

                  return (
                    <div key={evaluation.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {learner?.nom_complet || learner?.email || 'Donnee non disponible'}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatEmptyValue(learner?.etablissement || null)}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2 py-1 text-xs font-semibold"
                          style={{
                            color: STATUS_COLORS[status],
                            background: STATUS_BACKGROUNDS[status],
                          }}
                        >
                          {STATUS_LABELS[status]}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-gray-700">
                        {evaluation.observation_terrain}
                      </p>
                    </div>
                  )
                })}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle index="6" title="Faits marquants" />
          {!(bestProgression || riskProfile) ? (
            <EmptyPanel
              title="Aucun fait marquant"
              description="Les donnees disponibles ne permettent pas encore de faire ressortir de profils singuliers."
            />
          ) : (
            <div className="space-y-3">
              {bestProgression ? (
                <NarrativeCard
                  tone="green"
                  title="Meilleure progression"
                  text={`${bestProgression.learner.nom_complet || bestProgression.learner.email} : ${bestProgression.before}/45 -> ${bestProgression.after}/45 (${bestProgression.delta >= 0 ? '+' : ''}${bestProgression.delta} pts).`}
                />
              ) : null}
              {lowestProgression && rankedByDelta.length > 1 ? (
                <NarrativeCard
                  tone="amber"
                  title="Progression la plus faible"
                  text={`${lowestProgression.learner.nom_complet || lowestProgression.learner.email} : resultat final ${lowestProgression.after}/45.`}
                />
              ) : null}
              {riskProfile ? (
                <NarrativeCard
                  tone="red"
                  title="Profil prioritaire"
                  text={`${riskProfile.learner.nom_complet || riskProfile.learner.email} : ${riskProfile.score}/45 et ${formatSessions(riskProfile.sessions).toLowerCase()}.`}
                />
              ) : null}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
          <SectionTitle index="7" title="Recommandations" />
          <RecommendationsPanel
            operationalRate={operationalRate}
            countGreen={countGreen}
            countOrange={countOrange}
            countRed={countRed}
            bottomThree={bottomThree}
            activityRate={activityRate}
            appUsageLooksDeterminant={appUsageLooksDeterminant}
            averageDeltaPercent={averageDeltaPercent}
          />
        </section>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-xs text-gray-500 shadow-sm">
          <p>Rapport genere le {reportDate} - Hotel English Pro - CAFORMAC.</p>
          <p className="mt-1">
            Grille : 15 competences transverses, score /45, seuil operationnel a partir de {SEUIL_VERT}/45.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 1.5cm; size: A4; }
          section { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  )
}

function RecommendationsPanel({
  operationalRate,
  countGreen,
  countOrange,
  countRed,
  bottomThree,
  activityRate,
  appUsageLooksDeterminant,
  averageDeltaPercent,
}: {
  operationalRate: number | null
  countGreen: number
  countOrange: number
  countRed: number
  bottomThree: { label: string; avg: number }[]
  activityRate: number
  appUsageLooksDeterminant: boolean
  averageDeltaPercent: number | null
}) {
  const maintain: string[] = []
  const reinforce: string[] = []
  const correct: string[] = []

  if (countGreen > 0) {
    maintain.push(
      `Maintenir le micro-learning pour les ${countGreen} profil(s) deja operationnels.`,
    )
  }
  if (averageDeltaPercent !== null && averageDeltaPercent > 0) {
    maintain.push(`La progression moyenne de +${averageDeltaPercent}% valide le format actuel.`)
  }
  if (activityRate >= 70) {
    maintain.push(`Le taux d'activite app est bon (${activityRate}%).`)
  }

  if (countOrange > 0) {
    reinforce.push(
      `Cibler les ${countOrange} profil(s) intermediaires avec des mises en situation guidees.`,
    )
  }
  if (bottomThree.length > 0) {
    reinforce.push(
      `Renforcer en priorite : ${bottomThree
        .slice(0, 2)
        .map((item) => item.label.toLowerCase())
        .join(' et ')}.`,
    )
  }
  if (appUsageLooksDeterminant) {
    reinforce.push("Augmenter l'usage app chez les profils non operationnels.")
  }

  if (countRed > 0) {
    correct.push(
      `${countRed} profil(s) restent sous ${SEUIL_ORANGE}/45 : suivi individuel recommande avant autonomie terrain.`,
    )
  }
  if (activityRate < 30) {
    correct.push(`Le taux d'activite app est faible (${activityRate}%). Identifier les freins d'acces.`)
  }

  let nextStep = "Completer les evaluations finales pour consolider la recommandation."
  if (operationalRate !== null && operationalRate >= 70) {
    nextStep =
      "Le groupe est largement exploitable. Recommandation : maintien regulier et bilan de consolidation a 3 mois."
  } else if (operationalRate !== null && operationalRate >= 50) {
    nextStep =
      'Une phase courte de renforcement cible sur 4 semaines peut faire basculer les profils intermediaires.'
  } else if (operationalRate !== null) {
    nextStep =
      "Le groupe n'est pas encore suffisamment robuste pour un deploiement autonome. Un renforcement prioritaire est necessaire."
  }

  return (
    <div className="space-y-3">
      {maintain.length > 0 ? <RecoBlock title="A maintenir" items={maintain} tone="green" /> : null}
      {reinforce.length > 0 ? <RecoBlock title="A renforcer" items={reinforce} tone="amber" /> : null}
      {correct.length > 0 ? <RecoBlock title="A corriger en priorite" items={correct} tone="red" /> : null}
      <div className="rounded-2xl bg-gray-900 px-5 py-4 text-sm text-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Prochaine etape</p>
        <p className="mt-2 leading-relaxed">{nextStep}</p>
      </div>
    </div>
  )
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
        {index}
      </span>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
  )
}

function MetricCard({
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

function StatusCard({
  status,
  value,
  range,
}: {
  status: StatusKey
  value: number
  range: string
}) {
  return (
    <div
      className="rounded-2xl border p-4 text-center"
      style={{
        color: STATUS_COLORS[status],
        background: STATUS_BACKGROUNDS[status],
        borderColor: STATUS_BORDERS[status],
      }}
    >
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm font-semibold">{STATUS_LABELS[status]}</p>
      <p className="mt-1 text-[11px] opacity-80">{range}</p>
    </div>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  )
}

function NarrativeCard({
  tone,
  title,
  text,
}: {
  tone: 'green' | 'amber' | 'red'
  title: string
  text: string
}) {
  const toneClass =
    tone === 'green'
      ? 'border-green-200 bg-green-50 text-green-800'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-red-200 bg-red-50 text-red-800'

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-700">{text}</p>
    </div>
  )
}

function CompetencePanel({
  title,
  items,
  tone,
  emptyLabel,
}: {
  title: string
  items: { key: string; label: string; avg: number }[]
  tone: 'green' | 'red'
  emptyLabel: string
}) {
  const toneClass =
    tone === 'green'
      ? 'border-green-200 bg-green-50'
      : 'border-red-200 bg-red-50'
  const textClass = tone === 'green' ? 'text-green-800' : 'text-red-800'

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className={`text-sm font-semibold ${textClass}`}>{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">{emptyLabel}</p>
      ) : (
        <div className="mt-3 space-y-3">
          {items.map((item, index) => (
            <div key={item.key} className="flex items-start gap-3">
              <span className={`mt-0.5 text-xs font-bold ${textClass}`}>{index + 1}.</span>
              <div>
                <p className="text-sm text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">Moyenne : {item.avg}/3</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RecoBlock({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'green' | 'amber' | 'red'
}) {
  const toneClass =
    tone === 'green'
      ? 'border-green-200 bg-green-50'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50'
        : 'border-red-200 bg-red-50'
  const textClass =
    tone === 'green'
      ? 'text-green-800'
      : tone === 'amber'
        ? 'text-amber-800'
        : 'text-red-800'

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${textClass}`}>{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <span className={`mt-0.5 font-bold ${textClass}`}>-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center">
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  )
}

function EmptyInline({ label }: { label: string }) {
  return <p className="text-sm text-gray-500">{label}</p>
}
