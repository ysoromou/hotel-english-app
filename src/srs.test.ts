// ═══════════════════════════════════════════════════════════════
// TESTS UNITAIRES - Module SRS
// ═══════════════════════════════════════════════════════════════

import {
  createMemoryItem,
  calculateSRS,
  processMatchPairs,
  shouldProcessSRS,
  safeCalculateSRS,
  getDueItems,
  getRecentErrors,
  getStats,
} from './srs';
import { MemoryItem, SRS_CONFIG } from './types';

// ─────────────────────────────────────────────────────────────────
// HELPERS DE TEST
// ─────────────────────────────────────────────────────────────────

let testCount = 0;
let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string): void {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`✅ PASS: ${message}`);
  } else {
    failCount++;
    console.log(`❌ FAIL: ${message}`);
  }
}

function assertClose(actual: number, expected: number, tolerance: number, message: string): void {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, `${message} (got ${actual}, expected ${expected})`);
}

// ─────────────────────────────────────────────────────────────────
// TESTS: CRÉATION D'ITEM
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: CRÉATION D\'ITEM');
console.log('═══════════════════════════════════════\n');

function test_createMemoryItem() {
  const item = createMemoryItem('phrase_1', 'RECEPTION');

  assert(item.phraseId === 'phrase_1', 'phraseId correct');
  assert(item.role === 'RECEPTION', 'role correct');
  assert(item.repsWritten === 0, 'repsWritten initial = 0');
  assert(item.repsOral === 0, 'repsOral initial = 0');
  assert(item.ease === SRS_CONFIG.EASE_DEFAULT, 'ease initial = 2.50');
  assert(item.interval === SRS_CONFIG.INTERVAL_MIN, 'interval initial = 1');
  assert(item.mastered === false, 'mastered initial = false');
  assert(item.errorCount === 0, 'errorCount initial = 0');
}

test_createMemoryItem();

// ─────────────────────────────────────────────────────────────────
// TESTS: CALCUL SRS - SUCCÈS
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: CALCUL SRS - SUCCÈS');
console.log('═══════════════════════════════════════\n');

function test_success_written_first() {
  const item = createMemoryItem('p1', 'RECEPTION');
  const result = { isCorrect: true, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.repsWritten === 1, 'Premier succès écrit: repsWritten = 1');
  assert(update.repsOral === 0, 'repsOral reste 0');
  assertClose(update.ease, 2.60, 0.01, 'ease augmente à 2.60');
  assert(update.interval === 1, 'interval = 1 (premier succès)');
  assert(update.mastered === false, 'pas encore maîtrisé');
}

function test_success_written_second() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 1,
    ease: 2.60,
    interval: 1,
  };
  const result = { isCorrect: true, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.repsWritten === 2, 'Deuxième succès: repsWritten = 2');
  assertClose(update.ease, 2.70, 0.01, 'ease = 2.70');
  assert(update.interval === 3, 'interval = 3 (deuxième succès)');
}

function test_success_written_third() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 2,
    ease: 2.70,
    interval: 3,
  };
  const result = { isCorrect: true, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.repsWritten === 3, 'Troisième succès: repsWritten = 3');
  assert(update.interval === 7, 'interval = 7 (troisième succès)');
  assert(update.mastered === false, 'pas maîtrisé (oral manquant)');
}

function test_mastery_achieved() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 3,
    repsOral: 0,
    ease: 2.80,
    interval: 7,
  };
  const result = { isCorrect: true, isOral: true, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.repsOral === 1, 'Succès oral: repsOral = 1');
  assert(update.mastered === true, 'MAÎTRISE ATTEINTE (3 écrits + 1 oral)');
}

test_success_written_first();
test_success_written_second();
test_success_written_third();
test_mastery_achieved();

// ─────────────────────────────────────────────────────────────────
// TESTS: CALCUL SRS - ÉCHEC
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: CALCUL SRS - ÉCHEC');
console.log('═══════════════════════════════════════\n');

