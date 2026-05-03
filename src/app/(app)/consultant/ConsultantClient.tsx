'use client'

import { useState } from 'react'

// ── Interface consultant / auditeur ─────────────────────────────────
// 3 onglets : Apprenants · Présence · Validation orale J1
// Simple, rapide, exploitable — pas un back-office lourd

// ── Types ───────────────────────────────────────────────────────────

interface Learner {
  id: string
  email: string
  nom_complet: string | null
  metier_code: string | null
  etablissement: string | null
  niveau_actuel: string | null
}

interface EvalSummary {
  learner_id: string
  type_evaluation: 'avant' | 'apres'
  score_total: number
}

interface AppProgress {
  user_id: string
  overall_score: number
  actions_completed: number
  current_level: string
}

interface AttendanceRow {
  id: string
  learner_id: string
  session_date: string
  session_label: string | null
  statut: 'present' | 'late' | 'absent' | 'excused'
  commentaire: string | null
}

interface OralValidation {
  id: string
  learner_id: string
  comprend_demande: number
  repond_pertinent: number
  reste_fluide: number
  vocabulaire_metier: number
  ton_professionnel: number
  score_oral: number
  niveau_suggere_app: string | null
  niveau_confirme: string | null
  a_revoir_seance_2: boolean
  commentaire: string | null
}

interface TestStatus {
  learner_id: string
  statut: 'not_started' | 'in_progress' | 'completed'
  score_global: number | null
  niveau_suggere: string | null
  niveau_confirme?: string | null
  confirmation_consultant: boolean
  oral_pending: boolean
  human_confirmation_required: boolean
  a_revoir_seance_2?: boolean
  commentaire?: string | null
  candidate_first_name?: string | null
  candidate_last_name?: string | null
  candidate_hotel?: string | null
  candidate_service?: string | null
  candidate_phone?: string | null
  candidate_email?: string | null
}

interface TestResponse {
  learner_id: string
  question_id: string
  section: string
  answer_audio?: string
  pending_human_review: boolean
}

interface ConsultantClientProps {
  learners: Learner[]
  evaluations: EvalSummary[]
  appProgress: AppProgress[]
  attendance: AttendanceRow[]
  oralValidations: OralValidation[]
  testStatus: TestStatus[]
  testResponses: TestResponse[]
}

// ── Constantes ──────────────────────────────────────────────────────

const METIER_LABELS: Record<string, string> = {
  RECEPTION: 'Réception', HOUSEKEEPING: 'Housekeeping',
  RESTAURANT: 'Restaurant', SECURITY: 'Sécurité',
}

const TABS = [
  { id: 'learners', label: 'Apprenants', icon: '👥' },
  { id: 'attendance', label: 'Présence', icon: '📋' },
  { id: 'oral', label: 'Orale J1', icon: '🎤' },
  { id: 'test_review', label: 'Revue Test', icon: '🎧' },
] as const

type TabId = typeof TABS[number]['id']

const ATTENDANCE_LABELS: Record<string, { label: string; color: string }> = {
  present: { label: 'Présent', color: 'bg-green-100 text-green-700' },
  late:    { label: 'Retard',  color: 'bg-amber-100 text-amber-700' },
  absent:  { label: 'Absent',  color: 'bg-red-100 text-red-700' },
  excused: { label: 'Excusé',  color: 'bg-gray-100 text-gray-500' },
}

const ORAL_CRITERIA = [
  { key: 'comprend_demande',   label: 'Comprend la demande' },
  { key: 'repond_pertinent',   label: 'Répond de façon pertinente' },
  { key: 'reste_fluide',       label: 'Reste fluide' },
  { key: 'vocabulaire_metier', label: 'Vocabulaire métier utile' },
  { key: 'ton_professionnel',  label: 'Ton professionnel' },
]

// ── Composant principal ─────────────────────────────────────────────

