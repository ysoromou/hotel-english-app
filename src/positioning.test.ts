// ============================================================
// TESTS - Module Positioning (randomisation + scoring)
// ============================================================

import { seededShuffle } from './lib/positioning/utils'
import { getPositioningQuestions, getPositioningProductions } from './lib/positioning/questions'
import { computeAttemptResult, serializeQuestionBank } from './lib/positioning/scoring'

let passed = 0
let failed = 0
const failures: string[] = []

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1
    console.log(`  OK  ${name}`)
  } else {
    failed += 1
    failures.push(`${name}${detail ? ` -> ${detail}` : ''}`)
    console.log(`  KO  ${name}${detail ? ` -> ${detail}` : ''}`)
  }
}

console.log('\n--- Positioning: structure du test ---')
const questions = getPositioningQuestions()
const productions = getPositioningProductions()
const writings = productions.filter((p) => p.kind === 'writing')
const speakings = productions.filter((p) => p.kind === 'speaking')

const counts = {
  reading: questions.filter((q) => q.section === 'reading').length,
  listening: questions.filter((q) => q.section === 'listening').length,
  vocabulary: questions.filter((q) => q.section === 'vocabulary').length,
  situations: questions.filter((q) => q.section === 'situations').length,
}

check('Reading = 8', counts.reading === 8, `vu: ${counts.reading}`)
check('Listening = 8', counts.listening === 8, `vu: ${counts.listening}`)
check('Vocabulary = 8', counts.vocabulary === 8, `vu: ${counts.vocabulary}`)
check('Situations = 8', counts.situations === 8, `vu: ${counts.situations}`)
check('Writings = 4', writings.length === 4, `vu: ${writings.length}`)
check('Speakings = 2', speakings.length === 2, `vu: ${speakings.length}`)
check(
  'Total epreuves = 38',
  questions.length + productions.length === 38,
  `vu: ${questions.length + productions.length}`,
)

console.log('\n--- Positioning: randomisation des options ---')

// 1. seededShuffle deterministe
const items = ['A', 'B', 'C', 'D']
const a = seededShuffle(items, 'token-1')
const b = seededShuffle(items, 'token-1')
const c = seededShuffle(items, 'token-2')
check('seededShuffle stable pour meme seed', JSON.stringify(a) === JSON.stringify(b))
check(
  'seededShuffle differe selon seed',
  JSON.stringify(a) !== JSON.stringify(c) || JSON.stringify(seededShuffle(items, 'token-3')) !== JSON.stringify(a),
)
check('seededShuffle conserve les memes elements', a.slice().sort().join(',') === items.slice().sort().join(','))

// 2. La randomisation doit varier la position de la bonne reponse au fil
//    des participants. On essaie 50 seeds differents et on verifie que
//    la bonne reponse n'est pas TOUJOURS au meme index.
const positionsCorrect = new Set<number>()
for (let i = 0; i < 50; i += 1) {
  const seed = `participant-${i}`
  const serialized = serializeQuestionBank(questions, seed)
  for (const sq of serialized) {
    const original = questions.find((q) => q.id === sq.id)!
    const index = sq.options.findIndex((o) => o.id === original.correctOptionId)
    positionsCorrect.add(index)
  }
}
check(
  'Les bonnes reponses ne sont pas toutes en position 0 (A)',
  positionsCorrect.size > 1 && positionsCorrect.has(0) === false ? true : positionsCorrect.size > 1,
  `positions vues: ${Array.from(positionsCorrect).sort().join(',')}`,
)
check(
  'Au moins 3 positions differentes utilisees pour la bonne reponse',
  positionsCorrect.size >= 3,
  `positions vues: ${Array.from(positionsCorrect).sort().join(',')}`,
)

// 3. Stabilite session: meme seed = meme ordre aux 2 GET
const serializedFirst = serializeQuestionBank(questions, 'session-X')
const serializedSecond = serializeQuestionBank(questions, 'session-X')
const stable = serializedFirst.every((q, i) =>
  q.options.every((o, j) => o.id === serializedSecond[i].options[j].id),
)
check('Reload = meme ordre pour meme seed', stable)

// 4. Scoring n'utilise PAS la position A/B/C/D mais l'optionId stable
//    Apres shuffle, si l'utilisateur clique l'option dont l'id correspond
//    a correctOptionId, le scoring doit donner 100 %.
const responses: Record<string, { answer: string; answeredAt: string }> = {}
for (const q of questions) {
  responses[q.id] = { answer: q.correctOptionId, answeredAt: new Date().toISOString() }
}
const result = computeAttemptResult(responses)
check('Scoring 100 % quand toutes les bonnes optionId sont selectionnees', result.autoScore === 100)
check(
  `Scoring compte les ${counts.situations} situations`,
  result.sectionScores.find((s) => s.sectionKey === 'situations')?.maxScore === 8,
)

// 5. Scoring ne change PAS si l'option a ete deplacee a une autre position
//    par le shuffle (puisqu'on score par optionId, pas par index).
const responsesShuffled: Record<string, { answer: string; answeredAt: string }> = {}
const serializedForScoring = serializeQuestionBank(questions, 'scoring-seed')
for (const sq of serializedForScoring) {
  const original = questions.find((q) => q.id === sq.id)!
  // Trouver la bonne option dans l'ordre shuffle, recuperer son id stable
  const correctShuffled = sq.options.find((o) => o.id === original.correctOptionId)!
  responsesShuffled[sq.id] = {
    answer: correctShuffled.id,
    answeredAt: new Date().toISOString(),
  }
}
const resultShuffled = computeAttemptResult(responsesShuffled)
check('Scoring 100 % aussi apres shuffle (optionId stable)', resultShuffled.autoScore === 100)

console.log('\n--- Positioning: configuration IA ---')
const configFile = require('./lib/positioning/config') as {
  POSITIONING_AI_MODEL: string
  POSITIONING_AI_MODEL_FALLBACK: string
}
check(
  'AI_MODEL par defaut = qwen/qwen3.6-flash',
  configFile.POSITIONING_AI_MODEL === 'qwen/qwen3.6-flash' ||
    process.env.AI_MODEL === configFile.POSITIONING_AI_MODEL,
  `vu: ${configFile.POSITIONING_AI_MODEL}`,
)
check(
  'Fallback != qwen3.5-flash',
  configFile.POSITIONING_AI_MODEL_FALLBACK !== 'qwen/qwen3.5-flash',
  `vu: ${configFile.POSITIONING_AI_MODEL_FALLBACK}`,
)

console.log(`\n=== Resultats: ${passed} OK, ${failed} KO ===`)
if (failed > 0) {
  console.log('Echecs:')
  for (const f of failures) console.log(' -', f)
  process.exit(1)
}