function test_failure() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 2,
    ease: 2.70,
    interval: 7,
  };
  const result = { isCorrect: false, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.repsWritten === 1, 'Échec: repsWritten diminue à 1');
  assertClose(update.ease, 2.50, 0.01, 'ease diminue à 2.50');
  assert(update.interval === 1, 'interval reset à 1');
  assert(update.errorCount === 1, 'errorCount = 1');
}

function test_failure_from_zero() {
  const item = createMemoryItem('p1', 'RECEPTION');
  const result = { isCorrect: false, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.repsWritten === 0, 'repsWritten reste 0 (minimum)');
  assert(update.errorCount === 1, 'errorCount = 1');
}

function test_mastery_loss() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 3,
    repsOral: 1,
    mastered: true,
    errorCount: 2,
    ease: 2.80,
    interval: 14,
  };
  const result = { isCorrect: false, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.errorCount === 3, 'errorCount = 3');
  assert(update.mastered === false, 'MAÎTRISE PERDUE après 3 erreurs');
  assert(update.repsWritten === 2, 'repsWritten réduit à 2 (pas reset)');
}

test_failure();
test_failure_from_zero();
test_mastery_loss();

// ─────────────────────────────────────────────────────────────────
// TESTS: CALCUL SRS - TIMEOUT
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: CALCUL SRS - TIMEOUT');
console.log('═══════════════════════════════════════\n');

function test_timeout() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 2,
    ease: 2.70,
    interval: 7,
  };
  const result = { isCorrect: false, isOral: false, isTimeout: true };

  const update = calculateSRS(item, result);

  assert(update.repsWritten === 2, 'TIMEOUT: repsWritten NE CHANGE PAS');
  assertClose(update.ease, 2.60, 0.01, 'ease diminue de 0.10 seulement');
  assert(update.interval === 4, 'interval × 0.7 = 4.9 → 4');
  assert(update.errorCount === 0, 'errorCount NE CHANGE PAS sur timeout');
}

test_timeout();

// ─────────────────────────────────────────────────────────────────
// TESTS: BORNES
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: BORNES');
console.log('═══════════════════════════════════════\n');

function test_ease_floor() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    ease: 1.35,
  };
  const result = { isCorrect: false, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.ease === 1.30, 'ease plancher à 1.30');
}

function test_ease_ceiling() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 5,
    ease: 2.95,
  };
  const result = { isCorrect: true, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.ease === 3.00, 'ease plafond à 3.00');
}

function test_interval_max() {
  const item: MemoryItem = {
    ...createMemoryItem('p1', 'RECEPTION'),
    repsWritten: 10,
    ease: 3.00,
    interval: 200,
  };
  const result = { isCorrect: true, isOral: false, isTimeout: false };

  const update = calculateSRS(item, result);

  assert(update.interval === 365, 'interval plafonné à 365');
}

test_ease_floor();
test_ease_ceiling();
test_interval_max();

// ─────────────────────────────────────────────────────────────────
// TESTS: MULTI-CIBLES (MATCH_PAIRS)
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: MULTI-CIBLES (MATCH_PAIRS)');
console.log('═══════════════════════════════════════\n');

function test_match_pairs_partial() {
  const memory = new Map<string, MemoryItem>([
    ['p1', createMemoryItem('p1', 'RECEPTION')],
    ['p2', createMemoryItem('p2', 'RECEPTION')],
    ['p3', createMemoryItem('p3', 'RECEPTION')],
    ['p4', createMemoryItem('p4', 'RECEPTION')],
  ]);

  const pairs = [
    { id: 'p1', fr: 'Bonjour', en: 'Hello' },
    { id: 'p2', fr: 'Merci', en: 'Thank you' },
    { id: 'p3', fr: 'Au revoir', en: 'Goodbye' },
    { id: 'p4', fr: 'Oui', en: 'Yes' },
  ];

  // 3 correctes, 1 incorrecte
  const selections = {
    p1: 'p1', // correct
    p2: 'p2', // correct
    p3: 'p3', // correct
    p4: 'p1', // INCORRECT
  };

  const result = processMatchPairs(pairs, selections, memory, 'RECEPTION');

  assertClose(result.score, 0.75, 0.01, 'Score = 0.75 (3/4)');

  // Vérifier que p1, p2, p3 progressent
  assert(result.updates.get('p1')?.repsWritten === 1, 'p1 progresse');
  assert(result.updates.get('p2')?.repsWritten === 1, 'p2 progresse');
  assert(result.updates.get('p3')?.repsWritten === 1, 'p3 progresse');

  // p4 ne progresse pas
  assert(result.updates.get('p4')?.repsWritten === 0, 'p4 NE progresse PAS');
  assert(result.updates.get('p4')?.errorCount === 1, 'p4 a erreur');
}