export default function ConsultantClient({
  learners, evaluations, appProgress, attendance, oralValidations, testStatus, testResponses
}: ConsultantClientProps) {
  const [tab, setTab] = useState<TabId>('learners')
  const [search, setSearch] = useState('')
  const [filterMetier, setFilterMetier] = useState('all')
  const [filterHotel, setFilterHotel] = useState('all')
  const [filterGroup, setFilterGroup] = useState('all')
  const [filterTestStatus, setFilterTestStatus] = useState('all')

  // Maps
  const evalMap = new Map<string, { avant: number | null; apres: number | null }>()
  for (const e of evaluations) {
    const entry = evalMap.get(e.learner_id) || { avant: null, apres: null }
    if (e.type_evaluation === 'avant') entry.avant = e.score_total
    else entry.apres = e.score_total
    evalMap.set(e.learner_id, entry)
  }

  const progressMap = new Map(appProgress.map(p => [p.user_id, p]))
  const oralMap = new Map(oralValidations.map(o => [o.learner_id, o]))
  const testMap = new Map(testStatus.map(t => [t.learner_id, t]))
  const hotels = Array.from(new Set(
    learners
      .map((learner) => learner.etablissement || testMap.get(learner.id)?.candidate_hotel || null)
      .filter(Boolean) as string[],
  )).sort((a, b) => a.localeCompare(b, 'fr'))

  // Filtre apprenants
  const filtered = learners.filter(l => {
    const tStat = testMap.get(l.id)
    const officialLevel = tStat?.niveau_confirme || tStat?.niveau_suggere
    const query = search.trim().toLowerCase()
    const matchSearch = !query ||
      (l.nom_complet || '').toLowerCase().includes(query) ||
      l.email.toLowerCase().includes(query) ||
      (l.etablissement || tStat?.candidate_hotel || '').toLowerCase().includes(query) ||
      (l.metier_code ? (METIER_LABELS[l.metier_code] || l.metier_code) : '').toLowerCase().includes(query) ||
      (tStat?.statut || '').toLowerCase().includes(query) ||
      (officialLevel || '').toLowerCase().includes(query) ||
      String(tStat?.score_global ?? '').includes(query) ||
      (tStat?.candidate_phone || '').toLowerCase().includes(query) ||
      (tStat?.candidate_email || '').toLowerCase().includes(query)
    const matchMetier = filterMetier === 'all' || l.metier_code === filterMetier
    const matchHotel = filterHotel === 'all' || (l.etablissement || tStat?.candidate_hotel) === filterHotel
    const matchGroup = filterGroup === 'all' || officialLevel === filterGroup
    const matchStatus = filterTestStatus === 'all' || tStat?.statut === filterTestStatus

    return matchSearch && matchMetier && matchHotel && matchGroup && matchStatus
  })

  const GROUP_LABELS: Record<string, string> = {
    beginner_group: 'Débutant',
    intermediate_group: 'Intermédiaire',
    sufficient_level_candidate: 'Niveau Suffisant',
  }

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Interface Consultant</h1>
        <a href="/manager" className="text-xs font-bold text-brand-mid hover:text-brand-dark py-2 px-4 bg-brand-light/10 rounded-full transition-colors">
          Dashboard Manager →
        </a>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[100px] py-3 px-2 rounded-2xl text-[13px] font-extrabold transition-all outline-none ${
              tab === t.id ? 'bg-brand-dark text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
            }`}>
            <span className="mr-1.5 opacity-80">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Recherche + filtre (partagé) */}
      <div className="space-y-4 mb-6">
        <input type="text" placeholder="Rechercher un apprenant..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full rounded-[1.2rem] border border-gray-200 px-5 py-4 text-sm font-medium outline-none focus:border-brand-mid focus:ring-4 focus:ring-brand-light/20 transition-all shadow-sm" />
        
        {/* Ligne 1 : Métiers */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {['all', 'RECEPTION', 'HOUSEKEEPING', 'RESTAURANT', 'SECURITY'].map(m => (
            <button key={m} onClick={() => setFilterMetier(m)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                filterMetier === m ? 'bg-brand-mid text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {m === 'all' ? 'Tous' : METIER_LABELS[m] || m}
            </button>
          ))}
        </div>
        {hotels.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <button key="all-hotels" onClick={() => setFilterHotel('all')}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                filterHotel === 'all' ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              Tous les hôtels
            </button>
            {hotels.map(hotel => (
              <button key={hotel} onClick={() => setFilterHotel(hotel)}
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                  filterHotel === hotel ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {hotel}
              </button>
            ))}
          </div>
        )}

        {/* Ligne 2 : Groupes (Affiché quand pertinent) */}
        {tab === 'test_review' && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {['all', 'beginner_group', 'intermediate_group', 'sufficient_level_candidate'].map(g => (
                <button key={g} onClick={() => setFilterGroup(g)}
                  className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                    filterGroup === g ? 'bg-brand-dark text-white shadow-sm' : 'bg-brand-light/10 text-brand-dark hover:bg-brand-light/20'
                  }`}>
                  {g === 'all' ? 'Tous niveaux' : GROUP_LABELS[g]}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {['all', 'not_started', 'in_progress', 'completed'].map(statusValue => (
                <button key={statusValue} onClick={() => setFilterTestStatus(statusValue)}
                  className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                    filterTestStatus === statusValue ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}>
                  {statusValue === 'all'
                    ? 'Tous statuts'
                    : statusValue === 'not_started'
                      ? 'Non démarré'
                      : statusValue === 'in_progress'
                        ? 'En cours'
                        : 'Terminés'}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contenu par onglet */}
      {tab === 'learners' && (
        <LearnersTab learners={filtered} evalMap={evalMap} progressMap={progressMap}
          testMap={testMap} oralMap={oralMap} />
      )}
      {tab === 'attendance' && (
        <AttendanceTab learners={filtered} attendance={attendance} />
      )}
      {tab === 'oral' && (
        <OralTab learners={filtered} oralMap={oralMap} />
      )}
      {tab === 'test_review' && (
        <TestReviewTab learners={filtered} testMap={testMap} testResponses={testResponses} />
      )}
    </div>
  )
}

