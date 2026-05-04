'use client'

import { FormEvent, ReactNode, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { POSITIONING_IMPORT_FIELDS } from '@/lib/positioning/config'
import { PositioningDashboardData } from '@/lib/positioning/dashboard'
import { ImportPreviewRow } from '@/lib/positioning/types'

type ManagerTab = 'overview' | 'import' | 'followup' | 'exports'
type DashboardRow = PositioningDashboardData['rows'][number]
type SendMode = 'send_all' | 'resend_non_started' | 'resend_incomplete' | 'send_selected' | 'mark_sent'

interface PositioningManagerClientProps {
  initialDashboard: PositioningDashboardData
  runtimeNotes: string[]
}

interface ImportPreviewPayload {
  headers: string[]
  availableFields: typeof POSITIONING_IMPORT_FIELDS
  suggestedMapping: Record<string, string>
  mapping: Record<string, string>
  previewRows: ImportPreviewRow[]
  summary: {
    totalRows: number
    validRows: number
    duplicateRows: number
    invalidRows: number
    importableRows: number
  }
}

interface DispatchResult {
  participantId: string
  fullName: string
  status: string
  provider: string
  deliveryUrl?: string
  messageBody?: string
  messageId?: string
  errorMessage?: string
}

function formatText(value: string | null | undefined, fallback = 'Non renseigne') {
  return value && value.trim().length > 0 ? value : fallback
}

function formatScore(value: number | null) {
  return value !== null ? `${value}/100` : 'Non evalue'
}

function formatLevel(value: string | null) {
  return value || 'Non evalue'
}

function formatGroup(value: string | null) {
  return value || 'En attente'
}

function formatInviteStatus(value: string) {
  const labels: Record<string, string> = {
    not_sent: 'Non envoye',
    sent: 'Envoye',
    opened: 'Ouvert',
    started: 'Demarre',
    completed: 'Termine',
    expired: 'Expire',
    in_progress: 'En cours',
    incomplete: 'Incomplet',
    absent: 'Absent',
    non_opened: 'Non ouvert',
    non_started: 'Non demarre',
    prepared: 'Prepare',
    queued: 'En attente',
    failed: 'Echec',
  }
  return labels[value] || value
}

function formatAbsenceLabel(value: DashboardRow['absenceCategory']) {
  const labels: Record<DashboardRow['absenceCategory'], string> = {
    none: 'Aucun',
    not_sent: 'Non envoye',
    non_opened: 'Non ouvert',
    non_started: 'Non demarre',
    incomplete: 'Incomplet',
    absent: 'Absent',
  }
  return labels[value]
}

function formatSectionScore(value: string | undefined) {
  return value || 'Non evalue'
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return 'Jamais'
  return new Date(value).toLocaleString('fr-FR')
}

function getRowStatusLabel(row: DashboardRow) {
  if (row.attemptStatus === 'completed') return 'Termine'
  if (row.absenceCategory === 'incomplete') return 'Incomplet'
  if (row.attemptStatus === 'in_progress' || row.inviteStatus === 'started') return 'Demarre'
  if (row.inviteStatus === 'opened') return 'Ouvert'
  if (row.inviteStatus === 'sent') return 'Envoye'
  if (row.inviteStatus === 'expired') return 'Expire'
  return 'Non envoye'
}

function getMessageStatusLabel(row: DashboardRow) {
  if (!row.latestMessageStatus) return 'Aucun message prepare'
  if (row.latestMessageStatus === 'prepared') {
    return row.latestMessageKind === 'reminder' ? 'Relance preparee' : 'Message prepare'
  }
  return formatInviteStatus(row.latestMessageStatus)
}

function getPrepareModeForRow(row: DashboardRow): Exclude<SendMode, 'send_all' | 'mark_sent'> | null {
  if (row.attemptStatus === 'completed') return null
  if (row.absenceCategory === 'incomplete') return 'resend_incomplete'
  if (row.inviteStatus === 'not_sent') return 'send_selected'
  return 'resend_non_started'
}

function getPrepareLabel(row: DashboardRow) {
  if (row.latestMessageStatus === 'prepared') {
    return row.latestMessageKind === 'reminder' ? 'Regenerer la relance' : 'Regenerer le lien'
  }
  if (row.inviteStatus === 'not_sent') return 'Preparer le lien'
  if (row.absenceCategory === 'incomplete') return 'Preparer la relance'
  return 'Relancer sur WhatsApp'
}

function getMarkLabel(row: DashboardRow) {
  return row.latestMessageKind === 'reminder' || row.inviteStatus !== 'not_sent'
    ? 'Marquer comme relancee'
    : 'Marquer comme envoyee'
}

export default function PositioningManagerClient({
  initialDashboard,
  runtimeNotes,
}: PositioningManagerClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ManagerTab>('overview')
  const [search, setSearch] = useState('')
  const [filterHotel, setFilterHotel] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<ImportPreviewPayload | null>(null)
  const [importBusy, setImportBusy] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)

  const [deadlineAt, setDeadlineAt] = useState('')
  const [dispatchBusy, setDispatchBusy] = useState(false)
  const [dispatchResults, setDispatchResults] = useState<DispatchResult[]>([])
  const [recalcBusy, setRecalcBusy] = useState(false)

  const rows = initialDashboard.rows
  const hasParticipants = rows.length > 0
  const hasCompletedResults = initialDashboard.summary.totalCompleted > 0

  const hotels = useMemo(
    () => Array.from(new Set(rows.map((row) => row.hotel))).sort((a, b) => a.localeCompare(b, 'fr')),
    [rows],
  )
  const levels = useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.levelLabel).filter(Boolean) as string[])).sort((a, b) =>
        a.localeCompare(b, 'fr'),
      ),
    [rows],
  )
  const departments = useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.department).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'fr'),
      ),
    [rows],
  )

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        !search ||
        [row.fullName, row.hotel, row.department, row.organization]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      const matchesHotel = filterHotel === 'all' || row.hotel === filterHotel
      const matchesLevel = filterLevel === 'all' || row.levelLabel === filterLevel
      const matchesStatus =
        filterStatus === 'all' ||
        row.inviteStatus === filterStatus ||
        row.attemptStatus === filterStatus ||
        row.absenceCategory === filterStatus
      const matchesDepartment = filterDepartment === 'all' || row.department === filterDepartment
      return matchesSearch && matchesHotel && matchesLevel && matchesStatus && matchesDepartment
    })
  }, [filterDepartment, filterHotel, filterLevel, filterStatus, rows, search])

  const selectedRow = rows.find((row) => row.participantId === selectedParticipantId) || null
  const followupRows = rows.filter((row) => row.attemptStatus !== 'completed')

  async function handlePreviewImport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedFile) return

    setImportBusy(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      if (importPreview?.mapping) {
        formData.append('mapping', JSON.stringify(importPreview.mapping))
      }

      const response = await fetch('/api/positioning/import', {
        method: 'POST',
        body: formData,
      })
      const payload = (await response.json()) as ImportPreviewPayload & { error?: string }
      if (!response.ok) throw new Error(payload.error || "Impossible d'analyser le fichier.")
      setImportPreview(payload)
    } catch (error) {
      setImportResult(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setImportBusy(false)
    }
  }

  async function handleCommitImport() {
    if (!importPreview) return

    setImportBusy(true)
    setImportResult(null)

    try {
      const response = await fetch('/api/positioning/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: importPreview.previewRows }),
      })
      const payload = (await response.json()) as {
        importedCount?: number
        failedRows?: Array<{ rowNumber: number; error: string }>
        error?: string
      }
      if (!response.ok) throw new Error(payload.error || "Impossible d'importer les participants.")

      setImportPreview(null)
      setSelectedFile(null)
      setImportResult(
        `${payload.importedCount || 0} participant(s) importe(s)${
          payload.failedRows && payload.failedRows.length > 0
            ? ` - ${payload.failedRows.length} ligne(s) en echec`
            : ''
        }`,
      )
      router.refresh()
    } catch (error) {
      setImportResult(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setImportBusy(false)
    }
  }

  async function handleSend(mode: SendMode, participantIds?: string[], participantId?: string, messageId?: string) {
    setDispatchBusy(true)
    try {
      const response = await fetch('/api/positioning/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          participantIds,
          participantId,
          messageId,
          deadlineAt: deadlineAt ? new Date(deadlineAt).toISOString() : null,
        }),
      })
      const payload = (await response.json()) as {
        results?: typeof dispatchResults
        error?: string
      }
      if (!response.ok) throw new Error(payload.error || "Impossible de preparer l'envoi.")
      setDispatchResults(payload.results || [])
      router.refresh()
    } catch (error) {
      setDispatchResults([
        {
          participantId: 'error',
          fullName: 'Erreur systeme',
          provider: 'system',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
        },
      ])
    } finally {
      setDispatchBusy(false)
    }
  }

  async function handlePrepareRow(row: DashboardRow) {
    const mode = getPrepareModeForRow(row)
    if (!mode) return
    await handleSend(mode, [row.participantId])
  }

  async function handleMarkSent(row: DashboardRow) {
    await handleSend('mark_sent', undefined, row.participantId, row.latestMessageId || undefined)
  }

  async function handleRecalculateGroups() {
    setRecalcBusy(true)
    try {
      await fetch('/api/positioning/recalculate-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      router.refresh()
    } finally {
      setRecalcBusy(false)
    }
  }

  async function handleCopy(value: string) {
    await navigator.clipboard.writeText(value)
  }

  const countNotSent = rows.filter((row) => row.inviteStatus === 'not_sent').length
  const countOpened = rows.filter((row) => row.inviteStatus === 'opened' || Boolean(row.openedAt)).length
  const countStarted = rows.filter((row) => row.attemptStatus === 'in_progress' || Boolean(row.startedAt)).length
  const countNonOpened = rows.filter((row) => row.absenceCategory === 'non_opened').length
  const countNonStarted = rows.filter((row) => row.absenceCategory === 'non_started').length
  const countIncomplete = rows.filter((row) => row.absenceCategory === 'incomplete').length
  const countAbsents = rows.filter((row) => row.absenceCategory === 'absent').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Test de positionnement
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Pilotage RH des passations NOOM / SEEN
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Import de la liste, generation des liens individuels, envoi WhatsApp manuel,
              passation mobile et resultats exploitables dans une interface unique.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/manager"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
            >
              Retour manager
            </Link>
            <button
              type="button"
              onClick={handleRecalculateGroups}
              disabled={recalcBusy || !hasParticipants}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {recalcBusy ? 'Recalcul...' : 'Recalculer les groupes'}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          <SummaryCard label="Participants" value={initialDashboard.summary.totalParticipants} />
          <SummaryCard label="Envoyes" value={initialDashboard.summary.totalSent} />
          <SummaryCard label="Ouverts" value={countOpened} />
          <SummaryCard label="Commences" value={countStarted} />
          <SummaryCard label="Termines" value={initialDashboard.summary.totalCompleted} />
          <SummaryCard label="Incomplets" value={countIncomplete} />
          <SummaryCard label="Absents" value={countAbsents} />
          <SummaryCard label="Taux de completion" value={`${initialDashboard.summary.completionRate}%`} />
        </div>
      </section>

      <div className="mt-5 flex flex-wrap gap-2">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Vue synthese
        </TabButton>
        <TabButton active={activeTab === 'import'} onClick={() => setActiveTab('import')}>
          Import participants
        </TabButton>
        <TabButton active={activeTab === 'followup'} onClick={() => setActiveTab('followup')}>
          Relances WhatsApp
        </TabButton>
        <TabButton active={activeTab === 'exports'} onClick={() => setActiveTab('exports')}>
          Exports et journal
        </TabButton>
      </div>

      {(runtimeNotes.length > 0 || !hasParticipants || !hasCompletedResults) && (
        <section className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-900">
            Verifications d'exploitation
          </p>
          <div className="mt-3 space-y-2 text-sm text-amber-900">
            {runtimeNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
            {!hasParticipants && (
              <p>
                Aucun participant importe pour le moment. Commencez par l'onglet import avant tout
                envoi.
              </p>
            )}
            {hasParticipants && !hasCompletedResults && (
              <p>
                Aucun resultat termine disponible a ce stade. Les niveaux et groupes resteront en
                attente tant que les tests ne sont pas soumis.
              </p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'overview' && (
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Resultats et statuts</h2>
                  <p className="text-sm text-gray-500">
                    Filtres manager par hotel, niveau, statut et service.
                  </p>
                </div>
                <div className="rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-gray-200">
                  {filteredRows.length} resultat(s)
                </div>
              </div>

              {hasParticipants ? (
                <>
                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Rechercher un participant"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                    <FilterSelect
                      value={filterHotel}
                      onChange={setFilterHotel}
                      label="Hotel"
                      options={['all', ...hotels]}
                    />
                    <FilterSelect
                      value={filterLevel}
                      onChange={setFilterLevel}
                      label="Niveau"
                      options={['all', ...levels]}
                    />
                    <FilterSelect
                      value={filterDepartment}
                      onChange={setFilterDepartment}
                      label="Service"
                      options={['all', ...departments]}
                    />
                  </div>

                  <div className="mt-3">
                    <FilterSelect
                      value={filterStatus}
                      onChange={setFilterStatus}
                      label="Statut"
                      options={[
                        'all',
                        'not_sent',
                        'sent',
                        'opened',
                        'started',
                        'completed',
                        'expired',
                        'non_opened',
                        'non_started',
                        'incomplete',
                        'absent',
                      ]}
                    />
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-xs uppercase tracking-wide text-gray-400">
                        <tr>
                          <th className="pb-3 pr-4">Participant</th>
                          <th className="pb-3 pr-4">Hotel</th>
                          <th className="pb-3 pr-4">Service</th>
                          <th className="pb-3 pr-4">Statut</th>
                          <th className="pb-3 pr-4">Score</th>
                          <th className="pb-3 pr-4">Niveau</th>
                          <th className="pb-3 pr-4">Groupe</th>
                          <th className="pb-3">Detail</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row) => (
                          <tr key={row.participantId} className="border-t border-gray-100 align-top">
                            <td className="py-3 pr-4">
                              <p className="font-medium text-gray-900">{row.fullName}</p>
                              <p className="text-xs text-gray-500">{formatText(row.organization, 'En attente')}</p>
                            </td>
                            <td className="py-3 pr-4 text-gray-600">{row.hotel}</td>
                            <td className="py-3 pr-4 text-gray-600">
                              {formatText(row.department, 'Service non renseigne')}
                            </td>
                            <td className="py-3 pr-4">
                              <StatusBadge label={getRowStatusLabel(row)} />
                            </td>
                            <td className="py-3 pr-4 font-semibold text-gray-900">{formatScore(row.totalScore)}</td>
                            <td className="py-3 pr-4 text-gray-600">{formatLevel(row.levelLabel)}</td>
                            <td className="py-3 pr-4 text-gray-600">{formatGroup(row.recommendedGroup)}</td>
                            <td className="py-3">
                              <button
                                type="button"
                                onClick={() => setSelectedParticipantId(row.participantId)}
                                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300"
                              >
                                Voir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <EmptyStateCard
                  title="Aucun participant importe"
                  description="Importez la premiere liste pour activer les tableaux, les relances et les exports."
                />
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Groupes recommandes</h2>
                  <p className="text-sm text-gray-500">
                    Regroupements homogenes calcules a partir des resultats completes.
                  </p>
                </div>
                <p className="text-sm text-gray-400">{initialDashboard.groups.length} groupe(s)</p>
              </div>

              {initialDashboard.groups.length === 0 ? (
                <div className="mt-4">
                  <EmptyStateCard
                    title="Aucun groupe disponible"
                    description="Les groupes seront proposes automatiquement des que des tests complets seront disponibles."
                  />
                </div>
              ) : (
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {initialDashboard.groups.map((group) => (
                    <div key={group.groupName} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{group.groupName}</p>
                          <p className="text-sm text-gray-500">{group.level}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                          {group.count} pers.
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        <p>Hotels : {formatBreakdown(group.hotels)}</p>
                        <p className="mt-1">Entites : {formatBreakdown(group.organizations)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Relances rapides</h2>
              <div className="mt-4 grid gap-3">
                <QuickStat label="Non envoyes" value={countNotSent} />
                <QuickStat label="Non ouverts" value={countNonOpened} />
                <QuickStat label="Non demarres" value={countNonStarted} />
                <QuickStat label="Incomplets" value={countIncomplete} />
                <QuickStat label="Absents" value={countAbsents} />
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Detail participant</h2>
              {!selectedRow ? (
                <p className="mt-3 text-sm text-gray-500">
                  Selectionnez une ligne du tableau pour afficher le detail, les sections et le
                  statut de traitement.
                </p>
              ) : (
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-base font-semibold text-gray-900">{selectedRow.fullName}</p>
                    <p className="text-gray-500">
                      {selectedRow.hotel} · {formatText(selectedRow.department)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniInfo label="Telephone" value={formatText(selectedRow.phone)} />
                    <MiniInfo label="Email" value={formatText(selectedRow.email)} />
                    <MiniInfo label="Statut" value={getRowStatusLabel(selectedRow)} />
                    <MiniInfo label="Suivi" value={formatAbsenceLabel(selectedRow.absenceCategory)} />
                    <MiniInfo label="Niveau" value={formatLevel(selectedRow.levelLabel)} />
                    <MiniInfo label="Score" value={formatScore(selectedRow.totalScore)} />
                    <MiniInfo label="Groupe" value={formatGroup(selectedRow.recommendedGroup)} />
                    <MiniInfo label="Dernier message" value={getMessageStatusLabel(selectedRow)} />
                    <MiniInfo label="Derniere action" value={formatDateTime(selectedRow.latestMessageAt)} />
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Envoi WhatsApp
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedRow.latestMessageBody
                        ? 'Le dernier message prepare peut etre rouvert, copie ou confirme comme envoye.'
                        : 'Aucun message prepare pour ce participant.'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getPrepareModeForRow(selectedRow) ? (
                        <button
                          type="button"
                          onClick={() => handlePrepareRow(selectedRow)}
                          disabled={dispatchBusy}
                          className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300 disabled:opacity-60"
                        >
                          {getPrepareLabel(selectedRow)}
                        </button>
                      ) : null}
                      {selectedRow.latestDeliveryUrl ? (
                        <a
                          href={selectedRow.latestDeliveryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Ouvrir WhatsApp
                        </a>
                      ) : null}
                      {selectedRow.latestMessageBody ? (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedRow.latestMessageBody as string)}
                          className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300"
                        >
                          Copier le message
                        </button>
                      ) : null}
                      {selectedRow.latestMessageStatus === 'prepared' ? (
                        <button
                          type="button"
                          onClick={() => handleMarkSent(selectedRow)}
                          disabled={dispatchBusy}
                          className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:border-emerald-300 disabled:opacity-60"
                        >
                          {getMarkLabel(selectedRow)}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Sections
                    </p>
                    <div className="mt-2 space-y-1 text-gray-600">
                      <p>Lecture : {formatSectionScore(selectedRow.sectionScores.reading)}</p>
                      <p>Ecoute : {formatSectionScore(selectedRow.sectionScores.listening)}</p>
                      <p>Vocabulaire : {formatSectionScore(selectedRow.sectionScores.vocabulary)}</p>
                      <p>Situation : {formatAbsenceLabel(selectedRow.absenceCategory)}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,1fr)]">
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Importer des participants</h2>
            <p className="mt-1 text-sm text-gray-500">
              CSV prioritaire, Excel accepte. Validation et detection des doublons avant import
              final.
            </p>

            <form onSubmit={handlePreviewImport} className="mt-4 space-y-4">
              <label className="flex flex-col gap-2 rounded-2xl border border-dashed border-gray-300 p-4">
                <span className="text-sm font-medium text-gray-700">Fichier participants</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  className="text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-semibold file:text-emerald-700"
                />
              </label>

              {importPreview && (
                <div className="grid gap-3 md:grid-cols-2">
                  {POSITIONING_IMPORT_FIELDS.map((field) => (
                    <label key={field.key} className="flex flex-col gap-1 text-sm text-gray-600">
                      <span>
                        {field.label}
                        {field.required ? <span className="text-red-500"> *</span> : null}
                      </span>
                      <select
                        value={importPreview.mapping[field.key] || ''}
                        onChange={(event) =>
                          setImportPreview((current) =>
                            current
                              ? {
                                  ...current,
                                  mapping: {
                                    ...current.mapping,
                                    [field.key]: event.target.value,
                                  },
                                }
                              : current,
                          )
                        }
                        className="rounded-2xl border border-gray-200 px-3 py-3 outline-none focus:border-emerald-500"
                      >
                        <option value="">Non mappe</option>
                        {importPreview.headers.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={!selectedFile || importBusy}
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {importBusy
                    ? 'Analyse...'
                    : importPreview
                      ? 'Recalculer la previsualisation'
                      : 'Previsualiser'}
                </button>
                {importPreview && (
                  <button
                    type="button"
                    onClick={handleCommitImport}
                    disabled={importBusy || importPreview.summary.importableRows === 0}
                    className="rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 disabled:opacity-60"
                  >
                    Importer les lignes valides
                  </button>
                )}
              </div>
            </form>

            {importResult ? (
              <p className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">{importResult}</p>
            ) : null}

            {importPreview ? (
              <div className="mt-5">
                <div className="grid gap-3 sm:grid-cols-4">
                  <SummaryCard label="Lignes" value={importPreview.summary.totalRows} />
                  <SummaryCard label="Importables" value={importPreview.summary.importableRows} />
                  <SummaryCard label="Doublons" value={importPreview.summary.duplicateRows} />
                  <SummaryCard label="Invalides" value={importPreview.summary.invalidRows} />
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-xs uppercase tracking-wide text-gray-400">
                      <tr>
                        <th className="pb-3 pr-4">Ligne</th>
                        <th className="pb-3 pr-4">Participant</th>
                        <th className="pb-3 pr-4">Hotel</th>
                        <th className="pb-3 pr-4">Telephone</th>
                        <th className="pb-3">Controle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.previewRows.slice(0, 15).map((row) => (
                        <tr key={row.rowNumber} className="border-t border-gray-100 align-top">
                          <td className="py-3 pr-4 text-gray-500">{row.rowNumber}</td>
                          <td className="py-3 pr-4">
                            <p className="font-medium text-gray-900">
                              {row.normalized.first_name} {row.normalized.last_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatText(row.normalized.department, 'Service non renseigne')}
                            </p>
                          </td>
                          <td className="py-3 pr-4 text-gray-600">
                            {formatText(row.normalized.hotel)}
                          </td>
                          <td className="py-3 pr-4 text-gray-600">
                            {formatText(row.normalized.phone)}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-2">
                              {row.errors.map((error) => (
                                <Pill key={error} tone="red">
                                  {error}
                                </Pill>
                              ))}
                              {row.duplicateReasons.map((reason) => (
                                <Pill key={reason} tone="amber">
                                  {reason}
                                </Pill>
                              ))}
                              {row.errors.length === 0 && row.duplicateReasons.length === 0 ? (
                                <Pill tone="green">Pret a importer</Pill>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Rappels d'import</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Le fichier doit contenir au minimum hotel, prenom, nom et telephone.</li>
              <li>Le telephone est normalise pour l'usage WhatsApp.</li>
              <li>Les doublons sont controles dans le fichier et contre la base existante.</li>
              <li>Chaque participant valide est cree avec une invitation prete a etre envoyee.</li>
              <li>CSV et Excel reposent sur la meme logique serveur.</li>
            </ul>
          </aside>
        </div>
      )}

      {activeTab === 'followup' && (
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,1fr)]">
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Relances WhatsApp</h2>
            <p className="mt-1 text-sm text-gray-500">
              File manuelle WhatsApp : l'application prepare les liens personnels et les messages,
              puis le manager les ouvre dans wa.me avant de confirmer l'envoi.
            </p>

            {!hasParticipants ? (
              <div className="mt-4">
                <EmptyStateCard
                  title="Aucun participant a relancer"
                  description="Importez des participants avant de preparer les messages WhatsApp."
                />
              </div>
            ) : (
              <>
                <label className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
                  <span>Date limite affichee dans le message</span>
                  <input
                    type="date"
                    value={deadlineAt}
                    onChange={(event) => setDeadlineAt(event.target.value)}
                    className="rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
                  />
                </label>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <ActionCard
                    title="Preparer tous les liens"
                    description="Participants importes encore non envoyes."
                    count={countNotSent}
                    onClick={() => handleSend('send_all')}
                    busy={dispatchBusy}
                  />
                  <ActionCard
                    title="Preparer relances non demarres"
                    description="Liens non ouverts, non demarres ou expires."
                    count={countNonOpened + countNonStarted + countAbsents}
                    onClick={() => handleSend('resend_non_started')}
                    busy={dispatchBusy}
                  />
                  <ActionCard
                    title="Preparer relances incomplets"
                    description="Tests commencés mais non termines."
                    count={countIncomplete}
                    onClick={() => handleSend('resend_incomplete')}
                    busy={dispatchBusy}
                  />
                </div>

                {dispatchResults.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    <p className="font-semibold">Derniere preparation</p>
                    <div className="mt-2 space-y-1">
                      {dispatchResults.map((result) => (
                        <p key={`${result.participantId}-${result.messageId || result.status}`}>
                          {result.fullName} - {formatInviteStatus(result.status)}
                          {result.errorMessage ? ` - ${result.errorMessage}` : ''}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-xs uppercase tracking-wide text-gray-400">
                      <tr>
                        <th className="pb-3 pr-4">Participant</th>
                        <th className="pb-3 pr-4">Statut</th>
                        <th className="pb-3 pr-4">Dernier message</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {followupRows.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="border-t border-gray-100 py-4 text-sm text-gray-500">
                            Tous les participants ont termine leur test. Aucune relance necessaire.
                          </td>
                        </tr>
                      ) : (
                        followupRows.map((row) => (
                          <tr key={row.participantId} className="border-t border-gray-100 align-top">
                            <td className="py-3 pr-4">
                              <p className="font-medium text-gray-900">{row.fullName}</p>
                              <p className="text-xs text-gray-500">
                                {row.hotel} · {formatText(row.department, 'Service non renseigne')}
                              </p>
                            </td>
                            <td className="py-3 pr-4">
                              <StatusBadge label={getRowStatusLabel(row)} />
                              {row.absenceCategory !== 'none' ? (
                                <p className="mt-1 text-xs text-gray-500">
                                  Suivi : {formatAbsenceLabel(row.absenceCategory)}
                                </p>
                              ) : null}
                            </td>
                            <td className="py-3 pr-4 text-gray-600">
                              <p>{getMessageStatusLabel(row)}</p>
                              <p className="mt-1 text-xs text-gray-500">{formatDateTime(row.latestMessageAt)}</p>
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-2">
                                {getPrepareModeForRow(row) ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePrepareRow(row)}
                                    disabled={dispatchBusy}
                                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-300 disabled:opacity-60"
                                  >
                                    {getPrepareLabel(row)}
                                  </button>
                                ) : null}
                                {row.latestDeliveryUrl ? (
                                  <a
                                    href={row.latestDeliveryUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                                  >
                                    Ouvrir WhatsApp
                                  </a>
                                ) : null}
                                {row.latestMessageBody ? (
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(row.latestMessageBody as string)}
                                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700"
                                  >
                                    Copier le message
                                  </button>
                                ) : null}
                                {row.latestMessageStatus === 'prepared' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleMarkSent(row)}
                                    disabled={dispatchBusy}
                                    className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:border-emerald-300 disabled:opacity-60"
                                  >
                                    {getMarkLabel(row)}
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Journal recent</h2>
            {initialDashboard.logs.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                Aucun message journalise pour le moment.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {initialDashboard.logs.slice(0, 12).map((log) => (
                  <div key={log.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-gray-900">{log.provider}</p>
                      <StatusBadge label={formatInviteStatus(log.status)} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{log.destination}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}

      {activeTab === 'exports' && (
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Exports</h2>
            <p className="mt-1 text-sm text-gray-500">
              Exports relies aux donnees reelles du dashboard manager.
            </p>

            {!hasParticipants ? (
              <div className="mt-4">
                <EmptyStateCard
                  title="Aucun export disponible"
                  description="Les exports seront disponibles des que des participants auront ete importes."
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <ExportCard title="Resultats CSV" href="/api/positioning/export?type=results&format=csv" />
                <ExportCard title="Resultats Excel" href="/api/positioning/export?type=results&format=xlsx" />
                <ExportCard title="Synthese CSV" href="/api/positioning/export?type=summary&format=csv" />
                <ExportCard title="Synthese Excel" href="/api/positioning/export?type=summary&format=xlsx" />
                <ExportCard title="Groupes CSV" href="/api/positioning/export?type=groups&format=csv" />
                <ExportCard title="Groupes Excel" href="/api/positioning/export?type=groups&format=xlsx" />
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Absents et incomplets</h2>
            {!hasParticipants ? (
              <p className="mt-3 text-sm text-gray-500">
                Aucun participant importe pour le moment.
              </p>
            ) : rows.filter((row) => ['absent', 'non_started', 'incomplete'].includes(row.absenceCategory)).length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                Aucune relance necessaire a ce stade.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {rows
                  .filter((row) => ['absent', 'non_started', 'incomplete'].includes(row.absenceCategory))
                  .map((row) => (
                    <div key={row.participantId} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{row.fullName}</p>
                          <p className="text-xs text-gray-500">
                            {row.hotel} · {formatText(row.department)}
                          </p>
                        </div>
                        <Pill tone={row.absenceCategory === 'incomplete' ? 'amber' : 'red'}>
                          {formatAbsenceLabel(row.absenceCategory)}
                        </Pill>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-gray-800">{value}</p>
    </div>
  )
}

function StatusBadge({ label }: { label: string }) {
  const tone =
    label === 'Termine' || label === 'completed'
      ? 'bg-emerald-50 text-emerald-700'
      : label === 'En cours' || label === 'Demarre' || label === 'Ouvert' || label === 'Incomplet'
        ? 'bg-amber-50 text-amber-700'
      : label === 'Echec' || label === 'Expire'
          ? 'bg-red-50 text-red-700'
          : 'bg-gray-100 text-gray-600'

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label}</span>
}

function Pill({ children, tone }: { children: ReactNode; tone: 'red' | 'amber' | 'green' }) {
  const className =
    tone === 'red'
      ? 'bg-red-50 text-red-700'
      : tone === 'amber'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-emerald-50 text-emerald-700'

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-600">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'all' ? 'Tous' : formatInviteStatus(option)}
          </option>
        ))}
      </select>
    </label>
  )
}

function ActionCard({
  title,
  description,
  count,
  onClick,
  busy,
}: {
  title: string
  description: string
  count: number
  onClick: () => void
  busy: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || count === 0}
      className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-emerald-200 disabled:opacity-60"
    >
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <p className="mt-3 text-2xl font-bold text-emerald-700">{count}</p>
    </button>
  )
}

function ExportCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:text-emerald-700"
    >
      {title}
    </a>
  )
}

function EmptyStateCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  )
}

function formatBreakdown(values: Record<string, number>) {
  const entries = Object.entries(values)
  if (entries.length === 0) return 'Donnee non disponible'
  return entries.map(([label, count]) => `${label} (${count})`).join(', ')
}