function test_match_pairs_all_correct() {
  const memory = new Map<string, MemoryItem>([
    ['p1', createMemoryItem('p1', 'RECEPTION')],
    ['p2', createMemoryItem('p2', 'RECEPTION')],
  ]);

  const pairs = [
    { id: 'p1', fr: 'Bonjour', en: 'Hello' },
    { id: 'p2', fr: 'Merci', en: 'Thank you' },
  ];

  const selections = { p1: 'p1', p2: 'p2' };

  const result = processMatchPairs(pairs, selections, memory, 'RECEPTION');

  assert(result.score === 1.0, 'Score = 1.0 (toutes correctes)');
  assert(result.updates.get('p1')?.repsWritten === 1, 'p1 progresse');
  assert(result.updates.get('p2')?.repsWritten === 1, 'p2 progresse');
}

function test_match_pairs_all_wrong() {
  const memory = new Map<string, MemoryItem>([
    ['p1', { ...createMemoryItem('p1', 'RECEPTION'), repsWritten: 2 }],
    ['p2', { ...createMemoryItem('p2', 'RECEPTION'), repsWritten: 2 }],
  ]);

  const pairs = [
    { id: 'p1', fr: 'Bonjour', en: 'Hello' },
    { id: 'p2', fr: 'Merci', en: 'Thank you' },
  ];

  // Inversées
  const selections = { p1: 'p2', p2: 'p1' };

  const result = processMatchPairs(pairs, selections, memory, 'RECEPTION');

  assert(result.score === 0, 'Score = 0 (toutes fausses)');
  assert(result.updates.get('p1')?.repsWritten === 1, 'p1 régresse à 1');
  assert(result.updates.get('p2')?.repsWritten === 1, 'p2 régresse à 1');
}

test_match_pairs_partial();
test_match_pairs_all_correct();
test_match_pairs_all_wrong();

// ─────────────────────────────────────────────────────────────────
// TESTS: VALIDATION PRÉ-TRAITEMENT
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: VALIDATION PRÉ-TRAITEMENT');
console.log('═══════════════════════════════════════\n');

function test_should_not_process_empty() {
  assert(shouldProcessSRS('', 5) === false, 'Réponse vide → false');
  assert(shouldProcessSRS('   ', 5) === false, 'Espaces seulement → false');
}

function test_should_not_process_short() {
  // Attendu 5 mots, minimum = 3 (60%)
  assert(shouldProcessSRS('.', 5) === false, 'Un point → false');
  assert(shouldProcessSRS('a', 5) === false, 'Un caractère → false');
  assert(shouldProcessSRS('a b', 5) === false, '2 mots sur 5 → false');
}

function test_should_process_valid() {
  assert(shouldProcessSRS('Good morning sir', 5) === true, '3 mots sur 5 (60%) → true');
  assert(shouldProcessSRS('Good morning welcome', 4) === true, '3 mots sur 4 → true');
}

test_should_not_process_empty();
test_should_not_process_short();
test_should_process_valid();

// ─────────────────────────────────────────────────────────────────
// TESTS: SAFE CALCULATE
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('TESTS: SAFE CALCULATE');
console.log('═══════════════════════════════════════\n');

function test_safe_calculate_creates() {
  const memory = new Map<string, MemoryItem>();
  const result = { isCorrect: true, isOral: false, isTimeout: false };

  const { update, created } = safeCalculateSRS(memory, 'new_phrase', 'RECEPTION', result);

  assert(created === true, 'Item créé');
  assert(update.repsWritten === 1, 'Nouveau item avec succès → reps = 1');
}

