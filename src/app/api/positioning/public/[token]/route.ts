import { SupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {
  POSITIONING_DEFAULT_GROUP_SIZE,
  POSITIONING_DURATION_MINUTES,
  POSITIONING_TEST_VERSION,
} from '@/lib/positioning/config'
import { getPublicInviteContext } from '@/lib/positioning/access'
import { computeGroupAssignments } from '@/lib/positioning/grouping'
import { getPositioningQuestionById, getPositioningQuestions } from '@/lib/positioning/questions'
import { computeAttemptResult, serializeQuestionBank } from '@/lib/positioning/scoring'
import { AttemptProgressState, AttemptResponsesMap, ParticipantRow, TestAttemptRow } from '@/lib/positioning/types'

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
    currentQuestionIndex:
      typeof raw.currentQuestionIndex === 'number' ? clampQuestionIndex(raw.currentQuestionIndex) : 0,
    sectionOrder: Array.isArray(raw.sectionOrder) ? raw.sectionOrder : ['reading', 'listening', 'vocabulary'],
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

  return {
    ok: true,
    status: 'completed',
  }
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
    questions: serializeQuestionBank(questions),
    durationMinutes: POSITIONING_DURATION_MINUTES,
    isExpired,
  })
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
    action?: 'START_TEST' | 'SAVE_PROGRESS' | 'SUBMIT_TEST'
    questionId?: string
    answer?: string
    currentQuestionIndex?: number
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
      if (completedPayload) {
        return NextResponse.json(completedPayload)
      }
    }

    return NextResponse.json({ error: 'Ce test a deja ete termine.' }, { status: 409 })
  }

  if (body.action === 'START_TEST') {
    const startedAt = attempt?.started_at || new Date().toISOString()
    const rawResult = {
      ...existingProgress,
      currentQuestionIndex: attempt ? existingProgress.currentQuestionIndex : 0,
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
    return NextResponse.json({ error: 'Le test doit etre demarre avant de repondre.' }, { status: 400 })
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

    await admin
      .from('test_attempts')
      .update({
        status: 'in_progress',
        raw_result_json: nextProgress,
        device_info: body.deviceInfo || attempt.device_info || {},
      })
      .eq('id', attempt.id)

    await admin.from('participants').update({ status: 'in_progress' }).eq('id', participant.id)

    return NextResponse.json({
      ok: true,
      remainingSeconds: getRemainingSeconds(attempt.started_at),
    })
  }

  if (body.action === 'SUBMIT_TEST') {
    const responses = existingProgress.responses
    const result = computeAttemptResult(responses)
    const completedAt = new Date().toISOString()
    const startedAt = attempt.started_at || completedAt
    const durationSeconds = Math.max(
      0,
      Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000),
    )

    await admin
      .from('test_attempts')
      .update({
        status: 'completed',
        submitted_at: completedAt,
        completed_at: completedAt,
        total_score: result.totalScore,
        estimated_level: result.level,
        recommended_group: result.recommendedGroupBase,
        duration_seconds: durationSeconds,
        anomalies_json: result.anomalies,
        raw_result_json: {
          ...existingProgress,
          completedAt,
          sectionScores: result.sectionScores,
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
        details_json: {
          percentage: section.percentage,
        },
      })),
    )

    await admin
      .from('test_invites')
      .update({
        status: 'completed',
        completed_at: completedAt,
      })
      .eq('id', invite.id)

    await admin.from('participants').update({ status: 'completed' }).eq('id', participant.id)
    await recalculateGroups(admin)

    return NextResponse.json({
      ok: true,
      status: 'completed',
    })
  }

  return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 })
}
