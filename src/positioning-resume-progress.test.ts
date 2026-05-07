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

const {
  getFirstIncompleteProductionIndex,
  hasSavedProductionDraft,
} = require('@/lib/positioning/resume-progress') as typeof import('./lib/positioning/resume-progress')

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

assert(
  hasSavedProductionDraft({
    promptId: 'writing-1',
    kind: 'writing',
    responseText: 'This is a valid saved answer.',
    submittedAt: '2026-05-07T00:00:00.000Z',
  }),
  'une production ecrite avec texte reste consideree comme sauvegardee',
)

assert(
  !hasSavedProductionDraft({
    promptId: 'writing-1',
    kind: 'writing',
    responseText: '   ',
    submittedAt: '2026-05-07T00:00:00.000Z',
  }),
  'une production ecrite vide n est pas consideree comme complete',
)

assert(
  hasSavedProductionDraft({
    promptId: 'speaking-1',
    kind: 'speaking',
    hasAudio: true,
    submittedAt: '2026-05-07T00:00:00.000Z',
  }),
  'une production orale avec audio reste consideree comme sauvegardee',
)

const writingPrompts = [
  { id: 'writing-1' },
  { id: 'writing-2' },
  { id: 'writing-3' },
  { id: 'writing-4' },
]

const writingProductions = {
  'writing-1': {
    promptId: 'writing-1',
    kind: 'writing',
    responseText: 'Saved answer 1',
    submittedAt: '2026-05-07T00:00:00.000Z',
  },
  'writing-2': {
    promptId: 'writing-2',
    kind: 'writing',
    responseText: 'Saved answer 2',
    submittedAt: '2026-05-07T00:00:00.000Z',
  },
  'writing-3': {
    promptId: 'writing-3',
    kind: 'writing',
    responseText: 'Saved answer 3',
    submittedAt: '2026-05-07T00:00:00.000Z',
  },
}

assert(
  getFirstIncompleteProductionIndex(writingPrompts, writingProductions) === 3,
  'la reprise ecrite repart sur la premiere production manquante',
)

const speakingPrompts = [{ id: 'speaking-1' }, { id: 'speaking-2' }]
const speakingProductions = {
  'speaking-1': {
    promptId: 'speaking-1',
    kind: 'speaking',
    transcription: 'Saved transcription',
    submittedAt: '2026-05-07T00:00:00.000Z',
  },
}

assert(
  getFirstIncompleteProductionIndex(speakingPrompts, speakingProductions) === 1,
  'la reprise orale repart sur la premiere production manquante',
)

assert(
  getFirstIncompleteProductionIndex(writingPrompts, {}) === 0,
  'sans production sauvegardee la reprise repart du premier prompt',
)

assert(
  getFirstIncompleteProductionIndex(
    speakingPrompts,
    {
      'speaking-1': {
        promptId: 'speaking-1',
        kind: 'speaking',
        hasAudio: true,
        submittedAt: '2026-05-07T00:00:00.000Z',
      },
      'speaking-2': {
        promptId: 'speaking-2',
        kind: 'speaking',
        transcription: 'Saved transcription',
        submittedAt: '2026-05-07T00:00:00.000Z',
      },
    },
  ) === 0,
  'si toutes les productions sont deja presentes, l index de reprise reste stable',
)

console.log(`Total: ${testCount}`)
console.log(`Passes: ${passCount}`)
console.log(`Echoues: ${failCount}`)

if (failCount > 0) {
  process.exitCode = 1
}
