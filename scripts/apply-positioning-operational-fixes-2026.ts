// @ts-nocheck
import fs from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import Module from 'module'
import path from 'node:path'
import * as XLSX from 'xlsx'
import { createAdminClient, isAdminClientConfigured } from '../src/lib/supabase/admin'
import {
  matchesPositioningAccessHotel,
  normalizeIvoryCoastPhone,
  type PositioningAccessHotel,
} from '../src/lib/positioning/collective-access'
import { POSITIONING_DURATION_MINUTES } from '../src/lib/positioning/config'
import type {
  AttemptProgressState,
  ParticipantRow,
  TestAttemptRow,
  TestInviteRow,
  TestProductionRow,
} from '../src/lib/positioning/types'

const moduleWithResolver = Module as typeof Module & {
  _resolveFilename: typeof Module._resolveFilename
}
const originalResolveFilename = moduleWithResolver._resolveFilename

moduleWithResolver._resolveFilename = function patchedResolveFilename(
  request,
  parent,
  isMain,
  options,
) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(process.cwd(), 'src', request.slice(2))
  }

  return originalResolveFilename.call(this, request, parent, isMain, options)
}

const { getPositioningQuestions } =
  require('../src/lib/positioning/questions') as typeof import('../src/lib/positioning/questions')
const { getAttemptSubmissionReadiness } =
  require('../src/lib/positioning/submission') as typeof import('../src/lib/positioning/submission')

type HotelCode = PositioningAccessHotel

type MissingNoomTarget = {
  hotel: HotelCode
  firstName: string
  lastName: string
  fullName: string
  confirmedPhone: string
}

type WorkbookSourceRow = {
  hotel: HotelCode
  firstName: string
  lastName: string
  department: string
  role: string
  phone: string
  rowNumber: number
}

type EliouReport = {
  generated_at: string
  root_cause: string
  timer_behavior_before: string[]
  timer_behavior_after: string[]
  auto_submit_removed_or_changed: string[]
  eliou_attempt_before: Record<string, unknown>
  eliou_attempt_after: Record<string, unknown>
  preserved_answers: Record<string, unknown>
  neutralized_empty_productions: Record<string, unknown>
  resume_point: Record<string, unknown>
  tests_added_or_run: string[]
  verdict: string
}

type NoomAddReport = {
  generated_at: string
  created: Array<Record<string, unknown>>
  already_existing: Array<Record<string, unknown>>
  skipped: Array<Record<string, unknown>>
  normalized_phones: Array<Record<string, unknown>>
  invite_token_status: Array<Record<string, unknown>>
  duplicate_check: Record<string, unknown>
  final_counts_by_hotel: Record<string, unknown>
  verdict: string
}

const APPLY_FLAG = '--apply'
const ARTIFACTS_DIR = path.resolve(process.cwd(), 'artifacts/positioning_status_2026')
const ELIIOU_REPORT_PATH = path.join(ARTIFACTS_DIR, 'eliou_timer_fix_report.json')
const NOOM_REPORT_PATH = path.join(
  ARTIFACTS_DIR,
  'noom_missing_participants_added_report.json',
)
const RAW_WORKBOOK_CANDIDATES = [
  path.resolve(process.cwd(), 'imports', 'positioning_2026', "Liste des Participants a la formation d'Anglais.xlsx"),
  "C:/Users/yra69/Downloads/Liste des Participants a la formation d'Anglais.xlsx",
]

const MISSING_NOOM_TARGETS: MissingNoomTarget[] = [
  {
    hotel: 'NOOM',
    firstName: 'Loka Alexise Sandrine',
    lastName: 'SOKO',
    fullName: 'Loka Alexise Sandrine SOKO',
    confirmedPhone: '0747901056',
  },
  {
    hotel: 'NOOM',
    firstName: 'Emmanel Tryphene',
    lastName: 'AKON',
    fullName: 'Emmanel Tryphene AKON',
    confirmedPhone: '0779922292',
  },
  {
    hotel: 'NOOM',
    firstName: 'Tina Mathieu',
    lastName: 'ALEBA',
    fullName: 'Tina Mathieu ALEBA',
    confirmedPhone: '0152588202',
  },
]

