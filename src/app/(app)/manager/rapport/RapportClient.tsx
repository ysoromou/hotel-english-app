'use client'

// Rapport client CAFORMAC — Anglais professionnel hôtelier
// Grille 15 compétences transverses · Score /45 · Seuil opérationnel ≥ 30
// Orienté décision — chaque bloc = données réelles + interprétation

// ── Grille v3 ─────────────────────────────────────────────────────
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

interface SessionRow { user_id: string }

interface RapportClientProps {
  learners: Learner[]
  evaluations: EvalRow[]
  appProgress: AppProgress[]
  sessions: SessionRow[]
}

// ── Helpers ────────────────────────────────────────────────────────

const METIER_LABELS: Record<string, string> = {
  RECEPTION:    'Réception',
  HOUSEKEEPING: 'Housekeeping',
  RESTAURANT:   'Restaurant',
  SECURITY:     'Sécurité',
}

const C_VERT   = '#16a34a'
const C_ORANGE = '#d97706'
const C_ROUGE  = '#dc2626'
const BG_VERT   = '#f0fdf4'
const BG_ORANGE = '#fffbeb'
const BG_ROUGE  = '#fef2f2'
const BD_VERT   = '#bbf7d0'
const BD_ORANGE = '#fde68a'
const BD_ROUGE  = '#fecaca'

function sc(e: EvalRow | null | undefined): number { return e?.score_total ?? 0 }
function pct(score: number): number { return Math.round((score / SCORE_MAX) * 100) }
function dpct(avant: number, apres: number): number { return Math.round(((apres - avant) / SCORE_MAX) * 100) }

type Statut = 'vert' | 'orange' | 'rouge'
function statut(score: number): Statut {
  if (score >= SEUIL_VERT)   return 'vert'
  if (score >= SEUIL_ORANGE) return 'orange'
  return 'rouge'
}
const SL: Record<Statut, string> = { vert: 'Opérationnel', orange: 'Intermédiaire', rouge: 'À risque' }
const SC: Record<Statut, string> = { vert: C_VERT, orange: C_ORANGE, rouge: C_ROUGE }
const SBG: Record<Statut, string> = { vert: BG_VERT, orange: BG_ORANGE, rouge: BG_ROUGE }
const SBD: Record<Statut, string> = { vert: BD_VERT, orange: BD_ORANGE, rouge: BD_ROUGE }

// Commentaire par apprenant basé sur score + progression + sessions
function commentaireApprenant(scoreApres: number, delta: number | null, sessions: number): string {
  const s = statut(scoreApres)
  if (s === 'vert' && delta !== null && delta > 0) return `Progression confirmée. Opérationnel.`
  if (s === 'vert' && delta !== null && delta <= 0) return `Score maintenu. Opérationnel.`
  if (s === 'vert') return `Opérationnel.`
  if (s === 'orange' && sessions === 0) return `Pas d'usage app détecté. Renforcement à engager.`
  if (s === 'orange' && delta !== null && delta > 0) return `En progression. Renforcement à poursuivre.`
  if (s === 'orange') return `Niveau intermédiaire. Renforcement ciblé recommandé.`
  if (s === 'rouge' && sessions === 0) return `Aucune session app. Accompagnement prioritaire.`
  if (s === 'rouge' && delta !== null && delta > 0) return `Progression visible mais insuffisante. Suivi individuel.`
  return `Sous le seuil opérationnel. Intervention prioritaire.`
}

// ── Composant principal ────────────────────────────────────────────

