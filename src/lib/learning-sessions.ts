import type { SessionRow } from './progress-scoring'

interface LearningSessionsError {
  code?: string
  message?: string
}

type LearningSessionsClient = {
  from(table: 'learning_sessions'): any
}

export interface LearningSessionWritePayload {
  user_id: string
  action_id: string
  started_at: string
  ended_at: string
  score: number
  exercises_done: number
}

type LearningSessionSchema = 'canonical' | 'legacy'

function isMissingColumnError(error: LearningSessionsError | null | undefined) {
  if (!error) return false
  if (error.code === '42703') return true
  if (error.code === 'PGRST204') return true

  const message = error.message || ''
  return (
    (/learning_sessions\./i.test(message) && /does not exist/i.test(message))
    || /Could not find the '.+' column of 'learning_sessions'/i.test(message)
  )
}

function mapLegacyRows(rows: Record<string, unknown>[]): SessionRow[] {
  return rows.map((row) => {
    const score = typeof row.score_session === 'number' ? row.score_session : null
    const exercisesDone =
      typeof row.exercises_completed === 'number' ? row.exercises_completed : 0
    const startedAt = typeof row.start_time === 'string' ? row.start_time : ''

    return {
      score,
      exercises_done: exercisesDone,
      started_at: startedAt,
      score_session: score,
      exercises_completed: exercisesDone,
      start_time: startedAt,
    } as SessionRow
  })
}

function mapCanonicalRows(rows: Record<string, unknown>[]): SessionRow[] {
  return rows.map((row) => {
    const score = typeof row.score === 'number' ? row.score : null
    const exercisesDone = typeof row.exercises_done === 'number' ? row.exercises_done : 0
    const startedAt = typeof row.started_at === 'string' ? row.started_at : ''

    return {
      score,
      exercises_done: exercisesDone,
      started_at: startedAt,
      score_session: score,
      exercises_completed: exercisesDone,
      start_time: startedAt,
    } as SessionRow
  })
}

async function tryInsert(
  supabase: LearningSessionsClient,
  values: Record<string, unknown>
): Promise<{ error: LearningSessionsError | null }> {
  return await supabase
    .from('learning_sessions')
    .insert(values) as { error: LearningSessionsError | null }
}

export async function insertLearningSessionWithFallback(
  supabase: LearningSessionsClient,
  payload: LearningSessionWritePayload
): Promise<LearningSessionSchema> {
  const canonicalAttempt = await tryInsert(supabase, { ...payload })

  if (!canonicalAttempt.error) {
    return 'canonical'
  }

  if (!isMissingColumnError(canonicalAttempt.error)) {
    throw canonicalAttempt.error
  }

  const legacyPayloads: Record<string, unknown>[] = [
    {
      user_id: payload.user_id,
      action_id: payload.action_id,
      start_time: payload.started_at,
      end_time: payload.ended_at,
      score_session: payload.score,
      exercises_completed: payload.exercises_done,
    },
    {
      user_id: payload.user_id,
      start_time: payload.started_at,
      end_time: payload.ended_at,
      score_session: payload.score,
      exercises_completed: payload.exercises_done,
    },
  ]

  for (const legacyPayload of legacyPayloads) {
    const legacyAttempt = await tryInsert(supabase, legacyPayload)

    if (!legacyAttempt.error) {
      return 'legacy'
    }

    if (!isMissingColumnError(legacyAttempt.error)) {
      throw legacyAttempt.error
    }
  }

  throw canonicalAttempt.error
}

export async function loadLearningSessionsWithFallback(
  supabase: LearningSessionsClient,
  userId: string
): Promise<{ rows: SessionRow[]; schema: LearningSessionSchema }> {
  const canonicalResult = await supabase
    .from('learning_sessions')
    .select('score, exercises_done, started_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false }) as {
      data: Record<string, unknown>[] | null
      error: LearningSessionsError | null
    }

  if (!canonicalResult.error) {
    return {
      rows: mapCanonicalRows(canonicalResult.data || []),
      schema: 'canonical',
    }
  }

  if (!isMissingColumnError(canonicalResult.error)) {
    throw canonicalResult.error
  }

  const legacyResult = await supabase
    .from('learning_sessions')
    .select('score_session, exercises_completed, start_time')
    .eq('user_id', userId)
    .order('start_time', { ascending: false }) as {
      data: Record<string, unknown>[] | null
      error: LearningSessionsError | null
    }

  if (legacyResult.error) {
    throw legacyResult.error
  }

  return {
    rows: mapLegacyRows(legacyResult.data || []),
    schema: 'legacy',
  }
}