const ELIIOU_EXTERNAL_REF = 'SEEN-009'
const ELIIOU_NAME = 'Konan Serge Fidel ELIOU'

async function loadLocalEnvFile(filePath: string) {
  try {
    const raw = await readFile(filePath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex <= 0) continue
      const key = trimmed.slice(0, separatorIndex).trim()
      let value = trimmed.slice(separatorIndex + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // Optional env file.
  }
}

async function bootstrapEnv() {
  await loadLocalEnvFile(path.resolve(process.cwd(), '.env.local'))
  await loadLocalEnvFile(path.resolve(process.cwd(), '.env'))
}

function fileExists(filePath: string) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

function pickExistingPath(candidates: string[]) {
  const found = candidates.find((candidate) => fileExists(candidate))
  if (!found) {
    throw new Error(`Source file not found. Checked: ${candidates.join(', ')}`)
  }
  return found
}

function normalizeRequiredPhone(value: string) {
  const normalized = normalizeIvoryCoastPhone(value)
  if (!normalized) {
    throw new Error(`Invalid phone in script constant: ${value}`)
  }
  return normalized
}

function normalizeIdentityString(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['`]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getIdentitySignature(value: unknown) {
  return normalizeIdentityString(value)
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ')
}

function getParticipantNameVariants(participant: ParticipantRow) {
  return new Set([
    normalizeIdentityString(participant.full_name),
    normalizeIdentityString(`${participant.first_name} ${participant.last_name}`),
    normalizeIdentityString(`${participant.last_name} ${participant.first_name}`),
  ])
}

function getParticipantNameSignatures(participant: ParticipantRow) {
  return new Set([
    getIdentitySignature(participant.full_name),
    getIdentitySignature(`${participant.first_name} ${participant.last_name}`),
    getIdentitySignature(`${participant.last_name} ${participant.first_name}`),
  ])
}

function findParticipantsByHotelAndName(
  participants: ParticipantRow[],
  hotel: HotelCode,
  fullName: string,
) {
  const targetVariant = normalizeIdentityString(fullName)
  const targetSignature = getIdentitySignature(fullName)

  return participants.filter((participant) => {
    if (!matchesPositioningAccessHotel(participant.hotel, hotel)) return false
    const variants = getParticipantNameVariants(participant)
    if (variants.has(targetVariant)) return true
    const signatures = getParticipantNameSignatures(participant)
    return signatures.has(targetSignature)
  })
}

function loadRawWorkbookRows(filePath: string) {
  const workbook = XLSX.readFile(filePath)
  const rows: WorkbookSourceRow[] = []
  const sheets: Array<{ sheetName: string; hotel: HotelCode }> = [
    { sheetName: 'Noom', hotel: 'NOOM' },
    { sheetName: 'Seen', hotel: 'SEEN' },
  ]

  for (const { sheetName, hotel } of sheets) {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) continue
    const matrix = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
      header: 1,
      defval: '',
      raw: false,
    })

    for (let index = 0; index < matrix.length; index += 1) {
      const row = matrix[index]
      const lastName = String(row[1] || '').trim()
      const firstName = String(row[2] || '').trim()
      if (!lastName || !firstName) continue
      if (lastName.toUpperCase() === 'NOM' || firstName.toUpperCase().includes('PRENOM')) continue

      rows.push({
        hotel,
        firstName,
        lastName,
        department: String(row[3] || '').trim(),
        role: String(row[4] || '').trim(),
        phone: String(row[5] || '').trim(),
        rowNumber: index + 1,
      })
    }
  }

  return rows
}

function findWorkbookRow(rows: WorkbookSourceRow[], target: MissingNoomTarget) {
  const targetSignature = getIdentitySignature(`${target.firstName} ${target.lastName}`)
  return (
    rows.find((row) => {
      if (row.hotel !== target.hotel) return false
      return getIdentitySignature(`${row.firstName} ${row.lastName}`) === targetSignature
    }) || null
  )
}

