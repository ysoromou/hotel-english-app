// @ts-nocheck
import Module from 'module'
import path from 'path'

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
    request = path.join(__dirname, request.slice(2))
  }

  return originalResolveFilename.call(this, request, parent, isMain, options)
}

const { getPositioningQuestions, getPositioningProductions } =
  require('@/lib/positioning/questions') as typeof import('./lib/positioning/questions')
const { getAttemptSubmissionReadiness } =
  require('@/lib/positioning/submission') as typeof import('./lib/positioning/submission')

let testCount = 0
let passCount = 0
let failCount = 0

function assert(condition: boolean, message: string) {
  testCount += 1
  if (condition) {
    passCount += 1
    console.log(`PASS: ${message}`)
    return
  }

  failCount += 1
  console.log(`FAIL: ${message}`)
}

function createResponses(count: number) {
  return Object.fromEntries(
    getPositioningQuestions()
      .slice(0, count)
      .map((question, index) => [
        question.id,
        {
          answer: question.options[0]?.id || 'A',
          answeredAt: `2026-05-07T10:${String(index).padStart(2, '0')}:00.000Z`,
        },
      ]),
  )
}

function createProductions() {
  return Object.fromEntries(
    getPositioningProductions().map((prompt, index) => [
      prompt.id,
      prompt.kind === 'writing'
        ? {
            promptId: prompt.id,
            kind: prompt.kind,
            responseText: `Completed writing answer ${index + 1}`,
            submittedAt: `2026-05-07T11:${String(index).padStart(2, '0')}:00.000Z`,
          }
        : {
            promptId: prompt.id,
            kind: prompt.kind,
            transcription: `Completed speaking answer ${index + 1}`,
            hasAudio: true,
            submittedAt: `2026-05-07T11:${String(index).padStart(2, '0')}:00.000Z`,
          },
    ]),
  )
}

const questions = getPositioningQuestions()
const productions = getPositioningProductions()

const qcmTimeoutScenario = getAttemptSubmissionReadiness({
  progress: {
    responses: createResponses(29),
    productions: {},
    currentQuestionIndex: 29,
    phase: 'qcm',
    sectionOrder: ['reading', 'listening', 'vocabulary', 'situations'],
    testVersion: 'v2-ai',
  },
  questionIds: questions.map((question) => question.id),
  productions,
})

assert(qcmTimeoutScenario.ready === false, 'une tentative encore en qcm ne peut pas etre completee')
assert(
  qcmTimeoutScenario.isReviewPhase === false,
  'la soumission finale exige explicitement la phase review',
)
assert(
  qcmTimeoutScenario.missingQuestionIds.join(',') === 'situations-6,situations-7,situations-8',
  'les trois questions manquantes d Eliou sont detectees',
)
assert(
  qcmTimeoutScenario.missingProductionIds.length === productions.length,
  'aucune production vide n est consideree comme valide',
)

const completedScenario = getAttemptSubmissionReadiness({
  progress: {
    responses: createResponses(questions.length),
    productions: createProductions(),
    currentQuestionIndex: questions.length - 1,
    phase: 'review',
    sectionOrder: ['reading', 'listening', 'vocabulary', 'situations'],
    testVersion: 'v2-ai',
  },
  questionIds: questions.map((question) => question.id),
  productions,
})

assert(completedScenario.ready === true, 'le submit final reste autorise pour un parcours complet')
assert(completedScenario.missingQuestionIds.length === 0, 'aucune question ne manque dans un parcours complet')
assert(
  completedScenario.missingProductionIds.length === 0,
  'aucune production ne manque dans un parcours complet',
)

const reviewButMissingSpeaking = getAttemptSubmissionReadiness({
  progress: {
    responses: createResponses(questions.length),
    productions: {
      ...createProductions(),
      'speaking-2': {
        promptId: 'speaking-2',
        kind: 'speaking',
        transcription: '',
        hasAudio: false,
        submittedAt: '2026-05-07T11:10:00.000Z',
      },
    },
    currentQuestionIndex: questions.length - 1,
    phase: 'review',
    sectionOrder: ['reading', 'listening', 'vocabulary', 'situations'],
    testVersion: 'v2-ai',
  },
  questionIds: questions.map((question) => question.id),
  productions,
})

assert(
  reviewButMissingSpeaking.ready === false,
  'une production orale vide bloque la completion finale',
)
assert(
  reviewButMissingSpeaking.missingProductionIds.join(',') === 'speaking-2',
  'la production orale vide est la seule bloquante detectee',
)

console.log(`Total: ${testCount}`)
console.log(`Passes: ${passCount}`)
console.log(`Echoues: ${failCount}`)

if (failCount > 0) {
  process.exitCode = 1
}