// ── Onglet 1 : Liste apprenants ─────────────────────────────────────

function LearnersTab({ learners, evalMap, progressMap, testMap, oralMap }: {
  learners: Learner[]
  evalMap: Map<string, { avant: number | null; apres: number | null }>
  progressMap: Map<string, AppProgress>
  testMap: Map<string, TestStatus>
  oralMap: Map<string, OralValidation>
}) {
  return (
    <div className="space-y-2">
      {learners.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Aucun apprenant</p>}
      {learners.map(l => {
        const ev = evalMap.get(l.id)
        const prog = progressMap.get(l.id)
        const test = testMap.get(l.id)
        const oral = oralMap.get(l.id)

        const statut = ev?.apres != null
          ? ev.apres >= 30 ? 'vert' : ev.apres >= 15 ? 'orange' : 'rouge'
          : 'nd'

        const statutStyle = {
          vert: 'bg-green-100 text-green-700',
          orange: 'bg-amber-100 text-amber-700',
          rouge: 'bg-red-100 text-red-700',
          nd: 'bg-gray-100 text-gray-400',
        }
        const statutLabel = {
          vert: 'Opérationnel', orange: 'Intermédiaire', rouge: 'À risque', nd: 'Non évalué',
        }

        return (
          <div key={l.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-50 mb-4">
            {/* Ligne 1 : nom + statut */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="font-extrabold text-base text-gray-900 truncate tracking-tight">{l.nom_complet || l.email}</p>
                <p className="text-[13px] font-medium text-gray-400 mt-1">
                  {l.metier_code ? METIER_LABELS[l.metier_code] || l.metier_code : '—'}
                  {l.etablissement ? ` · ${l.etablissement}` : ''}
                </p>
              </div>
              <span className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${statutStyle[statut]}`}>
                {statutLabel[statut]}
              </span>
            </div>

            {/* Ligne 2 : données résumées */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-x-5 gap-y-3 text-[13px] text-gray-500">
              {ev?.avant != null && <span className="font-medium">Avant: <strong className="text-gray-900 ml-1">{ev.avant}/45</strong></span>}
              {ev?.apres != null && <span className="font-medium">Après: <strong className="text-gray-900 ml-1">{ev.apres}/45</strong></span>}
              {prog && <span className="font-medium">App: <strong className="text-brand-mid ml-1">{prog.overall_score}%</strong></span>}
              {test && (
                <span className="font-medium">Test: <strong className="text-brand-dark ml-1">
                  {test.statut === 'completed' ? `${test.score_global}/100` : test.statut === 'in_progress' ? 'En cours' : '—'}
                </strong>
                {test.human_confirmation_required && <span className="text-[10px] bg-rose-50 text-rose-600 font-extrabold px-2 py-0.5 rounded shadow-sm border border-rose-100 ml-2 uppercase">À valider</span>}
                </span>
              )}
              {oral && (
                <span className="font-medium">Oral J1: <strong className="text-gray-900 ml-1">{oral.score_oral}/15</strong>
                  {oral.a_revoir_seance_2 && <span className="text-amber-500 font-bold ml-2">⚡ à revoir</span>}
                </span>
              )}
              {oral?.niveau_confirme && (
                <span className="font-medium">Niveau: <strong className="text-brand-dark ml-1 bg-brand-light/10 px-2 py-0.5 rounded-md">{oral.niveau_confirme}</strong></span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Onglet 2 : Présence ─────────────────────────────────────────────

function AttendanceTab({ learners, attendance }: {
  learners: Learner[]
  attendance: AttendanceRow[]
}) {
  const [editDate, setEditDate] = useState(new Date().toISOString().split('T')[0])
  const [editLabel, setEditLabel] = useState('Jour 1')
  const [saving, setSaving] = useState<string | null>(null)
  const [localAttendance, setLocalAttendance] = useState<Record<string, string>>({})

  // Présences existantes pour cette date
  const dateAttendance = attendance.filter(a => a.session_date === editDate && a.session_label === editLabel)
  const attendanceMap = new Map(dateAttendance.map(a => [a.learner_id, a]))

  function getStatut(learnerId: string): string {
    return localAttendance[learnerId] || attendanceMap.get(learnerId)?.statut || ''
  }

  async function saveAttendance(learnerId: string, statut: string) {
    setSaving(learnerId)
    setLocalAttendance(prev => ({ ...prev, [learnerId]: statut }))

    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learner_id: learnerId,
          session_date: editDate,
          session_label: editLabel,
          statut,
        }),
      })
    } catch {
      // Silencieux — la donnée locale reste affichée
    } finally {
      setSaving(null)
    }
  }

  const statuts = ['present', 'late', 'absent', 'excused'] as const

  return (
    <div>
      {/* Contrôles date/label */}
      <div className="flex gap-2 mb-4">
        <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <select value={editLabel} onChange={e => setEditLabel(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
          <option>Jour 1</option>
          <option>Jour 1 matin</option>
          <option>Jour 1 après-midi</option>
          <option>Jour 2</option>
          <option>Jour 2 matin</option>
          <option>Jour 2 après-midi</option>
          <option>Jour 3</option>
          <option>Jour 4</option>
          <option>Jour 5</option>
        </select>
      </div>

      {/* Résumé rapide */}
      <div className="flex gap-2 mb-3 text-xs">
        {statuts.map(s => {
          const count = learners.filter(l => getStatut(l.id) === s).length
          return count > 0 ? (
            <span key={s} className={`px-2 py-0.5 rounded-full font-semibold ${ATTENDANCE_LABELS[s].color}`}>
              {count} {ATTENDANCE_LABELS[s].label}
            </span>
          ) : null
        })}
      </div>

      {/* Liste */}
      <div className="space-y-1.5">
        {learners.map(l => {
          const current = getStatut(l.id)
          const isSaving = saving === l.id

          return (
            <div key={l.id} className={`bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-50 ${isSaving ? 'opacity-60 scale-[0.98]' : ''} transition-all`}>
              <p className="text-[15px] font-extrabold text-gray-900 mb-3 tracking-tight">{l.nom_complet || l.email}</p>
              <div className="flex gap-2">
                {statuts.map(s => (
                  <button key={s} onClick={() => saveAttendance(l.id, s)} disabled={isSaving}
                    className={`flex-1 py-3 rounded-[1rem] text-[11px] uppercase tracking-wider font-extrabold transition-all outline-none ${
                      current === s
                        ? s === 'present' ? 'bg-brand-mid text-white shadow-md'
                        : s === 'late' ? 'bg-amber-400 text-white shadow-md'
                        : s === 'absent' ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-500 text-white shadow-md'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}>
                    {ATTENDANCE_LABELS[s].label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Onglet 3 : Validation orale J1 ─────────────────────────────────

function OralTab({ learners, oralMap }: {
  learners: Learner[]
  oralMap: Map<string, OralValidation>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [niveauConfirme, setNiveauConfirme] = useState('')
  const [aRevoir, setARevoir] = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [saving, setSaving] = useState(false)

  function openEdit(learnerId: string) {
    const existing = oralMap.get(learnerId)
    const init: Record<string, number> = {}
    for (const c of ORAL_CRITERIA) init[c.key] = (existing?.[c.key as keyof OralValidation] as number) ?? 0
    setScores(init)
    setNiveauConfirme(existing?.niveau_confirme || '')
    setARevoir(existing?.a_revoir_seance_2 || false)
    setCommentaire(existing?.commentaire || '')
    setEditingId(learnerId)
  }

  async function handleSave() {
    if (!editingId) return
    setSaving(true)
    try {
      const res = await fetch('/api/oral-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learner_id: editingId,
          scores,
          niveau_confirme: niveauConfirme || null,
          a_revoir_seance_2: aRevoir,
          commentaire: commentaire || null,
        }),
      })
      if (res.ok) {
        setEditingId(null)
        window.location.reload()
      }
    } finally {
      setSaving(false)
    }
  }

  const liveScore = ORAL_CRITERIA.reduce((s, c) => s + (scores[c.key] ?? 0), 0)

  // Formulaire d'édition
  if (editingId) {
    const learner = learners.find(l => l.id === editingId)
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{learner?.nom_complet || learner?.email}</h3>
            <p className="text-xs text-gray-400">Validation orale — Jour 1</p>
          </div>
          <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:text-gray-600">✕ Fermer</button>
        </div>

        {/* Barème */}
        <div className="flex gap-1.5 mb-4 text-[10px] text-gray-500 flex-wrap">
          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-semibold">0 Incapable</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 font-semibold">1 Partiel</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 font-semibold">2 Fonctionnel</span>
          <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">3 Opérationnel</span>
        </div>

        {/* 5 critères */}
        <div className="space-y-3">
          {ORAL_CRITERIA.map(c => (
            <div key={c.key}>
              <p className="text-xs text-gray-700 mb-1">{c.label}</p>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(v => (
                  <button key={v} onClick={() => setScores(prev => ({ ...prev, [c.key]: v }))}
                    className={`flex-1 py-1.5 rounded text-xs font-semibold border transition-colors ${
                      scores[c.key] === v
                        ? v === 0 ? 'bg-red-500 border-red-500 text-white'
                        : v === 1 ? 'bg-amber-400 border-amber-400 text-white'
                        : v === 2 ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Score live */}
        <div className={`mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-center ${
          liveScore >= 12 ? 'bg-green-100 text-green-700'
          : liveScore >= 6 ? 'bg-amber-100 text-amber-700'
          : 'bg-red-100 text-red-600'
        }`}>
          Score oral : {liveScore}/15
        </div>

        {/* Niveau confirmé */}
        <div className="mt-3">
          <label className="text-xs text-gray-500 mb-1 block">Niveau confirmé</label>
          <select value={niveauConfirme} onChange={e => setNiveauConfirme(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
            <option value="">— Non confirmé —</option>
            <option>A1</option><option>A2</option><option>B1</option>
            <option>B2</option><option>C1</option><option>C2</option>
          </select>
        </div>

        {/* À revoir */}
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={aRevoir} onChange={e => setARevoir(e.target.checked)}
            className="rounded border-gray-300" />
          À revoir séance 2
        </label>

        {/* Commentaire */}
        <textarea placeholder="Commentaire court..." value={commentaire}
          onChange={e => setCommentaire(e.target.value)} rows={2}
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button onClick={() => setEditingId(null)}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    )
  }

  // Liste des apprenants avec statut oral
  return (
    <div className="space-y-2">
      {learners.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Aucun apprenant</p>}
      {learners.map(l => {
        const oral = oralMap.get(l.id)

        return (
          <button key={l.id} onClick={() => openEdit(l.id)}
            className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 text-left transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{l.nom_complet || l.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {l.metier_code ? METIER_LABELS[l.metier_code] || l.metier_code : '—'}
                </p>
              </div>
              {oral ? (
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${
                    oral.score_oral >= 12 ? 'text-green-600' : oral.score_oral >= 6 ? 'text-amber-600' : 'text-red-600'
                  }`}>{oral.score_oral}/15</p>
                  {oral.niveau_confirme && <p className="text-[10px] text-blue-600 font-semibold">{oral.niveau_confirme}</p>}
                  {oral.a_revoir_seance_2 && <p className="text-[10px] text-amber-500">⚡ à revoir</p>}
                </div>
              ) : (
                <span className="text-xs text-gray-300">Non évalué</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Onglet 4 : Revue Test Online ───────────────────────────────────

function TestReviewTab({ learners, testMap, testResponses }: {
  learners: Learner[]
  testMap: Map<string, TestStatus>
  testResponses: TestResponse[]
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [niveauConfirme, setNiveauConfirme] = useState('')
  const [aRevoir, setARevoir] = useState(false)
  const [commentaire, setCommentaire] = useState('')
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Ouvre le mode édition
  function openReview(learnerId: string) {
    const existing = testMap.get(learnerId)
    setNiveauConfirme(existing?.niveau_confirme || existing?.niveau_suggere || '')
    setARevoir(existing?.a_revoir_seance_2 || false)
    setCommentaire(existing?.commentaire || '')
    setEditingId(learnerId)
    setErrorMsg('')
  }

  async function handleConfirm() {
    if (!editingId) return
    if (niveauConfirme === 'sufficient_level_candidate' && !commentaire.trim()) {
      setErrorMsg('Un commentaire est requis pour écarter un profil du parcours.')
      return
    }
    
    setSaving(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/test-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learner_id: editingId,
          niveau_confirme: niveauConfirme,
          a_revoir_seance_2: aRevoir,
          commentaire: commentaire
        }),
      })
      if (res.ok) {
        setEditingId(null)
        window.location.reload()
      } else {
        const errorData = await res.json()
        setErrorMsg(errorData.error || 'Erreur lors de la validation')
      }
    } finally {
      setSaving(false)
    }
  }

  if (editingId) {
    const learner = learners.find(l => l.id === editingId)
    const test = testMap.get(editingId)
    // Cible Supabase Storage: Pour la V1 MVP nous lisons directement depuis Base64 dans la colonne TEXT.
    const audios = testResponses.filter(r => r.learner_id === editingId && r.answer_audio)

    return (
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 z-20 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-brand-dark tracking-tight">{learner?.nom_complet || learner?.email}</h3>
            <p className="text-[13px] font-medium text-gray-500 uppercase tracking-widest mt-1">Revue du Test</p>
          </div>
          <button onClick={() => setEditingId(null)} className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 hover:text-brand-dark bg-gray-50 px-3 py-2 rounded-full hover:bg-brand-light/10 transition-colors">✕ Fermer</button>
        </div>

        <div className="bg-blue-50 text-blue-900 p-3 rounded-lg text-sm font-bold flex justify-between items-center mb-4">
          <span>Score automatisé provisoire :</span>
          <span className="text-xl">{test?.score_global}/100</span>
        </div>

        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
          <p><span className="font-semibold text-gray-900">Hôtel :</span> {learner?.etablissement || test?.candidate_hotel || 'Non renseigné'}</p>
          <p className="mt-1"><span className="font-semibold text-gray-900">Service :</span> {learner?.metier_code ? METIER_LABELS[learner.metier_code] || learner.metier_code : test?.candidate_service || 'Non renseigné'}</p>
          <p className="mt-1"><span className="font-semibold text-gray-900">Téléphone :</span> {test?.candidate_phone || 'Non renseigné'}</p>
          <p className="mt-1"><span className="font-semibold text-gray-900">Email :</span> {test?.candidate_email || learner?.email || 'Non renseigné'}</p>
        </div>

        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Réponses Orales à vérifier</h4>
        {audios.length === 0 ? (
          <p className="text-sm text-gray-400 mb-4 italic">Aucun enregistrement audio pour ce test.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {audios.map((a, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Question: {a.question_id}</p>
                <audio controls src={a.answer_audio} className="w-full h-8" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          <label className="text-xs text-gray-500 mb-1 block">Validation du Niveau Final</label>
          <select value={niveauConfirme} onChange={e => setNiveauConfirme(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 font-semibold mb-2">
            <option value="beginner_group">Débutant</option>
            <option value="intermediate_group">Intermédiaire</option>
            <option value="sufficient_level_candidate">Niveau Suffisant (Hors parcours)</option>
          </select>
          
          {niveauConfirme === 'sufficient_level_candidate' && (
            <p className="text-[10px] text-amber-600 bg-amber-50 rounded p-2 border border-amber-100">
              ⚠️ Ce candidat sera indiqué comme hors parcours.
            </p>
          )}
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={aRevoir} onChange={e => setARevoir(e.target.checked)}
            className="rounded border-gray-300" />
          À revoir séance 2
        </label>

        <textarea placeholder={niveauConfirme === 'sufficient_level_candidate' ? "Commentaire justifiant le niveau suffisant (requis)..." : "Commentaire optionnel..."} 
          value={commentaire}
          onChange={e => setCommentaire(e.target.value)} rows={2}
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />

        {errorMsg && <p className="text-xs text-red-600 mt-2 font-semibold">{errorMsg}</p>}

        <div className="mt-4 flex gap-2">
          <button onClick={() => setEditingId(null)}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button onClick={handleConfirm} disabled={saving}
            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-60">
            {saving ? 'Validation...' : 'Confirmer le niveau officiel'}
          </button>
        </div>
      </div>
    )
  }

  const GROUP_LABELS: Record<string, string> = {
    beginner_group: 'Débutant',
    intermediate_group: 'Intermédiaire',
    sufficient_level_candidate: 'Niveau Suffisant',
  }

  let toReviewCount = 0

  return (
    <div className="space-y-2">
      {learners.map(l => {
        const test = testMap.get(l.id)
        if (!test) return null
        if (test.human_confirmation_required) toReviewCount++

        const displayLevel = test.niveau_confirme || test.niveau_suggere
        const displayLabel = displayLevel ? (GROUP_LABELS[displayLevel] || displayLevel) : '—'

        return (
          <button key={l.id} onClick={() => openReview(l.id)}
            className="w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-50 hover:shadow-lg transition-all text-left outline-none">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-extrabold text-base text-gray-900 truncate tracking-tight">{l.nom_complet || l.email}</p>
                <p className="text-[13px] font-medium text-gray-500 mt-1 tracking-wide">
                  Statut : <span className="font-black text-brand-dark uppercase">{test.statut}</span> • Nv : <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">{displayLabel}</span>
                </p>
                {test.a_revoir_seance_2 && <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500 mt-3 inline-block bg-amber-50 px-2 py-1 rounded-md border border-amber-100">⚡ à revoir S2</p>}
              </div>
              <div className="text-right shrink-0 flex flex-col items-end">
                <p className="text-3xl font-black text-brand-dark tracking-tighter">{test.score_global}<span className="text-base text-brand-mid">/100</span></p>
                {test.human_confirmation_required ? (
                  <p className="text-[10px] uppercase text-rose-500 font-extrabold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full mt-2 tracking-wider shadow-sm">À VALIDER</p>
                ) : (
                  <p className="text-[10px] uppercase text-brand-mid font-extrabold bg-brand-light/10 border border-brand-light/30 px-2.5 py-1 rounded-full mt-2 tracking-wider">✓ Confirmé</p>
                )}
              </div>
            </div>
          </button>
        )
      })}
      {toReviewCount === 0 && learners.some(l => testMap.has(l.id)) && (
        <p className="text-sm text-emerald-600 font-medium text-center py-6 mt-4 opacity-80">
          Tous les tests terminés ont été validés.
        </p>
      )}
      {learners.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Aucun apprenant</p>}
    </div>
  )
}