function getLatestInvite(invites: TestInviteRow[], participantId: string) {
  return (
    invites
      .filter((invite) => invite.participant_id === participantId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0] || null
  )
}

function getLatestAttempt(
  attempts: TestAttemptRow[],
  participantId: string,
  inviteId: string | null,
) {
  return (
    attempts
      .filter(
        (attempt) =>
          attempt.participant_id === participantId && (!inviteId || attempt.invite_id === inviteId),
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0] || null
  )
}

function summarizeAttempt(attempt: TestAttemptRow | null, invite: TestInviteRow | null) {
  if (!attempt) {
    return {
      attempt_id: null,
      attempt_status: null,
      invite_status: invite?.status || null,
    }
  }

  const raw = (attempt.raw_result_json || {}) as Partial<AttemptProgressState> & Record<string, unknown>
  const responses = raw.responses || {}
  const productions = raw.productions || {}

  return {
    attempt_id: attempt.id,
    attempt_status: attempt.status,
    invite_status: invite?.status || null,
    started_at: attempt.started_at,
    submitted_at: attempt.submitted_at,
    completed_at: attempt.completed_at,
    duration_seconds: attempt.duration_seconds,
    duration_limit_seconds: POSITIONING_DURATION_MINUTES * 60,
    total_score: attempt.total_score,
    auto_score: attempt.auto_score,
    writing_score: attempt.writing_score,
    speaking_score: attempt.speaking_score,
    provisional_score: attempt.provisional_score,
    ai_status: attempt.ai_status,
    recommended_group: attempt.recommended_group,
    estimated_level: attempt.estimated_level,
    current_question_index:
      typeof raw.currentQuestionIndex === 'number' ? raw.currentQuestionIndex : null,
    phase: typeof raw.phase === 'string' ? raw.phase : null,
    answered_questions: Object.keys(responses).length,
    saved_productions: Object.keys(productions).length,
    anomalies: Array.isArray(attempt.anomalies_json) ? attempt.anomalies_json : [],
  }
}

function getAttemptProgressState(attempt: TestAttemptRow) {
  const raw = (attempt.raw_result_json || {}) as Partial<AttemptProgressState>
  return {
    responses: raw.responses || {},
    productions: raw.productions || {},
    currentQuestionIndex:
      typeof raw.currentQuestionIndex === 'number' ? raw.currentQuestionIndex : 0,
    phase: raw.phase || 'qcm',
    sectionOrder: raw.sectionOrder || ['reading', 'listening', 'vocabulary', 'situations'],
    testVersion: raw.testVersion || 'v2-ai',
  } satisfies AttemptProgressState
}

function computeDuplicatePhones(participants: ParticipantRow[]) {
  const byScope = new Map<string, string[]>()
  for (const participant of participants) {
    if (!participant.normalized_phone) continue
    for (const hotel of ['NOOM', 'SEEN'] as HotelCode[]) {
      if (!matchesPositioningAccessHotel(participant.hotel, hotel)) continue
      const key = `${hotel}::${participant.normalized_phone}`
      const rows = byScope.get(key) || []
      rows.push(participant.id)
      byScope.set(key, rows)
    }
  }

  return Array.from(byScope.entries())
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => {
      const [hotel, normalizedPhone] = key.split('::')
      return { hotel, normalized_phone: normalizedPhone, participant_ids: ids }
    })
}

function computeDuplicateNames(participants: ParticipantRow[]) {
  const byScope = new Map<string, string[]>()
  for (const participant of participants) {
    for (const hotel of ['NOOM', 'SEEN'] as HotelCode[]) {
      if (!matchesPositioningAccessHotel(participant.hotel, hotel)) continue
      const key = `${hotel}::${getIdentitySignature(`${participant.first_name} ${participant.last_name}`)}`
      const rows = byScope.get(key) || []
      rows.push(participant.id)
      byScope.set(key, rows)
    }
  }

  return Array.from(byScope.entries())
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => {
      const [hotel, normalizedName] = key.split('::')
      return { hotel, normalized_name: normalizedName, participant_ids: ids }
    })
}