function test_safe_calculate_existing() {
  const memory = new Map<string, MemoryItem>([
    ['existing', { ...createMemoryItem('existing', 'RECEPTION'), repsWritten: 2 }],
  ]);
  const result = { isCorrect: true, isOral: false, isTimeout: false };

  const { update, created } = safeCalculateSRS(memory, 'existing', 'RECEPTION', result);

  assert(created === false, 'Item existant');
  assert(update.repsWritten === 3, 'Existant avec succès → reps = 3');
}

test_safe_calculate_creates();
test_safe_calculate_existing();

// ─────────────────────────════════════════════════════════════════
// TESTS: REQUÊTES SRS
// ─────────────────────────────════════════════════════════════════

console.log('\n═══════════════════════════════════════');
console.log('TESTS: REQUÊTES SRS');
console.log('═══════════════════════════════════════\n');

function test_get_due_items() {
  const now = Date.now();
  const memory = new Map<string, MemoryItem>([
    ['p1', { ...createMemoryItem('p1', 'RECEPTION'), dueAt: now - 1000 }], // dû
    ['p2', { ...createMemoryItem('p2', 'RECEPTION'), dueAt: now + 100000 }], // pas dû
    ['p3', { ...createMemoryItem('p3', 'RECEPTION'), dueAt: now - 2000, mastered: true }], // dû mais maîtrisé
    ['p4', { ...createMemoryItem('p4', 'HOUSEKEEPING'), dueAt: now - 1000 }], // autre métier
  ]);

  const due = getDueItems(memory, 'RECEPTION', 10);

  assert(due.length === 1, 'Un seul item dû pour RECEPTION');
  assert(due[0].phraseId === 'p1', 'p1 est dû');
}

function test_get_recent_errors() {
  const now = Date.now();
  const memory = new Map<string, MemoryItem>([
    ['p1', { ...createMemoryItem('p1', 'RECEPTION'), lastResult: false, lastSeen: now - 1000 }],
    ['p2', { ...createMemoryItem('p2', 'RECEPTION'), lastResult: true, lastSeen: now - 1000 }],
    ['p3', { ...createMemoryItem('p3', 'RECEPTION'), lastResult: false, lastSeen: now - 8 * 24 * 60 * 60 * 1000 }], // >7 jours
  ]);

  const errors = getRecentErrors(memory, 'RECEPTION', 10);

  assert(errors.length === 1, 'Une erreur récente');
  assert(errors[0].phraseId === 'p1', 'p1 est erreur récente');
}

function test_get_stats() {
  const now = Date.now();
  const memory = new Map<string, MemoryItem>([
    ['p1', { ...createMemoryItem('p1', 'RECEPTION'), mastered: true }],
    ['p2', { ...createMemoryItem('p2', 'RECEPTION'), repsWritten: 2, dueAt: now - 1000 }],
    ['p3', createMemoryItem('p3', 'RECEPTION')],
    ['p4', { ...createMemoryItem('p4', 'RECEPTION'), lastResult: false, lastSeen: now - 1000 }],
  ]);

  const stats = getStats(memory, 'RECEPTION');

  assert(stats.total === 4, 'Total = 4');
  assert(stats.mastered === 1, 'Maîtrisés = 1');
  assert(stats.learning >= 1, 'En apprentissage >= 1');
  assert(stats.recentErrors === 1, 'Erreurs récentes = 1');
}

test_get_due_items();
test_get_recent_errors();
test_get_stats();

// ─────────────────────────────────────────────────────────────────
// RÉSUMÉ
// ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════');
console.log('RÉSUMÉ DES TESTS');
console.log('═══════════════════════════════════════\n');

console.log(`Total: ${testCount}`);
console.log(`Passés: ${passCount} ✅`);
console.log(`Échoués: ${failCount} ❌`);
console.log(`Taux de réussite: ${Math.round((passCount / testCount) * 100)}%`);

if (failCount === 0) {
  console.log('\n🎉 TOUS LES TESTS PASSENT !');
} else {
  console.log('\n⚠️ CERTAINS TESTS ÉCHOUENT');
}
