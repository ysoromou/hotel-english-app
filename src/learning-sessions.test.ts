import {
  insertLearningSessionWithFallback,
  loadLearningSessionsWithFallback,
} from './lib/learning-sessions'

let testCount = 0
let passCount = 0
let failCount = 0

function assert(condition: boolean, message: string) {
  testCount++
  if (condition) {
    passCount++
    console.log(`PASS: ${message}`)
    return
  }

  failCount++
  console.log(`FAIL: ${message}`)
}

function createLearningSessionsClient({
  insertResponses,
  canonicalRows,
  legacyRows,
}: {
  insertResponses: Array<{ error: { code?: string; message?: string } | null }>
  canonicalRows?: Array<Record<string, unknown>>
  legacyRows?: Array<Record<string, unknown>>
}) {
  const inserts: Record<string, unknown>[] = []
  const selects: string[] = []

  return {
    client: {
      from() {
        return {
          insert(values: Record<string, unknown>) {
            inserts.push(values)
            return Promise.resolve(insertResponses.shift() || { error: null })
          },
          select(columns: string) {
            selects.push(columns)
            return {
              eq() {
                return {
                  order(orderColumn: string) {
                    if (orderColumn === 'started_at') {
                      return Promise.resolve({
                        data: canonicalRows || null,
                        error: canonicalRows ? null : { code: '42703', message: 'column learning_sessions.started_at does not exist' },
                      })
                    }

                    return Promise.resolve({
                      data: legacyRows || [],
                      error: null,
                    })
                  },
                }
              },
            }
          },
        }
      },
    },
    inserts,
    selects,
  }
}

async function test_insert_falls_back_to_legacy_schema() {
  const mock = createLearningSessionsClient({
    insertResponses: [
      { error: { code: 'PGRST204', message: "Could not find the 'started_at' column of 'learning_sessions' in the schema cache" } },
      { error: { code: 'PGRST204', message: "Could not find the 'action_id' column of 'learning_sessions' in the schema cache" } },
      { error: null },
    ],
  })

  const schema = await insertLearningSessionWithFallback(mock.client, {
    user_id: 'user-1',
    action_id: 'REC_001',
    started_at: '2026-04-20T10:00:00.000Z',
    ended_at: '2026-04-20T10:10:00.000Z',
    score: 80,
    exercises_done: 7,
  })

  assert(schema === 'legacy', 'insert fallback returns legacy schema')
  assert(mock.inserts.length === 3, 'insert retries canonical, legacy with action_id, then legacy without action_id')
  assert(mock.inserts[1].action_id === 'REC_001', 'first legacy retry keeps action_id when available')
  assert(mock.inserts[2].start_time === '2026-04-20T10:00:00.000Z', 'legacy insert maps started_at to start_time')
  assert(mock.inserts[2].end_time === '2026-04-20T10:10:00.000Z', 'legacy insert maps ended_at to end_time')
  assert(mock.inserts[2].score_session === 80, 'legacy insert maps score to score_session')
  assert(mock.inserts[2].exercises_completed === 7, 'legacy insert maps exercises_done to exercises_completed')
  assert(!('action_id' in mock.inserts[2]), 'final legacy retry omits action_id when live schema lacks it')
}

async function test_read_falls_back_to_legacy_schema() {
  const mock = createLearningSessionsClient({
    insertResponses: [],
    legacyRows: [
      {
        score_session: 90,
        exercises_completed: 6,
        start_time: '2026-04-20T11:00:00.000Z',
      },
    ],
  })

  const result = await loadLearningSessionsWithFallback(mock.client, 'user-1')

  assert(result.schema === 'legacy', 'read fallback returns legacy schema')
  assert(mock.selects[0] === 'score, exercises_done, started_at', 'read tries canonical columns first')
  assert(mock.selects[1] === 'score_session, exercises_completed, start_time', 'read retries with legacy columns')
  assert(result.rows.length === 1, 'read maps one legacy session row')
  assert(result.rows[0].score_session === 90, 'legacy read keeps score_session shape for progress scoring')
  assert(result.rows[0].exercises_completed === 6, 'legacy read keeps exercises_completed shape for progress scoring')
  assert(result.rows[0].start_time === '2026-04-20T11:00:00.000Z', 'legacy read keeps start_time shape for progress scoring')
}

async function test_insert_keeps_canonical_schema_when_available() {
  const mock = createLearningSessionsClient({
    insertResponses: [{ error: null }],
  })

  const schema = await insertLearningSessionWithFallback(mock.client, {
    user_id: 'user-2',
    action_id: 'REC_002',
    started_at: '2026-04-20T12:00:00.000Z',
    ended_at: '2026-04-20T12:15:00.000Z',
    score: 100,
    exercises_done: 8,
  })

  assert(schema === 'canonical', 'insert keeps canonical schema when first write succeeds')
  assert(mock.inserts.length === 1, 'canonical insert does not trigger legacy retry')
}

async function test_read_maps_canonical_schema_to_legacy_session_shape() {
  const mock = createLearningSessionsClient({
    insertResponses: [],
    canonicalRows: [
      {
        score: 75,
        exercises_done: 9,
        started_at: '2026-04-20T12:30:00.000Z',
      },
    ],
  })

  const result = await loadLearningSessionsWithFallback(mock.client, 'user-2')

  assert(result.schema === 'canonical', 'read returns canonical schema when columns exist')
  assert(result.rows[0].score_session === 75, 'canonical read maps score to score_session')
  assert(result.rows[0].exercises_completed === 9, 'canonical read maps exercises_done to exercises_completed')
  assert(result.rows[0].start_time === '2026-04-20T12:30:00.000Z', 'canonical read maps started_at to start_time')
}

async function main() {
  await test_insert_falls_back_to_legacy_schema()
  await test_read_falls_back_to_legacy_schema()
  await test_insert_keeps_canonical_schema_when_available()
  await test_read_maps_canonical_schema_to_legacy_session_shape()

  console.log(`Total: ${testCount}`)
  console.log(`Passed: ${passCount}`)
  console.log(`Failed: ${failCount}`)

  if (failCount > 0) {
    process.exitCode = 1
  }
}

void main()