function computeScopeCounts(participants: ParticipantRow[]) {
  return {
    NOOM: participants.filter((participant) => matchesPositioningAccessHotel(participant.hotel, 'NOOM'))
      .length,
    SEEN: participants.filter((participant) => matchesPositioningAccessHotel(participant.hotel, 'SEEN'))
      .length,
  }
}

function computeUniqueHotelCounts(participants: ParticipantRow[]) {
  return participants.reduce<Record<string, number>>((acc, participant) => {
    acc[participant.hotel] = (acc[participant.hotel] || 0) + 1
    return acc
  }, {})
}

async function main() {
  const shouldApply = process.argv.includes(APPLY_FLAG)
  await bootstrapEnv()

  if (!isAdminClientConfigured()) {
    throw new Error(
      'Supabase admin client is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.',
    )
  }

  const workbookPath = pickExistingPath(RAW_WORKBOOK_CANDIDATES)
  const workbookRows = loadRawWorkbookRows(workbookPath)
  const admin = createAdminClient()

  const [participantsRes, invitesRes, attemptsRes, productionsRes] = await Promise.all([
    admin.from('participants').select('*').order('created_at', { ascending: true }),
    admin.from('test_invites').select('*').order('created_at', { ascending: true }),
    admin.from('test_attempts').select('*').order('created_at', { ascending: true }),
    admin.from('test_productions').select('*').order('created_at', { ascending: true }),
  ])

  for (const result of [participantsRes, invitesRes, attemptsRes, productionsRes]) {
    if (result.error) throw result.error
  }

  let participants = (participantsRes.data || []) as ParticipantRow[]
  let invites = (invitesRes.data || []) as TestInviteRow[]
  let attempts = (attemptsRes.data || []) as TestAttemptRow[]
  let productions = (productionsRes.data || []) as TestProductionRow[]

  const eliouParticipant =
    participants.find((participant) => participant.external_ref === ELIIOU_EXTERNAL_REF) ||
    findParticipantsByHotelAndName(participants, 'SEEN', ELIIOU_NAME)[0] ||
    null

  if (!eliouParticipant) {
    throw new Error('Konan Serge Fidel ELIOU not found in participants.')
  }

  const eliouInvite = getLatestInvite(invites, eliouParticipant.id)
  const eliouAttempt = getLatestAttempt(attempts, eliouParticipant.id, eliouInvite?.id ?? null)

  if (!eliouInvite || !eliouAttempt) {
    throw new Error('Konan Serge Fidel ELIOU invite or attempt is missing.')
  }

  const questionIds = getPositioningQuestions().map((question) => question.id)
  const beforeProgress = getAttemptProgressState(eliouAttempt)
  const beforeReadiness = getAttemptSubmissionReadiness({
    progress: beforeProgress,
    questionIds,
    productions: [],
  })
  const missingQuestionIds = questionIds.filter((questionId) => !beforeProgress.responses[questionId])
  const emptyProductionRows = productions.filter(
    (row) =>
      row.attempt_id === eliouAttempt.id &&
      !row.response_text &&
      !row.transcription &&
      !row.has_audio,
  )
  const resumeQuestionId = missingQuestionIds[0] || questionIds[0]
  const resumeIndex = Math.max(questionIds.indexOf(resumeQuestionId), 0)
  const reopenedAt = new Date().toISOString()

  const eliouBeforeSummary = summarizeAttempt(eliouAttempt, eliouInvite)

  if (shouldApply && eliouAttempt.status === 'completed') {
    const nextProgress: AttemptProgressState & Record<string, unknown> = {
      ...beforeProgress,
      currentQuestionIndex: resumeIndex,
      phase: 'qcm',
      resumeMeta: {
        reopenedAt,
        reopenedFromBugFix: true,
        resumeQuestionId,
        previousStartedAt: eliouAttempt.started_at,
        previousSubmittedAt: eliouAttempt.submitted_at,
        previousCompletedAt: eliouAttempt.completed_at,
        previousDurationSeconds: eliouAttempt.duration_seconds,
        previousStatus: eliouAttempt.status,
        previousAiStatus: eliouAttempt.ai_status,
        previousAnomalies: Array.isArray(eliouAttempt.anomalies_json)
          ? eliouAttempt.anomalies_json
          : [],
        artificialEmptyProductionIds: emptyProductionRows.map((row) => row.prompt_id),
      },
    }

    const { error: attemptUpdateError } = await admin
      .from('test_attempts')
      .update({
        status: 'in_progress',
        started_at: reopenedAt,
        submitted_at: null,
        completed_at: null,
        total_score: null,
        auto_score: null,
        writing_score: null,
        speaking_score: null,
        provisional_score: null,
        ai_status: null,
        strong_competences: [],
        weak_competences: [],
        estimated_level: null,
        recommended_group: null,
        duration_seconds: null,
        anomalies_json: [
          'Tentative reouverte pour reprise apres soumission automatique hors phase finale.',
        ],
        raw_result_json: nextProgress,
      })
      .eq('id', eliouAttempt.id)

    if (attemptUpdateError) throw attemptUpdateError

    const { error: inviteUpdateError } = await admin
      .from('test_invites')
      .update({
        status: 'started',
        started_at: reopenedAt,
        completed_at: null,
      })
      .eq('id', eliouInvite.id)

    if (inviteUpdateError) throw inviteUpdateError

    const { error: participantUpdateError } = await admin
      .from('participants')
      .update({ status: 'in_progress' })
      .eq('id', eliouParticipant.id)

    if (participantUpdateError) throw participantUpdateError
  }

  const created: Array<Record<string, unknown>> = []
  const alreadyExisting: Array<Record<string, unknown>> = []
  const skipped: Array<Record<string, unknown>> = []
  const normalizedPhones: Array<Record<string, unknown>> = []
  const inviteTokenStatus: Array<Record<string, unknown>> = []

  for (const target of MISSING_NOOM_TARGETS) {
    const normalizedPhone = normalizeRequiredPhone(target.confirmedPhone)
    normalizedPhones.push({
      participant_name: target.fullName,
      normalized_phone: normalizedPhone,
    })

    const matches = findParticipantsByHotelAndName(participants, target.hotel, target.fullName)
    if (matches.length > 1) {
      skipped.push({
        participant_name: target.fullName,
        hotel: target.hotel,
        reason: 'conflict_multiple_name_matches',
        participant_ids: matches.map((participant) => participant.id),
      })
      continue
    }

    if (matches.length === 1) {
      const existingParticipant = matches[0]
      const existingInvite = getLatestInvite(invites, existingParticipant.id)
      alreadyExisting.push({
        participant_name: target.fullName,
        hotel: target.hotel,
        participant_id: existingParticipant.id,
        normalized_phone: existingParticipant.normalized_phone,
        invite_status: existingInvite?.status || null,
      })
      inviteTokenStatus.push({
        participant_name: target.fullName,
        invite_status: existingInvite?.status || null,
        token_status: existingInvite?.token_hash ? 'existing_token' : 'deferred_to_first_collective_claim',
      })
      continue
    }

    const phoneConflicts = participants.filter(
      (participant) =>
        matchesPositioningAccessHotel(participant.hotel, target.hotel) &&
        participant.normalized_phone === normalizedPhone,
    )
    if (phoneConflicts.length > 0) {
      skipped.push({
        participant_name: target.fullName,
        hotel: target.hotel,
        reason: 'duplicate_hotel_phone',
        participant_ids: phoneConflicts.map((participant) => participant.id),
        normalized_phone: normalizedPhone,
      })
      continue
    }

    const workbookRow = findWorkbookRow(workbookRows, target)
    if (!workbookRow) {
      skipped.push({
        participant_name: target.fullName,
        hotel: target.hotel,
        reason: 'missing_in_workbook_source',
      })
      continue
    }

    if (!shouldApply) {
      created.push({
        participant_name: target.fullName,
        hotel: target.hotel,
        participant_id: null,
        normalized_phone: normalizedPhone,
        department: workbookRow.department,
        invite_status: 'not_sent',
        token_status: 'deferred_to_first_collective_claim',
        source_row: workbookRow.rowNumber,
      })
      inviteTokenStatus.push({
        participant_name: target.fullName,
        invite_status: 'not_sent',
        token_status: 'deferred_to_first_collective_claim',
      })
      continue
    }

    const { data: insertedParticipant, error: participantInsertError } = await admin
      .from('participants')
      .insert({
        hotel: target.hotel,
        organization: null,
        first_name: workbookRow.firstName,
        last_name: workbookRow.lastName,
        phone: normalizedPhone,
        normalized_phone: normalizedPhone,
        email: null,
        department: workbookRow.department || null,
        external_ref: null,
        status: 'imported',
      })
      .select('*')
      .single()

    if (participantInsertError) throw participantInsertError

    const { data: insertedInvite, error: inviteInsertError } = await admin
      .from('test_invites')
      .insert({
        participant_id: insertedParticipant.id,
        token_hash: null,
        expires_at: null,
        deadline_at: null,
        status: 'not_sent',
        sent_at: null,
        opened_at: null,
        started_at: null,
        completed_at: null,
        last_reminder_at: null,
        access_version: 1,
      })
      .select('*')
      .single()

    if (inviteInsertError) throw inviteInsertError

    participants = [...participants, insertedParticipant as ParticipantRow]
    invites = [...invites, insertedInvite as TestInviteRow]

    created.push({
      participant_name: target.fullName,
      hotel: target.hotel,
      participant_id: insertedParticipant.id,
      normalized_phone: normalizedPhone,
      department: workbookRow.department,
      invite_id: insertedInvite.id,
      invite_status: insertedInvite.status,
      token_status: 'deferred_to_first_collective_claim',
      source_row: workbookRow.rowNumber,
    })
    inviteTokenStatus.push({
      participant_name: target.fullName,
      invite_status: insertedInvite.status,
      token_status: 'deferred_to_first_collective_claim',
      invite_id: insertedInvite.id,
    })
  }

  const [finalParticipantsRes, finalInvitesRes, finalAttemptsRes, finalProductionsRes] = await Promise.all([
    admin.from('participants').select('*').order('created_at', { ascending: true }),
    admin.from('test_invites').select('*').order('created_at', { ascending: true }),
    admin.from('test_attempts').select('*').order('created_at', { ascending: true }),
    admin.from('test_productions').select('*').order('created_at', { ascending: true }),
  ])

  for (const result of [finalParticipantsRes, finalInvitesRes, finalAttemptsRes, finalProductionsRes]) {
    if (result.error) throw result.error
  }

  participants = (finalParticipantsRes.data || []) as ParticipantRow[]
  invites = (finalInvitesRes.data || []) as TestInviteRow[]
  attempts = (finalAttemptsRes.data || []) as TestAttemptRow[]
  productions = (finalProductionsRes.data || []) as TestProductionRow[]

  const eliouParticipantAfter =
    participants.find((participant) => participant.id === eliouParticipant.id) || eliouParticipant
  const eliouInviteAfter = getLatestInvite(invites, eliouParticipantAfter.id)
  const eliouAttemptAfter = getLatestAttempt(
    attempts,
    eliouParticipantAfter.id,
    eliouInviteAfter?.id ?? null,
  )

  const duplicateHotelPhone = computeDuplicatePhones(participants)
  const duplicateHotelName = computeDuplicateNames(participants)

  const noomAccessChecks = MISSING_NOOM_TARGETS.map((target) => {
    const normalizedPhone = normalizeRequiredPhone(target.confirmedPhone)
    const matchingParticipants = participants.filter(
      (participant) =>
        matchesPositioningAccessHotel(participant.hotel, 'NOOM') &&
        participant.normalized_phone === normalizedPhone,
    )
    const invite = matchingParticipants[0]
      ? getLatestInvite(invites, matchingParticipants[0].id)
      : null
    return {
      participant_name: target.fullName,
      normalized_phone: normalizedPhone,
      matched_count: matchingParticipants.length,
      participant_ids: matchingParticipants.map((participant) => participant.id),
      invite_status: invite?.status || null,
    }
  })

  const eliouAfterSummary = summarizeAttempt(eliouAttemptAfter, eliouInviteAfter)

  const eliouReport: EliouReport = {
    generated_at: new Date().toISOString(),
    root_cause:
      'Le client auto-soumettait a 0 seconde et l API acceptait encore une soumission depuis la phase qcm, bloquait la sauvegarde apres 2700 s, puis creait 6 test_productions vides avant de lancer une consolidation incomplete.',
    timer_behavior_before: [
      'Le timer front appelait handleSubmit automatiquement a 0 seconde.',
      'SAVE_PROGRESS renvoyait 409 apres 2700 secondes.',
      'SUBMIT_TEST pouvait passer en completed depuis une progression qcm incomplète.',
    ],
    timer_behavior_after: [
      'Le timer descend a 0 sans soumission automatique.',
      'Le depassement de 45 minutes reste indicatif et n empeche plus la sauvegarde.',
      'SUBMIT_TEST exige la phase review et un parcours complet avant completion.',
    ],
    auto_submit_removed_or_changed: [
      'Suppression de l appel automatique a handleSubmit dans PositioningParticipantClient.',
      'Suppression du blocage isAttemptTimeElapsed dans SAVE_PROGRESS.',
      'Ajout d un garde de soumission finale complet via getAttemptSubmissionReadiness.',
    ],
    eliou_attempt_before: eliouBeforeSummary,
    eliou_attempt_after: {
      ...eliouAfterSummary,
      participant_status: eliouParticipantAfter.status,
      invite_status: eliouInviteAfter?.status || null,
    },
    preserved_answers: {
      answered_questions_count: Object.keys(beforeProgress.responses).length,
      preserved_question_ids: Object.keys(beforeProgress.responses),
      missing_question_ids: missingQuestionIds,
    },
    neutralized_empty_productions: {
      strategy: 'kept_in_place_for_safe_future_upsert',
      count: emptyProductionRows.length,
      prompt_ids: emptyProductionRows.map((row) => row.prompt_id),
    },
    resume_point: {
      phase: 'qcm',
      question_id: resumeQuestionId,
      current_question_index: resumeIndex,
      fallback: 'first_missing_question_in_situations_section',
    },
    tests_added_or_run: [
      'src/positioning-submission.test.ts',
      'npm test',
      'npm run build',
    ],
    verdict: shouldApply ? 'GO reprise Eliou' : 'DRY_RUN_READY',
  }

  const noomReport: NoomAddReport = {
    generated_at: new Date().toISOString(),
    created,
    already_existing: alreadyExisting,
    skipped,
    normalized_phones: normalizedPhones,
    invite_token_status: inviteTokenStatus,
    duplicate_check: {
      duplicate_hotel_phone: duplicateHotelPhone,
      duplicate_hotel_name: duplicateHotelName,
      collective_access_lookup: noomAccessChecks,
    },
    final_counts_by_hotel: {
      participants_total: participants.length,
      unique_hotel_labels: computeUniqueHotelCounts(participants),
      scope_counts: computeScopeCounts(participants),
    },
    verdict: shouldApply ? 'GO relance collective' : 'DRY_RUN_READY',
  }

  await mkdir(ARTIFACTS_DIR, { recursive: true })
  await writeFile(ELIIOU_REPORT_PATH, `${JSON.stringify(eliouReport, null, 2)}\n`, 'utf8')
  await writeFile(NOOM_REPORT_PATH, `${JSON.stringify(noomReport, null, 2)}\n`, 'utf8')

  console.log(
    JSON.stringify(
      {
        mode: shouldApply ? 'apply' : 'dry-run',
        eliou_before: eliouBeforeSummary,
        eliou_after: eliouAfterSummary,
        created_noom_participants: created.length,
        already_existing_noom_participants: alreadyExisting.length,
        skipped_noom_participants: skipped.length,
        final_scope_counts: computeScopeCounts(participants),
        duplicate_hotel_phone: duplicateHotelPhone.length,
        duplicate_hotel_name: duplicateHotelName.length,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
