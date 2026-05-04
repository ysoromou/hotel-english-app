import { SupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {
  POSITIONING_DEFAULT_GROUP_SIZE,
  POSITIONING_DURATION_MINUTES,
  POSITIONING_TEST_VERSION,
} from '@/lib/positioning/config'
import { getPublicInviteContext } from '@/lib/positioning/access'
import { computeGroupAssignments } from '@/lib/positioning/grouping'
import {
  getPositioningProductionById,
  getPositioningProductions,
  getPositioningQuestionById,
  getPositioningQuestions,
} from '@/lib/positioning/questions'
import {
  canComputeProvisionalScore,
  computeAttemptResult,
  computeProvisionalScore,
  deriveCompetenceVerdict,
  serializeQuestionBank,
} from '@/lib/positioning/scoring'
import {
  aggregateProductionScores,
  evaluateProduction,
} from '@/lib/positioning/ai-evaluation'
import {
  AttemptProductionDraft,
  AttemptProgressState,
  AttemptResponsesMap,
  ParticipantRow,
  PositioningProductionKind,
  TestAttemptRow,
  TestProductionRow,
} from '@/lib/positioning/types'

const POSITIONING_QUESTION_COUNT = getPositioningQuestions().length

function getRemainingSeconds(startedAt: string | null) {
  if (!startedAt) return null
  const started = new Date(startedAt).getTime()
  const allowedMs = POSITIONING_DURATION_MINUTES * 60 * 1000
  return Math.max(0, Math.round((started + allowedMs - Date.now()) / 1000))
}

function clampQuestionIndex(value: number) {
  return Math.max(0, Math.min(value, Math.max(POSITIONING_QUESTION_COUNT - 1, 0)))
}

function isAttemptTimeElapsed(startedAt: string | null) {
  const remainingSeconds = getRemainingSeconds(startedAt)
  return remainingSeconds !== null && remainingSeconds <= 0
}

function getProgressState(attempt: TestAttemptRow | null): AttemptProgressState {
  const raw = (attempt?.raw_result_json || {}) as Partial<AttemptProgressState>

  return {
    responses: (raw.responses as AttemptResponsesMap) || {},
    productions: (raw.productions as Record<string, AttemptProductionDraft>) || {},
    currentQuestionIndex:
      typeof raw.currentQuestionIndex === 'number'
        ? clampQuestionIndex(raw.currentQuestionIndex)
        : 0,
    phase: (raw.phase as AttemptProgressState['phase']) || 'qcm',
    sectionOrder: Array.isArray(raw.sectionOrder)
      ? raw.sectionOrder
      : ['reading', 'listening', 'vocabulary', 'situations'],
    testVersion: typeof raw.testVersion === 'string' ? raw.testVersion : POSITIONING_TEST_VERSION,
  }
}

async function recalculateGroups(admin: SupabaseClient) {
  const [{ data: participants }, { data: attempts }] = await Promise.all([
    admin.from('participants').select('*'),
    admin.from('test_attempts').select('*'),
  ])

  const assignments = computeGroupAssignments({
    participants: (participants || []) as ParticipantRow[],
    attempts: (attempts || []) as TestAttemptRow[],
    targetGroupSize: POSITIONING_DEFAULT_GROUP_SIZE,
  })

  for (const assignment of assignments) {
    await admin.from('group_recommendations').upsert(
      {
        participant_id: assignment.participantId,
        attempt_id: assignment.attemptId,
        recommended_group: assignment.recommendedGroup,
        rationale: assignment.rationale,
      },
      { onConflict: 'participant_id' },
    )

    await admin
      .from('test_attempts')
      .update({ recommended_group: assignment.recommendedGroup })
      .eq('id', assignment.attemptId)
  }
}

async function resolveContext(token: string) {
  try {
    return await getPublicInviteContext(token)
  } catch (error) {
    return error instanceof Error ? error : new Error('Configuration positioning indisponible.')
  }
}

function getCompletedAttemptResponse(attempt: TestAttemptRow | null) {
  if (!attempt) return null
  return { ok: true, status: 'completed' }
}

function serializeProductions() {
  return getPositioningProductions().map((prompt) => ({
    id: prompt.id,
    kind: prompt.kind,
    level: prompt.level,
    metier: prompt.metier,
    context: prompt.context,
    task: prompt.task,
    guidance: prompt.guidance ?? null,
  }))
}

export async function GET(_: NextRequest, { params }: { params: { token: string } }) {
  const context = await resolveContext(params.token)
  if (context instanceof Error) {
    return NextResponse.json({ error: context.message }, { status: 503 })
  }
  if (!context) {
    return NextResponse.json({ error: 'Lien invalide' }, { status: 404 })
  }

  const { admin, invite, participant, attempt, questions, isExpired } = context

  if (!isExpired && !invite.opened_at && invite.status !== 'completed' && attempt?.status !== 'completed') {
    await admin
      .from('test_invites')
      .update({
        status: attempt?.status === 'in_progress' ? 'started' : 'opened',
        opened_at: new Date().toISOString(),
      })
      .eq('id', invite.id)
    await admin
      .from('participants')
      .update({
        status: attempt?.status === 'in_progress' ? 'in_progress' : 'opened',
      })
      .eq('id', participant.id)
  }

  return NextResponse.json({
    participant: {
      firstName: participant.first_name,
      lastName: participant.last_name,
      fullName: participant.full_name,
      hotel: participant.hotel,
      service: participant.department,
    },
    invite: {
      status: isExpired ? 'expired' : invite.status,
      deadlineAt: invite.deadline_at,
      expiresAt: invite.expires_at,
    },
    attempt: attempt
      ? {
          status: attempt.status,
          remainingSeconds: getRemainingSeconds(attempt.started_at),
          progress: getProgressState(attempt),
        }
      : null,
    questions: serializeQuestionBank(questions, params.token),
    productions: serializeProductions(),
    durationMinutes: POSITIONING_DURATION_MINUTES,
    isExpired,
  })
}

async function persistProgress(
  admin: SupabaseClient,
  attempt: TestAttemptRow,
  progress: AttemptProgressState,
  deviceInfo?: Record<string, unknown>,
) {
  await admin
    .from('test_attempts')
    .update({
      status: 'in_progress',
      raw_result_json: progress,
      device_info: deviceInfo || attempt.device_info || {},
    })
    .eq('id', attempt.id)
}

async function runProductionsPipeline(
  admin: SupabaseClient,
  attemptId: string,
  participantId: string,
  productionsDraft: Record<string, AttemptProductionDraft>,
) {
  const productions = getPositioningProductions()

  // Evaluations IA en parallele : reduit fortement le temps de soumission
  // (de N x 60 s sequentiel a max(60 s) en parallele).
  const evaluations = await Promise.all(
    productions.map(async (prompt) => {
      const draft = productionsDraft[prompt.id]
      const responseText =
        prompt.kind === 'writing' ? draft?.responseText?.trim() || null : null
      const transcription =
        prompt.kind === 'speaking' ? draft?.transcription?.trim() || null : null
      const hasAudio = prompt.kind === 'speaking' ? Boolean(draft?.hasAudio) : false

      const evaluation = await evaluateProduction({
        prompt,
        responseText,
        transcription,
        hasAudio,
      })

      return { prompt, responseText, transcription, hasAudio, evaluation }
    }),
  )

  const evaluatedRows: TestProductionRow[] = []
  for (const { prompt, responseText, transcription, hasAudio, evaluation } of evaluations) {
    const upsertPayload = {
      attempt_id: attemptId,
      participant_id: participantId,
      prompt_id: prompt.id,
      kind: prompt.kind,
      response_text: responseText,
      transcription,
      has_audio: hasAudio,
      ai_score: evaluation.ai_score,
      ai_level: evaluation.ai_level,
      ai_competences: evaluation.ai_competences,
      ai_errors: evaluation.ai_errors,
      ai_justification: evaluation.ai_justification,
      ai_confidence: evaluation.ai_confidence,
      ai_status: evaluation.ai_status,
      raw_ai_response: evaluation.raw_ai_response,
    }

    const { data } = await admin
      .from('test_productions')
      .upsert(upsertPayload, { onConflict: 'attempt_id,prompt_id' })
      .select('*')
      .single()

    if (data) evaluatedRows.push(data as TestProductionRow)
  }

  return evaluatedRows
}

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const context = await resolveContext(params.token)
  if (context instanceof Error) {
    return NextResponse.json({ error: context.message }, { status: 503 })
  }
  if (!context) {
    return NextResponse.json({ error: 'Lien invalide' }, { status: 404 })
  }

  const { admin, invite, participant, attempt, isExpired } = context
  const body = (await request.json()) as {
    action?:
      | 'START_TEST'
      | 'SAVE_PROGRESS'
      | 'SAVE_PRODUCTION'
      | 'SET_PHASE'
      | 'SUBMIT_TEST'
    questionId?: string
    answer?: string
    currentQuestionIndex?: number
    phase?: AttemptProgressState['phase']
    promptId?: string
    kind?: PositioningProductionKind
    responseText?: string
    transcription?: string
    hasAudio?: boolean
    durationSeconds?: number
    deviceInfo?: Record<string, unknown>
  }

  if (isExpired) {
    await admin.from('test_invites').update({ status: 'expired' }).eq('id', invite.id)
    return NextResponse.json({ error: 'Lien expire' }, { status: 410 })
  }

  const existingProgress = getProgressState(attempt || null)
  const isCompletedAttempt = attempt?.status === 'completed' || invite.status === 'completed'

  if (isCompletedAttempt) {
    if (body.action === 'SUBMIT_TEST') {
      const completedPayload = getCompletedAttemptResponse(attempt || null)
      if (completedPayload) return NextResponse.json(completedPayload)
    }
    return NextResponse.json({ error: 'Ce test a deja ete termine.' }, { status: 409 })
  }

  if (body.action === 'START_TEST') {
    const startedAt = attempt?.started_at || new Date().toISOString()
    const rawResult: AttemptProgressState = {
      ...existingProgress,
      currentQuestionIndex: attempt ? existingProgress.currentQuestionIndex : 0,
      phase: existingProgress.phase || 'qcm',
      testVersion: POSITIONING_TEST_VERSION,
    }

    const attemptPayload = {
      participant_id: participant.id,
      invite_id: invite.id,
      status: 'in_progress',
      started_at: startedAt,
      raw_result_json: rawResult,
      device_info: body.deviceInfo || attempt?.device_info || {},
    }

    const { data: upsertedAttempt } = await admin
      .from('test_attempts')
      .upsert(attemptPayload, { onConflict: 'participant_id,invite_id' })
      .select('*')
      .single()

    await admin
      .from('test_invites')
      .update({
        status: 'started',
        opened_at: invite.opened_at || startedAt,
        started_at: startedAt,
      })
      .eq('id', invite.id)

    await admin.from('participants').update({ status: 'in_progress' }).eq('id', participant.id)

    return NextResponse.json({
      ok: true,
      attempt: upsertedAttempt,
      remainingSeconds: getRemainingSeconds(startedAt),
    })
  }

  if (!attempt) {
    return NextResponse.json(
      { error: 'Le test doit etre demarre avant de repondre.' },
      { status: 400 },
    )
  }

  if (body.action === 'SAVE_PROGRESS') {
    if (isAttemptTimeElapsed(attempt.started_at)) {
      return NextResponse.json({ error: 'Temps ecoule. Merci de valider le test.' }, { status: 409 })
    }
    if (!body.questionId || !body.answer) {
      return NextResponse.json({ error: 'Reponse incomplete.' }, { status: 400 })
    }

    const question = getPositioningQuestionById(body.questionId)
    if (!question) {
      return NextResponse.json({ error: 'Question inconnue.' }, { status: 400 })
    }
    if (!question.options.some((option) => option.id === body.answer)) {
      return NextResponse.json({ error: 'Reponse incoherente.' }, { status: 400 })
    }

    const nextProgress: AttemptProgressState = {
      ...existingProgress,
      responses: {
        ...existingProgress.responses,
        [body.questionId]: {
          answer: body.answer,
          answeredAt: new Date().toISOString(),
        },
      },
      currentQuestionIndex:
        typeof body.currentQuestionIndex === 'number'
          ? clampQuestionIndex(body.currentQuestionIndex)
          : existingProgress.currentQuestionIndex,
    }

    await persistProgress(admin, attempt, nextProgress, body.deviceInfo)
    await admin.from('participants').update({ status: 'in_progress' }).eq('id', participant.id)

    return NextResponse.json({
      ok: true,
      remainingSeconds: getRemainingSeconds(attempt.started_at),
    })
  }

  if (body.action === 'SET_PHASE') {
    if (!body.phase) {
      return NextResponse.json({ error: 'Phase manquante.' }, { status: 400 })
    }
    const nextProgress: AttemptProgressState = {
      ...existingProgress,
      phase: body.phase,
    }
    await persistProgress(admin, attempt, nextProgress, body.deviceInfo)
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'SAVE_PRODUCTION') {
    if (!body.promptId || !body.kind) {
      return NextResponse.json({ error: 'Production incomplete.' }, { status: 400 })
    }
    const prompt = getPositioningProductionById(body.promptId)
    if (!prompt || prompt.kind !== body.kind) {
      return NextResponse.json({ error: 'Production inconnue.' }, { status: 400 })
    }

    const draft: AttemptProductionDraft = {
      promptId: prompt.id,
      kind: prompt.kind,
      responseText:
        prompt.kind === 'writing' ? (body.responseText || '').slice(0, 4000) : undefined,
      transcription:
        prompt.kind === 'speaking' ? (body.transcription || '').slice(0, 4000) : undefined,
      hasAudio: prompt.kind === 'speaking' ? Boolean(body.hasAudio) : undefined,
      durationSeconds: typeof body.durationSeconds === 'number' ? body.durationSeconds : undefined,
      submittedAt: new Date().toISOString(),
    }

    const nextProgress: AttemptProgressState = {
      ...existingProgress,
      productions: {
        ...existingProgress.productions,
        [prompt.id]: draft,
      },
    }

    await persistProgress(admin, attempt, nextProgress, body.deviceInfo)
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'SUBMIT_TEST') {
    const responses = existingProgress.responses
    const productionsDraft = existingProgress.productions
    const result = computeAttemptResult(responses)
    const completedAt = new Date().toISOString()
    const startedAt = attempt.started_at || completedAt
    const durationSeconds = Math.max(
      0,
      Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000),
    )

    const productionRows = await runProductionsPipeline(
      admin,
      attempt.id,
      participant.id,
      productionsDraft,
    )

    const aggregate = aggregateProductionScores(
      productionRows.map((row) => ({
        kind: row.kind,
        ai_score: row.ai_score,
        trainer_score: row.trainer_score,
        ai_status: row.ai_status,
        ai_competences: row.ai_competences,
        ai_level: row.ai_level,
      })),
    )

    const provisional = computeProvisionalScore({
      autoScore: result.autoScore,
      writingScore: aggregate.writingScore,
      speakingScore: aggregate.speakingScore,
    })

    const competenceVerdict = deriveCompetenceVerdict(result.competenceCoverage, {
      strong: aggregate.strongFromProductions,
      weak: aggregate.weakFromProductions,
    })

    const aiStatus = aggregate.overallStatus
    const hasCompleteConsolidation = canComputeProvisionalScore({
      autoScore: result.autoScore,
      writingScore: aggregate.writingScore,
      speakingScore: aggregate.speakingScore,
    })
    const finalProvisionalScore = hasCompleteConsolidation ? provisional.provisional : null
    const finalTotalScore = hasCompleteConsolidation ? provisional.provisional : null
    const finalLevel = hasCompleteConsolidation ? provisional.level : null
    const finalGroup = hasCompleteConsolidation ? provisional.recommendedGroupBase : null
    const blockingReason =
      aiStatus === 'missing_answer'
        ? 'Score provisoire incomplet : au moins une reponse writing/speaking est manquante.'
        : aiStatus === 'audio_unusable'
          ? 'Score provisoire incomplet : au moins un audio oral est inexploitable sans transcription.'
          : aiStatus === 'ai_error'
            ? 'Score provisoire incomplet : evaluation IA indisponible ou reponse JSON inexploitable.'
            : 'Score provisoire incomplet : evaluation writing/speaking manquante.'
    const provisionalAnomalies = hasCompleteConsolidation
      ? result.anomalies
      : [...result.anomalies, blockingReason]

    await admin
      .from('test_attempts')
      .update({
        status: 'completed',
        submitted_at: completedAt,
        completed_at: completedAt,
        total_score: finalTotalScore,
        auto_score: result.autoScore,
        writing_score: aggregate.writingScore,
        speaking_score: aggregate.speakingScore,
        provisional_score: finalProvisionalScore,
        ai_status: aiStatus,
        strong_competences: competenceVerdict.strong,
        weak_competences: competenceVerdict.weak,
        estimated_level: finalLevel,
        recommended_group: finalGroup,
        duration_seconds: durationSeconds,
        anomalies_json: provisionalAnomalies,
        raw_result_json: {
          ...existingProgress,
          completedAt,
          sectionScores: result.sectionScores,
          competenceCoverage: result.competenceCoverage,
        },
      })
      .eq('id', attempt.id)

    await admin.from('test_section_results').delete().eq('attempt_id', attempt.id)
    await admin.from('test_section_results').insert(
      result.sectionScores.map((section) => ({
        attempt_id: attempt.id,
        section_key: section.sectionKey,
        score: section.score,
        max_score: section.maxScore,
        details_json: { percentage: section.percentage },
      })),
    )

    await admin
      .from('test_invites')
      .update({ status: 'completed', completed_at: completedAt })
      .eq('id', invite.id)

    await admin.from('participants').update({ status: 'completed' }).eq('id', participant.id)
    await recalculateGroups(admin)

    return NextResponse.json({ ok: true, status: 'completed' })
  }

  return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 })
}
