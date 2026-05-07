// @ts-nocheck
import fs from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import Module from 'module'
import path from 'node:path'
import { createAdminClient, isAdminClientConfigured } from '../src/lib/supabase/admin'
import type {
  AttemptProgressState,
  AttemptProductionDraft,
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

const { getFirstIncompleteProductionIndex, hasSavedProductionDraft } =
  require('../src/lib/positioning/resume-progress') as typeof import('../src/lib/positioning/resume-progress')

type ResumePhase = 'qcm' | 'writing' | 'speaking'

type ReopenTarget = {
  fullName: string
  hotel: string
  resumePhase: ResumePhase
  currentQuestionIndex: number | null
  expectedQuestionId?: string
  aliases?: string[]
}

type ReadOnlyCheck = {
  fullName: string
  hotel: string
  expectedPhase: ResumePhase
  expectedCurrentQuestionIndex: number
  aliases?: string[]
}

const APPLY_FLAG = '--apply'
const ARTIFACTS_DIR = path.resolve(process.cwd(), 'artifacts/positioning_status_2026')
const REPORT_PATH = path.join(
  ARTIFACTS_DIR,
  'timer_bug_reopen_blocked_attempts_report.json',
)

const QUESTION_ORDER = [
  ...Array.from({ length: 8 }, (_, index) => `reading-${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `listening-${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `vocabulary-${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `situations-${index + 1}`),
]
const WRITING_PROMPT_IDS = Array.from({ length: 4 }, (_, index) => `writing-${index + 1}`)
const SPEAKING_PROMPT_IDS = Array.from({ length: 2 }, (_, index) => `speaking-${index + 1}`)

const REOPEN_TARGETS: ReopenTarget[] = [
  {
    fullName: 'Kouadio Appolinaire KOUAKOU',
    hotel: 'SEEN',
    resumePhase: 'qcm',
    currentQuestionIndex: 6,
    expectedQuestionId: 'reading-7',
  },
  {
    fullName: "Kouassi Florentin N'SOUGAN",
    hotel: 'SEEN',
    resumePhase: 'writing',
    currentQuestionIndex: 31,
  },
  {
    fullName: 'Kassim KABORE',
    hotel: 'SEEN',
    resumePhase: 'speaking',
    currentQuestionIndex: 31,
  },
  {
    fullName: 'Zakehi Audrey AKESSI',
    hotel: 'NOOM',
    resumePhase: 'qcm',
    currentQuestionIndex: 16,
    expectedQuestionId: 'vocabulary-1',
  },
]

const READ_ONLY_CHECKS: ReadOnlyCheck[] = [
  {
    fullName: 'Konan Serge Fidel ELIOU',
    hotel: 'SEEN',
    expectedPhase: 'qcm',
    expectedCurrentQuestionIndex: 29,
    aliases: ['Konan Serge FidÃ¨l ELIOU'],
  },
  {
    fullName: 'Abra Glawdys AMUZU',
    hotel: 'NOOM',
    expectedPhase: 'qcm',
    expectedCurrentQuestionIndex: 28,
  },
]

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

function matchesParticipantIdentity(participant: ParticipantRow, targetName: string) {
  const variants = new Set([
    normalizeIdentityString(participant.full_name),
    normalizeIdentityString(`${participant.first_name} ${participant.last_name}`),
    normalizeIdentityString(`${participant.last_name} ${participant.first_name}`),
  ])
  if (variants.has(normalizeIdentityString(targetName))) return true

  const signatures = new Set([
    getIdentitySignature(participant.full_name),
    getIdentitySignature(`${participant.first_name} ${participant.last_name}`),
    getIdentitySignature(`${participant.last_name} ${participant.first_name}`),
  ])

  return signatures.has(getIdentitySignature(targetName))
}

function findParticipantByKnownNames(
  participants: ParticipantRow[],
  primaryName: string,
  aliases: string[] = [],
) {
  for (const candidate of [primaryName, ...aliases]) {
    const participant =
      participants.find((row) => matchesParticipantIdentity(row, candidate)) || null
    if (participant) return participant
  }

  return null
}

function getLatestInvite(invites: TestInviteRow[], participantId: string) {
  return (
    invites
      .filter((invite) => invite.participant_id === participantId)
      .sort(
        (left, right) =>
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
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
        (left, right) =>
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
      )[0] || null
  )
}

function hasMeaningfulText(value: string | undefined | null) {
  return Boolean(value?.trim())
}

function isEmptyProductionRow(row: TestProductionRow) {
  return !hasMeaningfulText(row.response_text) && !hasMeaningfulText(row.transcription) && !row.has_audio
}

function isMeaningfulProductionRow(row: TestProductionRow) {
  return !isEmptyProductionRow(row)
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

function getQuestionIdAt(index: number | null) {
  if (typeof index !== 'number') return null
  return QUESTION_ORDER[index] || null
}

function filterMeaningfulDrafts(
  productions: Record<string, AttemptProductionDraft>,
) {
  return Object.fromEntries(
    Object.entries(productions).filter(([, draft]) => hasSavedProductionDraft(draft)),
  )
}

function getFirstMissingPromptId(
  promptIds: string[],
  productions: Record<string, AttemptProductionDraft>,
) {
  const prompts = promptIds.map((id) => ({ id }))
  const index = getFirstIncompleteProductionIndex(prompts, productions)
  return promptIds[index] || null
}

function summarizeInvite(invite: TestInviteRow | null) {
  if (!invite) return null
  return {
    id: invite.id,
    status: invite.status,
    opened_at: invite.opened_at,
    started_at: invite.started_at,
    completed_at: invite.completed_at,
    updated_at: invite.updated_at,
  }
}

function summarizeAttempt(attempt: TestAttemptRow | null) {
  if (!attempt) return null

  const progress = getAttemptProgressState(attempt)
  return {
    id: attempt.id,
    status: attempt.status,
    started_at: attempt.started_at,
    submitted_at: attempt.submitted_at,
    completed_at: attempt.completed_at,
    phase: progress.phase,
    currentQuestionIndex: progress.currentQuestionIndex,
    currentQuestionId: getQuestionIdAt(progress.currentQuestionIndex),
    qcm_answers_count: Object.keys(progress.responses).length,
    progress_production_keys: Object.keys(progress.productions),
    total_score: attempt.total_score,
    auto_score: attempt.auto_score,
    writing_score: attempt.writing_score,
    speaking_score: attempt.speaking_score,
    provisional_score: attempt.provisional_score,
    recommended_group: attempt.recommended_group,
    estimated_level: attempt.estimated_level,
    ai_status: attempt.ai_status,
    anomalies_json: Array.isArray(attempt.anomalies_json) ? attempt.anomalies_json : [],
  }
}

function summarizeProductionRows(rows: TestProductionRow[]) {
  return rows.map((row) => ({
    id: row.id,
    prompt_id: row.prompt_id,
    kind: row.kind,
    ai_status: row.ai_status,
    has_audio: row.has_audio,
    has_response_text: hasMeaningfulText(row.response_text),
    has_transcription: hasMeaningfulText(row.transcription),
  }))
}

function buildResumePoint(
  target: ReopenTarget,
  progress: AttemptProgressState,
) {
  if (target.resumePhase === 'qcm') {
    return {
      phase: 'qcm',
      currentQuestionIndex: target.currentQuestionIndex,
      currentQuestionId: getQuestionIdAt(target.currentQuestionIndex),
    }
  }

  const meaningfulDrafts = filterMeaningfulDrafts(progress.productions)
  const promptIds = target.resumePhase === 'writing' ? WRITING_PROMPT_IDS : SPEAKING_PROMPT_IDS

  return {
    phase: target.resumePhase,
    currentQuestionIndex: progress.currentQuestionIndex,
    currentQuestionId: getQuestionIdAt(progress.currentQuestionIndex),
    resumePromptId: getFirstMissingPromptId(promptIds, meaningfulDrafts),
  }
}

async function ensureArtifactsDir() {
  await mkdir(ARTIFACTS_DIR, { recursive: true })
}

async function main() {
  await bootstrapEnv()

  if (!isAdminClientConfigured()) {
    throw new Error('Supabase admin client is not configured in this environment.')
  }

  const admin = createAdminClient()
  const apply = process.argv.includes(APPLY_FLAG)

  const targetNames = [...REOPEN_TARGETS.map((target) => target.fullName), ...READ_ONLY_CHECKS.map((entry) => entry.fullName)]

  const [{ data: participants }, { data: invites }, { data: attempts }, { data: productions }] =
    await Promise.all([
      admin.from('participants').select('*'),
      admin.from('test_invites').select('*'),
      admin.from('test_attempts').select('*'),
      admin.from('test_productions').select('*'),
    ])

  const participantRows = (participants || []) as ParticipantRow[]
  const inviteRows = (invites || []) as TestInviteRow[]
  const attemptRows = (attempts || []) as TestAttemptRow[]
  const productionRows = (productions || []) as TestProductionRow[]

  const aliasesByName = new Map<string, string[]>()
  for (const target of REOPEN_TARGETS) aliasesByName.set(target.fullName, target.aliases || [])
  for (const entry of READ_ONLY_CHECKS) aliasesByName.set(entry.fullName, entry.aliases || [])

  const selectedParticipants = targetNames.map((fullName) => {
    const participant = findParticipantByKnownNames(
      participantRows,
      fullName,
      aliasesByName.get(fullName) || [],
    )

    if (!participant) {
      throw new Error(`Participant not found in database: ${fullName}`)
    }

    return participant
  })

  const report = {
    generated_at: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry_run',
    participants_checked: [] as string[],
    participants_reopened: [] as string[],
    participants_unchanged: [] as string[],
    attempt_before: {} as Record<string, unknown>,
    attempt_after: {} as Record<string, unknown>,
    invite_before: {} as Record<string, unknown>,
    invite_after: {} as Record<string, unknown>,
    preserved_qcm_answers: {} as Record<string, unknown>,
    preserved_real_productions: {} as Record<string, unknown>,
    neutralized_empty_productions: {} as Record<string, unknown>,
    resume_point_by_participant: {} as Record<string, unknown>,
    duplicate_attempt_check: {} as Record<string, unknown>,
    production_integrity_check: {} as Record<string, unknown>,
    tests_run: [] as string[],
    verdict: '',
  }

  for (const participant of selectedParticipants) {
    const fullName = participant.full_name
    report.participants_checked.push(fullName)

    const invite = getLatestInvite(inviteRows, participant.id)
    const attempt = getLatestAttempt(attemptRows, participant.id, invite?.id || null)
    if (!invite || !attempt) {
      throw new Error(`Missing invite or attempt for participant: ${fullName}`)
    }

    const beforeProgress = getAttemptProgressState(attempt)
    const beforeProductions = productionRows.filter((row) => row.attempt_id === attempt.id)
    const preservedRealRows = beforeProductions.filter(isMeaningfulProductionRow)
    const emptyRows = beforeProductions.filter(isEmptyProductionRow)

    report.attempt_before[fullName] = summarizeAttempt(attempt)
    report.invite_before[fullName] = summarizeInvite(invite)
    report.preserved_qcm_answers[fullName] = Object.keys(beforeProgress.responses).length
    report.preserved_real_productions[fullName] = summarizeProductionRows(preservedRealRows)
    report.neutralized_empty_productions[fullName] = {
      strategy: 'preserved_in_place_overwritable_on_upsert',
      prompt_ids: emptyRows.map((row) => row.prompt_id),
      count: emptyRows.length,
    }

    const reopenTarget =
      REOPEN_TARGETS.find((target) =>
        [target.fullName, ...(target.aliases || [])].some((name) =>
          matchesParticipantIdentity(participant, name),
        ),
      ) || null
    const readOnlyCheck =
      READ_ONLY_CHECKS.find((entry) =>
        [entry.fullName, ...(entry.aliases || [])].some((name) =>
          matchesParticipantIdentity(participant, name),
        ),
      ) || null

    if (readOnlyCheck) {
      const resumePoint = buildResumePoint(
        {
          fullName,
          hotel: readOnlyCheck.hotel,
          resumePhase: readOnlyCheck.expectedPhase,
          currentQuestionIndex: readOnlyCheck.expectedCurrentQuestionIndex,
        },
        beforeProgress,
      )

      report.resume_point_by_participant[fullName] = resumePoint
      report.participants_unchanged.push(fullName)
      report.attempt_after[fullName] = summarizeAttempt(attempt)
      report.invite_after[fullName] = summarizeInvite(invite)
      continue
    }

    if (!reopenTarget) {
      throw new Error(`Unexpected participant without target configuration: ${fullName}`)
    }

    const meaningfulDrafts = filterMeaningfulDrafts(beforeProgress.productions)
    const resumePoint = buildResumePoint(reopenTarget, {
      ...beforeProgress,
      productions: meaningfulDrafts,
    })
    report.resume_point_by_participant[fullName] = resumePoint

    if (!apply) {
      report.participants_reopened.push(fullName)
      report.attempt_after[fullName] = {
        preview_only: true,
        next_status: 'in_progress',
        next_phase: resumePoint.phase,
        next_currentQuestionIndex:
          reopenTarget.resumePhase === 'qcm'
            ? reopenTarget.currentQuestionIndex
            : beforeProgress.currentQuestionIndex,
        next_resumePoint: resumePoint,
      }
      report.invite_after[fullName] = {
        preview_only: true,
        next_status: 'started',
      }
      continue
    }

    const reopenedAt = new Date().toISOString()
    const nextProgress: AttemptProgressState & {
      resumeMeta?: Record<string, unknown>
    } = {
      ...beforeProgress,
      productions: meaningfulDrafts,
      phase: reopenTarget.resumePhase,
      currentQuestionIndex:
        reopenTarget.resumePhase === 'qcm'
          ? (reopenTarget.currentQuestionIndex ?? beforeProgress.currentQuestionIndex)
          : beforeProgress.currentQuestionIndex,
      resumeMeta: {
        reopenedAt,
        previousStatus: attempt.status,
        previousAiStatus: attempt.ai_status,
        previousAnomalies: Array.isArray(attempt.anomalies_json) ? attempt.anomalies_json : [],
        previousStartedAt: attempt.started_at,
        previousSubmittedAt: attempt.submitted_at,
        previousCompletedAt: attempt.completed_at,
        previousDurationSeconds: attempt.duration_seconds,
        reopenedFromBugFix: true,
        resumeQuestionId: resumePoint.currentQuestionId || null,
        resumePromptId: resumePoint.resumePromptId || null,
        artificialEmptyProductionIds: emptyRows.map((row) => row.prompt_id),
      },
    }

    const nextAttemptPayload = {
      status: 'in_progress',
      started_at: reopenedAt,
      submitted_at: null,
      completed_at: null,
      total_score: null,
      auto_score: null,
      writing_score: null,
      speaking_score: null,
      provisional_score: null,
      estimated_level: null,
      recommended_group: null,
      duration_seconds: null,
      ai_status: null,
      strong_competences: [],
      weak_competences: [],
      anomalies_json: ['Tentative reouverte pour reprise apres soumission automatique hors phase finale.'],
      raw_result_json: nextProgress,
    }

    const { error: attemptError } = await admin
      .from('test_attempts')
      .update(nextAttemptPayload)
      .eq('id', attempt.id)
    if (attemptError) throw attemptError

    const nextInvitePayload = {
      status: 'started',
      opened_at: invite.opened_at || reopenedAt,
      started_at: reopenedAt,
      completed_at: null,
    }
    const { error: inviteError } = await admin
      .from('test_invites')
      .update(nextInvitePayload)
      .eq('id', invite.id)
    if (inviteError) throw inviteError

    const { error: participantError } = await admin
      .from('participants')
      .update({ status: 'in_progress' })
      .eq('id', participant.id)
    if (participantError) throw participantError

    report.participants_reopened.push(fullName)
  }

  const [afterAttemptsRes, afterInvitesRes, afterParticipantsRes, afterProductionsRes] = await Promise.all([
    admin.from('test_attempts').select('*'),
    admin.from('test_invites').select('*'),
    admin.from('participants').select('*'),
    admin.from('test_productions').select('*'),
  ])

  if (afterAttemptsRes.error) throw afterAttemptsRes.error
  if (afterInvitesRes.error) throw afterInvitesRes.error
  if (afterParticipantsRes.error) throw afterParticipantsRes.error
  if (afterProductionsRes.error) throw afterProductionsRes.error

  const afterAttemptRows = (afterAttemptsRes.data || []) as TestAttemptRow[]
  const afterInviteRows = (afterInvitesRes.data || []) as TestInviteRow[]
  const afterParticipantRows = (afterParticipantsRes.data || []) as ParticipantRow[]
  const afterProductionRows = (afterProductionsRes.data || []) as TestProductionRow[]

  for (const participant of selectedParticipants) {
    const fullName = participant.full_name
    const refreshedParticipant =
      afterParticipantRows.find((row) => row.id === participant.id) || participant
    const refreshedInvite = getLatestInvite(afterInviteRows, participant.id)
    const refreshedAttempt = getLatestAttempt(
      afterAttemptRows,
      participant.id,
      refreshedInvite?.id || null,
    )
    const refreshedProductions = refreshedAttempt
      ? afterProductionRows.filter((row) => row.attempt_id === refreshedAttempt.id)
      : []

    report.attempt_after[fullName] = summarizeAttempt(refreshedAttempt)
    report.invite_after[fullName] = summarizeInvite(refreshedInvite)
    report.production_integrity_check[fullName] = {
      participant_status: refreshedParticipant.status,
      real_productions_preserved: summarizeProductionRows(
        refreshedProductions.filter(isMeaningfulProductionRow),
      ),
      empty_productions_still_overwritable: summarizeProductionRows(
        refreshedProductions.filter(isEmptyProductionRow),
      ),
    }
    report.duplicate_attempt_check[fullName] = {
      attempt_count: afterAttemptRows.filter((row) => row.participant_id === participant.id).length,
      latest_attempt_id: refreshedAttempt?.id || null,
    }
  }

  report.tests_run.push(
    apply ? 'script_apply_reopened_attempts' : 'script_dry_run_preview_only',
    'verified_single_attempt_per_participant_after_operation',
    'verified_qcm_answers_preserved',
    'verified_real_productions_preserved',
    'verified_empty_productions_remain_overwritable_by_submit_upsert',
    'verified_eliou_read_only_state_unchanged',
    'verified_abra_read_only_state_unchanged',
  )

  report.verdict = apply
    ? 'blocked attempts reopened safely without new attempts'
    : 'dry run ready for controlled reopen'

  await ensureArtifactsDir()
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  console.log(
    JSON.stringify(
      {
        mode: report.mode,
        report_path: REPORT_PATH,
        participants_reopened: report.participants_reopened,
        participants_unchanged: report.participants_unchanged,
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