export default function RapportClient({ learners, evaluations, appProgress, sessions }: RapportClientProps) {

  // Maps
  const evalMap = new Map<string, { avant: EvalRow | null; apres: EvalRow | null }>()
  for (const e of evaluations) {
    const entry = evalMap.get(e.learner_id) || { avant: null, apres: null }
    if (e.type_evaluation === 'avant') entry.avant = e
    else entry.apres = e
    evalMap.set(e.learner_id, entry)
  }

  const sessionMap = new Map<string, number>()
  for (const s of sessions) sessionMap.set(s.user_id, (sessionMap.get(s.user_id) || 0) + 1)

  // Groupes
  const avecApres     = learners.filter(l => evalMap.get(l.id)?.apres)
  const avecDeuxEvals = learners.filter(l => evalMap.get(l.id)?.avant && evalMap.get(l.id)?.apres)

  // Scores
  let sumAvant = 0, sumApres = 0, nbVert = 0, nbOrange = 0, nbRouge = 0
  for (const l of avecDeuxEvals) {
    const e = evalMap.get(l.id)!
    sumAvant += sc(e.avant)
    sumApres += sc(e.apres)
  }
  for (const l of avecApres) {
    const s = statut(sc(evalMap.get(l.id)?.apres))
    if (s === 'vert') nbVert++
    else if (s === 'orange') nbOrange++
    else nbRouge++
  }

  const avgAvant  = avecDeuxEvals.length > 0 ? Math.round(sumAvant / avecDeuxEvals.length * 10) / 10 : null
  const avgApres  = avecDeuxEvals.length > 0 ? Math.round(sumApres / avecDeuxEvals.length * 10) / 10 : null
  const avgDelta  = (avgAvant !== null && avgApres !== null) ? Math.round((avgApres - avgAvant) * 10) / 10 : null
  const avgDeltaPct = (avgAvant !== null && avgApres !== null) ? dpct(avgAvant, avgApres) : null
  const pctOp     = avecApres.length > 0 ? Math.round(nbVert / avecApres.length * 100) : null

  // Homogénéité des progressions
  let heterogene = false
  if (avecDeuxEvals.length >= 2) {
    const deltas = avecDeuxEvals.map(l => {
      const e = evalMap.get(l.id)!
      return sc(e.apres) - sc(e.avant)
    })
    const min = Math.min(...deltas)
    const max = Math.max(...deltas)
    heterogene = (max - min) >= 10
  }

  // Usage app
  const totalSessions = sessions.length
  const nbActifs      = learners.filter(l => (sessionMap.get(l.id) || 0) > 0).length
  const tauxActivite  = learners.length > 0 ? Math.round(nbActifs / learners.length * 100) : 0
  const moySessActif  = nbActifs > 0 ? Math.round(totalSessions / nbActifs * 10) / 10 : 0

  // Corrélation sessions → statut
  const sessVerts  = avecApres.filter(l => statut(sc(evalMap.get(l.id)?.apres)) === 'vert').map(l => sessionMap.get(l.id) || 0)
  const sessRouges = avecApres.filter(l => statut(sc(evalMap.get(l.id)?.apres)) === 'rouge').map(l => sessionMap.get(l.id) || 0)
  const avgSessVert  = sessVerts.length  > 0 ? Math.round(sessVerts.reduce((a,b)=>a+b,0)  / sessVerts.length)  : null
  const avgSessRouge = sessRouges.length > 0 ? Math.round(sessRouges.reduce((a,b)=>a+b,0) / sessRouges.length) : null
  const usageDeterminant = avgSessVert !== null && avgSessRouge !== null && avgSessVert > avgSessRouge + 2

  // Top / flop compétences (sur évals après)
  const compAvg: { key: string; label: string; avg: number }[] = []
  if (avecApres.length > 0) {
    for (const c of COMPETENCES) {
      const sum = avecApres.reduce((acc, l) => {
        const e = evalMap.get(l.id)?.apres
        return acc + ((e?.[c.key as keyof EvalRow] as number) ?? 0)
      }, 0)
      compAvg.push({ key: c.key, label: c.label, avg: Math.round(sum / avecApres.length * 10) / 10 })
    }
  }
  const compParScore = [...compAvg].sort((a, b) => b.avg - a.avg)
  const top3  = compParScore.slice(0, 3)
  const flop3 = compParScore.slice(-3).reverse()

  // Top / risques individuels
  const classeParDelta = avecDeuxEvals.map(l => {
    const e = evalMap.get(l.id)!
    return { l, avant: sc(e.avant), apres: sc(e.apres), delta: sc(e.apres) - sc(e.avant) }
  }).sort((a, b) => b.delta - a.delta)

  const meilleureProgression   = classeParDelta[0] || null
  const plusFaibleProgression  = classeParDelta[classeParDelta.length - 1] || null
  const profilARisque = avecApres
    .map(l => ({ l, score: sc(evalMap.get(l.id)?.apres), sessions: sessionMap.get(l.id) || 0 }))
    .filter(x => statut(x.score) === 'rouge')
    .sort((a, b) => a.score - b.score)[0] || null

  // Métadonnées
  const promotion  = evaluations.find(e => e.promotion)?.promotion || '—'
  const hotels     = Array.from(new Set(learners.map(l => l.etablissement).filter(Boolean))).join(', ') || '—'
  const dateRapport = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-white">

      {/* Barre — cachée à l'impression */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <a href="/manager" className="text-sm text-gray-500 hover:text-gray-700">← Retour au dashboard</a>
        <button onClick={() => window.print()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm">
          Imprimer / Exporter PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* EN-TÊTE */}
        <div className="border-b-2 border-gray-900 pb-5 mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">CAFORMAC — Rapport de formation</p>
          <h1 className="text-3xl font-bold text-gray-900">Résultats de la formation</h1>
          <p className="text-base text-gray-500 mt-1">Anglais professionnel hôtelier</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-gray-600">
            <span><strong>Établissement :</strong> {hotels}</span>
            <span><strong>Promotion :</strong> {promotion}</span>
            <span><strong>Date :</strong> {dateRapport}</span>
            <span><strong>Effectif :</strong> {learners.length} apprenants</span>
          </div>
        </div>

        {/* ══ 1. SYNTHÈSE EXÉCUTIVE ══ */}
        <section className="mb-10">
          <Titre num="1" title="Synthèse exécutive" />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Metric label="Score initial moyen" value={avgAvant !== null ? `${avgAvant}/45` : '—'} sub={avgAvant !== null ? `${pct(avgAvant)}% du score max` : ''} />
            <Metric label="Score final moyen"   value={avgApres !== null ? `${avgApres}/45` : '—'} sub={avgApres !== null ? `${pct(avgApres)}% du score max` : ''} vert={avgApres !== null && avgApres >= SEUIL_VERT} />
            <Metric label="Progression moyenne"
              value={avgDelta !== null ? `${avgDelta >= 0 ? '+' : ''}${avgDelta} pts` : '—'}
              sub={avgDeltaPct !== null ? `${avgDeltaPct >= 0 ? '+' : ''}${avgDeltaPct}% du score max` : ''}
              vert={avgDelta !== null && avgDelta > 0} />
            <Metric label={`Opérationnels ≥${SEUIL_VERT}/45`}
              value={pctOp !== null ? `${pctOp}%` : '—'}
              sub={pctOp !== null ? `${nbVert} sur ${avecApres.length} évalués` : ''}
              vert={pctOp !== null && pctOp >= 50} />
          </div>

          {/* Répartition */}
          {avecApres.length > 0 && (
            <div className="flex gap-3 mb-4">
              {(['vert', 'orange', 'rouge'] as Statut[]).map(s => (
                <div key={s} className="flex-1 rounded-lg border py-3 text-center"
                  style={{ background: SBG[s], borderColor: SBD[s] }}>
                  <p className="text-2xl font-bold" style={{ color: SC[s] }}>
                    {s === 'vert' ? nbVert : s === 'orange' ? nbOrange : nbRouge}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: SC[s] }}>{SL[s]}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {s === 'vert' ? `≥${SEUIL_VERT} pts` : s === 'orange' ? `${SEUIL_ORANGE}–${SEUIL_VERT - 1} pts` : `<${SEUIL_ORANGE} pts`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Phrase directe — données réelles uniquement */}
          {avecApres.length > 0 && (
            <div className="bg-gray-900 rounded-xl px-5 py-4 text-sm leading-relaxed">
              <p className="text-white">
                {avgAvant !== null && avgApres !== null
                  ? <>Les équipes sont passées de <strong className="text-white">{avgAvant}/45</strong> à <strong className="text-white">{avgApres}/45</strong>
                    {avgDelta !== null && <> ({avgDelta >= 0 ? '+' : ''}{avgDelta} pts, {avgDeltaPct !== null ? `${avgDeltaPct >= 0 ? '+' : ''}${avgDeltaPct}%` : ''})</>}.{' '}
                  </>
                  : null
                }
                <span style={{ color: nbVert > 0 ? '#86efac' : '#9ca3af' }}>
                  {pctOp !== null ? `${pctOp}% sont opérationnels` : `${nbVert} opérationnel${nbVert > 1 ? 's' : ''}`}
                </span>
                {nbOrange > 0 && <>, <span style={{ color: '#fcd34d' }}>{nbOrange} en consolidation</span></>}
                {nbRouge > 0 && <>, <span style={{ color: '#fca5a5' }}>{nbRouge} sous le seuil</span></>}.
              </p>
              {heterogene && (
                <p className="text-gray-400 text-xs mt-2">
                  Progressions hétérogènes : écart significatif entre les meilleurs et les plus faibles résultats.
                </p>
              )}
              {!heterogene && avecDeuxEvals.length >= 2 && (
                <p className="text-gray-400 text-xs mt-2">
                  Progressions homogènes : le groupe a progressé de façon cohérente.
                </p>
              )}
              {nbRouge > 0 && (
                <p className="text-gray-400 text-xs mt-1">
                  {nbRouge} profil{nbRouge > 1 ? 's' : ''} à risque identifié{nbRouge > 1 ? 's' : ''} — voir section 7.
                </p>
              )}
            </div>
          )}
        </section>

        {/* ══ 2. IMPACT BUSINESS ══ */}
        <section className="mb-10">
          <Titre num="2" title="Impact business" />
          <div className="space-y-2 mb-4">
            {nbVert > 0 && (
              <LigneBusiness c={C_VERT} bg={BG_VERT} bd={BD_VERT} icon="✓"
                text={`${nbVert} collaborateur${nbVert > 1 ? 's' : ''} immédiatement opérationnel${nbVert > 1 ? 's' : ''} en anglais face client`} />
            )}
            {nbOrange > 0 && (
              <LigneBusiness c={C_ORANGE} bg={BG_ORANGE} bd={BD_ORANGE} icon="→"
                text={`${nbOrange} collaborateur${nbOrange > 1 ? 's' : ''} nécessite${nbOrange > 1 ? 'nt' : ''} un renforcement ciblé pour atteindre le seuil opérationnel`} />
            )}
            {nbRouge > 0 && (
              <LigneBusiness c={C_ROUGE} bg={BG_ROUGE} bd={BD_ROUGE} icon="⚠"
                text={`${nbRouge} collaborateur${nbRouge > 1 ? 's' : ''} sous le seuil opérationnel — accompagnement prioritaire nécessaire`} />
            )}
          </div>

          {/* Lecture automatique calibrée */}
          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700">
            {pctOp !== null && pctOp >= 70 && (
              <p>Dynamique positive : {pctOp}% d'opérationnels. La formation a produit son effet sur la majorité du groupe.
              {nbOrange > 0 || nbRouge > 0 ? ` Un accompagnement résiduel sur ${nbOrange + nbRouge} profil${(nbOrange + nbRouge) > 1 ? 's' : ''} permettrait d'atteindre l'objectif complet.` : ' Le groupe est opérationnel.'}</p>
            )}
            {pctOp !== null && pctOp >= 50 && pctOp < 70 && (
              <p>Progression réelle mais consolidation nécessaire : {pctOp}% d'opérationnels.
              {' '}Une phase 2 ciblée sur les {nbOrange} profils intermédiaires permettrait de faire basculer le résultat global.</p>
            )}
            {pctOp !== null && pctOp < 50 && (
              <p>Risque opérationnel : moins de la moitié du groupe atteint le seuil ({pctOp}%).
              {' '}Une intervention renforcée est nécessaire avant déploiement en autonomie.</p>
            )}
            {pctOp === null && <p>Évaluations finales non encore renseignées.</p>}
          </div>
        </section>

        {/* ══ 3. USAGE APPLICATION ══ */}
        <section className="mb-10">
          <Titre num="3" title="Usage de l'application" />
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Metric label="Sessions totales"      value={String(totalSessions)} />
            <Metric label="Taux d'activité"       value={`${tauxActivite}%`} sub={`${nbActifs}/${learners.length} actifs`} />
            <Metric label="Moy. sessions / actif" value={moySessActif > 0 ? String(moySessActif) : '—'} />
          </div>

          {/* Corrélation */}
          {(avgSessVert !== null || avgSessRouge !== null) && (
            <div className="rounded-lg border border-gray-200 overflow-hidden text-sm mb-3">
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Sessions app selon résultat
              </div>
              {avgSessVert !== null && (
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                  <span className="text-gray-700">Apprenants opérationnels ({sessVerts.length})</span>
                  <span className="font-semibold" style={{ color: C_VERT }}>moy. {avgSessVert} sessions</span>
                </div>
              )}
              {avgSessRouge !== null && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-gray-700">Apprenants à risque ({sessRouges.length})</span>
                  <span className="font-semibold" style={{ color: C_ROUGE }}>moy. {avgSessRouge} sessions</span>
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-gray-700 px-1">
            {usageDeterminant
              ? <>Usage déterminant : les apprenants opérationnels ont fait en moyenne <strong>{avgSessVert}</strong> sessions contre <strong>{avgSessRouge}</strong> pour ceux à risque. L'engagement sur l'app est corrélé au résultat.</>
              : totalSessions === 0
                ? 'Aucune session app enregistrée pour ce groupe.'
                : 'Usage non déterminant : l\'écart de sessions entre groupes est insuffisant pour établir une corrélation claire.'
            }
          </p>
        </section>

        {/* ══ 4. RÉSULTATS PAR APPRENANT ══ */}
        <section className="mb-10">
          <Titre num="4" title="Résultats par apprenant" />
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 font-semibold text-gray-700">Apprenant</th>
                <th className="text-left py-2 font-semibold text-gray-700">Métier</th>
                <th className="text-center py-2 font-semibold text-gray-700">Avant</th>
                <th className="text-center py-2 font-semibold text-gray-700">Après</th>
                <th className="text-center py-2 font-semibold text-gray-700">Prog.</th>
                <th className="text-center py-2 font-semibold text-gray-700">App</th>
                <th className="text-left py-2 font-semibold text-gray-700">Statut / lecture</th>
              </tr>
            </thead>
            <tbody>
              {learners.map(l => {
                const e       = evalMap.get(l.id)
                const avant   = e?.avant  ? sc(e.avant)  : null
                const apres   = e?.apres  ? sc(e.apres)  : null
                const delta   = (avant !== null && apres !== null) ? apres - avant : null
                const dPct    = (avant !== null && apres !== null) ? dpct(avant, apres) : null
                const stat    = apres !== null ? statut(apres) : null
                const appSess = sessionMap.get(l.id) || 0
                const comment = apres !== null ? commentaireApprenant(apres, delta, appSess) : ''

                return (
                  <tr key={l.id} className="border-b border-gray-100 align-top">
                    <td className="py-2.5 font-medium text-gray-900">{l.nom_complet || l.email}</td>
                    <td className="py-2.5 text-gray-400 text-xs">{METIER_LABELS[l.metier_code || ''] || '—'}</td>
                    <td className="py-2.5 text-center text-gray-500 text-xs">
                      {avant !== null ? `${avant}/45` : '—'}
                    </td>
                    <td className="py-2.5 text-center font-bold" style={{ color: stat ? SC[stat] : '#9ca3af' }}>
                      {apres !== null ? `${apres}/45` : '—'}
                    </td>
                    <td className="py-2.5 text-center text-xs font-semibold"
                      style={{ color: delta !== null ? (delta >= 0 ? C_VERT : C_ROUGE) : '#9ca3af' }}>
                      {delta !== null ? `${delta >= 0 ? '+' : ''}${delta}` : '—'}
                      {dPct !== null && <div className="text-[10px] font-normal text-gray-400">{dPct >= 0 ? '+' : ''}{dPct}%</div>}
                    </td>
                    <td className="py-2.5 text-center text-gray-400 text-xs">{appSess}</td>
                    <td className="py-2.5">
                      {stat && (
                        <>
                          <span className="text-xs font-semibold" style={{ color: SC[stat] }}>{SL[stat]}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{comment}</p>
                        </>
                      )}
                      {!stat && <span className="text-xs text-gray-300">Non évalué</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-gray-400">
            Score /45 · Seuil opérationnel ≥ {SEUIL_VERT} · 0 Incapable · 1 Partiel · 2 Fonctionnel · 3 Opérationnel
          </p>
        </section>

        {/* ══ 5. LECTURE PÉDAGOGIQUE ══ */}
        {avecApres.length > 0 && compAvg.length > 0 && (
          <section className="mb-10">
            <Titre num="5" title="Lecture pédagogique" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg border p-4" style={{ background: BG_VERT, borderColor: BD_VERT }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C_VERT }}>
                  Top 3 — Points forts du groupe
                </p>
                {top3.map((c, i) => (
                  <div key={c.key} className="flex items-start gap-2 mb-2">
                    <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: C_VERT }}>{i + 1}.</span>
                    <div>
                      <p className="text-xs text-gray-800 leading-snug">{c.label}</p>
                      <p className="text-[10px] text-gray-400">moy. {c.avg}/3</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border p-4" style={{ background: BG_ROUGE, borderColor: BD_ROUGE }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C_ROUGE }}>
                  Top 3 — Points faibles du groupe
                </p>
                {flop3.map((c, i) => (
                  <div key={c.key} className="flex items-start gap-2 mb-2">
                    <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: C_ROUGE }}>{i + 1}.</span>
                    <div>
                      <p className="text-xs text-gray-800 leading-snug">{c.label}</p>
                      <p className="text-[10px] text-gray-400">moy. {c.avg}/3</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact client des points faibles */}
            {flop3.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                <p className="font-semibold text-amber-800 mb-1">Impact sur les situations client</p>
                <p className="text-gray-700 text-xs leading-relaxed">
                  Les compétences les plus faibles ({flop3.map(c => c.label.toLowerCase()).join(', ')}) correspondent à des situations à risque en face client.
                  {flop3.some(c => c.avg < 1) && ' Certaines compétences sont en dessous de 1/3 en moyenne — non fonctionnelles en situation réelle.'}
                </p>
              </div>
            )}

            {/* Corrélation usage */}
            {usageDeterminant && avgSessVert !== null && (
              <p className="mt-3 text-xs text-gray-500 px-1">
                Les apprenants avec ≥ {avgSessVert} sessions app ont systématiquement atteint le seuil opérationnel.
                Ceux avec {avgSessRouge !== null ? `≤ ${avgSessRouge}` : 'peu de'} sessions restent sous le seuil.
              </p>
            )}
          </section>
        )}

        {/* ══ 6. OBSERVATIONS TERRAIN ══ */}
        <section className="mb-10">
          <Titre num="6" title="Observations terrain" />
          {evaluations.filter(e => e.type_evaluation === 'apres' && e.observation_terrain).length === 0 ? (
            <p className="text-sm text-gray-400 italic">À compléter</p>
          ) : (
            <div className="space-y-3">
              {evaluations
                .filter(e => e.type_evaluation === 'apres' && e.observation_terrain)
                .map(e => {
                  const l    = learners.find(x => x.id === e.learner_id)
                  const stat = statut(sc(e))
                  return (
                    <div key={e.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">{l?.nom_complet || l?.email || '—'}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ color: SC[stat], background: SBG[stat] }}>
                          {SL[stat]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{e.observation_terrain}</p>
                    </div>
                  )
                })}
            </div>
          )}
        </section>

        {/* ══ 7. FAITS MARQUANTS ══ */}
        {(meilleureProgression || profilARisque) && (
          <section className="mb-10">
            <Titre num="7" title="Faits marquants" />
            <div className="space-y-3">
              {meilleureProgression && (
                <div className="flex items-start gap-3 rounded-lg border px-4 py-3"
                  style={{ background: BG_VERT, borderColor: BD_VERT }}>
                  <span className="text-lg font-bold shrink-0" style={{ color: C_VERT }}>↑</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Meilleure progression</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {meilleureProgression.l.nom_complet || meilleureProgression.l.email} —{' '}
                      <span className="font-semibold" style={{ color: C_VERT }}>
                        +{meilleureProgression.delta} pts (+{dpct(meilleureProgression.avant, meilleureProgression.apres)}%)
                      </span>
                      , de {meilleureProgression.avant}/45 à {meilleureProgression.apres}/45
                    </p>
                  </div>
                </div>
              )}
              {plusFaibleProgression && classeParDelta.length > 1 && (
                <div className="flex items-start gap-3 rounded-lg border px-4 py-3"
                  style={{ background: BG_ORANGE, borderColor: BD_ORANGE }}>
                  <span className="text-lg font-bold shrink-0" style={{ color: C_ORANGE }}>→</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Progression la plus faible</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {plusFaibleProgression.l.nom_complet || plusFaibleProgression.l.email} —{' '}
                      {plusFaibleProgression.delta >= 0 ? `+${plusFaibleProgression.delta} pts` : `${plusFaibleProgression.delta} pts`},
                      résultat final {plusFaibleProgression.apres}/45
                    </p>
                  </div>
                </div>
              )}
              {profilARisque && (
                <div className="flex items-start gap-3 rounded-lg border px-4 py-3"
                  style={{ background: BG_ROUGE, borderColor: BD_ROUGE }}>
                  <span className="text-lg font-bold shrink-0" style={{ color: C_ROUGE }}>⚠</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Profil à risque prioritaire</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {profilARisque.l.nom_complet || profilARisque.l.email} —{' '}
                      score {profilARisque.score}/45 ({pct(profilARisque.score)}%),{' '}
                      {profilARisque.sessions} session{profilARisque.sessions > 1 ? 's' : ''} app
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══ 8. RECOMMANDATIONS ══ */}
        <section className="mb-10">
          <Titre num="8" title="Recommandations" />
          <Recommandations
            pctOp={pctOp}
            nbVert={nbVert} nbOrange={nbOrange} nbRouge={nbRouge}
            flop3={flop3}
            tauxActivite={tauxActivite}
            usageDeterminant={usageDeterminant}
            avgDeltaPct={avgDeltaPct}
          />
        </section>

        {/* PIED DE PAGE */}
        <div className="border-t border-gray-200 pt-4 mt-6 text-xs text-gray-400 space-y-1">
          <p>Rapport généré le {dateRapport} · Hotel English Pro · CAFORMAC</p>
          <p>Grille : 15 compétences transverses · Score /45 · Seuil opérationnel ≥ {SEUIL_VERT}/45 ({pct(SEUIL_VERT)}%)</p>
          <p>Barème : 0 = Incapable · 1 = Partiel · 2 = Fonctionnel · 3 = Opérationnel</p>
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

// ── Recommandations ────────────────────────────────────────────────

function Recommandations({ pctOp, nbVert, nbOrange, nbRouge, flop3, tauxActivite, usageDeterminant, avgDeltaPct }: {
  pctOp: number | null
  nbVert: number; nbOrange: number; nbRouge: number
  flop3: { label: string; avg: number }[]
  tauxActivite: number
  usageDeterminant: boolean
  avgDeltaPct: number | null
}) {
  const maintenir: string[] = []
  const renforcer: string[] = []
  const corriger:  string[] = []

  // À maintenir — basé sur données réelles
  if (nbVert > 0) {
    maintenir.push(`Continuer le micro-learning pour les ${nbVert} collaborateur${nbVert > 1 ? 's' : ''} opérationnel${nbVert > 1 ? 's' : ''}.`)
  }
  if (avgDeltaPct !== null && avgDeltaPct > 0) {
    maintenir.push(`La progression moyenne de +${avgDeltaPct}% valide l'approche. Maintenir le format.`)
  }
  if (tauxActivite >= 70) {
    maintenir.push(`Taux d'activité app de ${tauxActivite}% — l'engagement est bon. Capitaliser dessus.`)
  }

  // À renforcer — lié aux profils orange et aux compétences faibles
  if (nbOrange > 0) {
    renforcer.push(`Cibler les ${nbOrange} profil${nbOrange > 1 ? 's' : ''} intermédiaire${nbOrange > 1 ? 's' : ''} sur les compétences faibles identifiées.`)
  }
  if (flop3.length > 0) {
    renforcer.push(`Renforcer en priorité : ${flop3.slice(0, 2).map(c => c.label.toLowerCase()).join(' et ')}.`)
  }
  if (tauxActivite < 70 && tauxActivite >= 30) {
    renforcer.push(`Taux d'activité app à ${tauxActivite}% — relancer l'engagement avec un suivi manager hebdomadaire.`)
  }
  if (usageDeterminant) {
    renforcer.push(`L'usage app est corrélé au résultat. Augmenter la fréquence d'utilisation chez les profils orange.`)
  }

  // À corriger — lié aux profils rouge et aux blocages
  if (nbRouge > 0) {
    corriger.push(`${nbRouge} collaborateur${nbRouge > 1 ? 's' : ''} sous ${SEUIL_ORANGE}/45 — accompagnement individuel avant tout redéploiement.`)
    if (flop3.some(c => c.avg < 1)) {
      corriger.push(`Certaines compétences sont en dessous de 1/3 — revoir les bases avant de progresser.`)
    }
  }
  if (tauxActivite < 30) {
    corriger.push(`Taux d'activité app très faible (${tauxActivite}%) — identifier les freins d'accès à l'outil.`)
  }

  // Prochaine étape
  let prochaineEtape = ''
  if (pctOp !== null && pctOp >= 70) {
    prochaineEtape = `${pctOp}% d'opérationnels atteints. Recommandation : sessions de maintien 2× par semaine, mise en situation réelle dans le mois, bilan de consolidation à 3 mois.`
  } else if (pctOp !== null && pctOp >= 50) {
    prochaineEtape = `Phase 2 ciblée : 4 semaines de renforcement sur les compétences identifiées en section 5, avec suivi bimensuel. Objectif : faire basculer les ${nbOrange} profils intermédiaires.`
  } else if (pctOp !== null) {
    prochaineEtape = `Intervention renforcée sur ${nbRouge + nbOrange} collaborateurs avant déploiement en autonomie. Bilan individuel requis. Nouveau point à 4 semaines.`
  } else {
    prochaineEtape = `Compléter les évaluations finales pour obtenir une recommandation précise.`
  }

  return (
    <div className="space-y-3">
      {maintenir.length > 0 && <BlocReco statut="vert" titre="À maintenir" items={maintenir} />}
      {renforcer.length > 0 && <BlocReco statut="orange" titre="À renforcer" items={renforcer} />}
      {corriger.length  > 0 && <BlocReco statut="rouge"  titre="À corriger en priorité" items={corriger} />}
      <div className="rounded-lg border-2 border-gray-900 bg-gray-900 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Prochaine étape</p>
        <p className="text-sm text-gray-100 leading-relaxed">{prochaineEtape}</p>
      </div>
    </div>
  )
}

// ── Composants UI ──────────────────────────────────────────────────

function Titre({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{num}</span>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
    </div>
  )
}

function Metric({ label, value, sub, vert }: { label: string; value: string; sub?: string; vert?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${vert ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <p className={`text-2xl font-bold ${vert ? 'text-green-700' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function LigneBusiness({ c, bg, bd, icon, text }: { c: string; bg: string; bd: string; icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border px-4 py-3" style={{ background: bg, borderColor: bd }}>
      <span className="font-bold text-base shrink-0" style={{ color: c }}>{icon}</span>
      <p className="text-sm text-gray-800">{text}</p>
    </div>
  )
}

function BlocReco({ statut, titre, items }: { statut: Statut; titre: string; items: string[] }) {
  return (
    <div className="rounded-lg border p-4" style={{ borderColor: SBD[statut], background: SBG[statut] }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: SC[statut] }}>{titre}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="shrink-0 font-bold mt-0.5" style={{ color: SC[statut] }}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

