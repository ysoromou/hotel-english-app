// ═══════════════════════════════════════════════════════════════
// MODULE SRS - Spaced Repetition System
// ═══════════════════════════════════════════════════════════════

import {
  MemoryItem,
  InteractionResult,
  SRSUpdate,
  SRSStats,
  Role,
  SRS_CONFIG,
  VALIDATION_CONFIG,
} from './types';

// ─────────────────────────────────────────────────────────────────
// CRÉATION D'UN ITEM MÉMOIRE
// ─────────────────────────────────────────────────────────────────

export function createMemoryItem(phraseId: string, role: Role): MemoryItem {
  return {
    phraseId,
    role,
    repsWritten: 0,
    repsOral: 0,
    ease: SRS_CONFIG.EASE_DEFAULT,
    interval: SRS_CONFIG.INTERVAL_MIN,
    dueAt: Date.now(),
    lastSeen: null,
    lastResult: null,
    errorCount: 0,
    mastered: false,
  };
}

// ─────────────────────────────────────────────────────────────────
// CALCUL SRS PRINCIPAL
// ─────────────────────────────────────────────────────────────────

export function calculateSRS(current: MemoryItem, result: InteractionResult): SRSUpdate {
  let repsWritten = current.repsWritten;
  let repsOral = current.repsOral;
  let ease = current.ease;
  let interval = current.interval;
  let errorCount = current.errorCount;

  // ════════════════════════════════════════
  // CAS 1: TIMEOUT (mode stress)
  // Pénalité RÉDUITE
  // ════════════════════════════════════════
  if (result.isTimeout) {
    ease = Math.max(SRS_CONFIG.EASE_MIN, ease - SRS_CONFIG.EASE_PENALTY_TIMEOUT);
    interval = Math.max(
      SRS_CONFIG.INTERVAL_MIN,
      Math.floor(interval * SRS_CONFIG.INTERVAL_TIMEOUT_FACTOR)
    );
    // NE PAS modifier reps ni errorCount
  }

  // ════════════════════════════════════════
  // CAS 2: RÉPONSE CORRECTE
  // ════════════════════════════════════════
  else if (result.isCorrect) {
    // Incrémenter le compteur approprié
    if (result.isOral) {
      repsOral += 1;
    } else {
      repsWritten += 1;
    }

    // Augmenter ease (plafonné)
    ease = Math.min(SRS_CONFIG.EASE_MAX, ease + SRS_CONFIG.EASE_BONUS_SUCCESS);

    // Calculer nouvel intervalle
    const totalReps = repsWritten + repsOral;

    if (totalReps <= SRS_CONFIG.INTERVALS_INITIAL.length) {
      interval = SRS_CONFIG.INTERVALS_INITIAL[totalReps - 1];
    } else {
      interval = Math.round(interval * ease);
    }

    // Plafonner intervalle
    interval = Math.min(SRS_CONFIG.INTERVAL_MAX, interval);
  }

  // ════════════════════════════════════════
  // CAS 3: RÉPONSE INCORRECTE
  // ════════════════════════════════════════
  else {
    // Décrémenter le compteur approprié (minimum 0)
    if (result.isOral) {
      repsOral = Math.max(0, repsOral - 1);
    } else {
      repsWritten = Math.max(0, repsWritten - 1);
    }

    // Diminuer ease
    ease = Math.max(SRS_CONFIG.EASE_MIN, ease - SRS_CONFIG.EASE_PENALTY_FAILURE);

    // Reset intervalle
    interval = SRS_CONFIG.INTERVAL_MIN;

    // Incrémenter erreurs
    errorCount += 1;
  }

  // ════════════════════════════════════════
  // CALCUL DATE PROCHAINE RÉVISION
  // ════════════════════════════════════════
  const dueAt = Date.now() + interval * 24 * 60 * 60 * 1000;

  // ════════════════════════════════════════
  // VÉRIFICATION MAÎTRISE
  // ════════════════════════════════════════
  let mastered =
    repsWritten >= SRS_CONFIG.MASTERY_WRITTEN_THRESHOLD &&
    repsOral >= SRS_CONFIG.MASTERY_ORAL_THRESHOLD;

  // Perte de maîtrise si trop d'erreurs
  if (mastered && errorCount >= SRS_CONFIG.MASTERY_LOSS_ERROR_COUNT) {
    mastered = false;
    repsWritten = Math.min(repsWritten, SRS_CONFIG.MASTERY_WRITTEN_THRESHOLD - 1);
  }

  return {
    repsWritten,
    repsOral,
    ease,
    interval,
    dueAt,
    mastered,
    errorCount,
  };
}

// ─────────────────────────────────────────────────────────────────
// APPLICATION DE LA MISE À JOUR
// ─────────────────────────────────────────────────────────────────

export function applyUpdate(
  current: MemoryItem,
  update: SRSUpdate,
  result: InteractionResult
): MemoryItem {
  return {
    ...current,
    ...update,
    lastSeen: Date.now(),
    lastResult: result.isCorrect,
  };
}

// ─────────────────────────────────────────────────────────────────
// GESTION MULTI-CIBLES (MATCH_PAIRS)
// ─────────────────────────────────────────────────────────────────

interface MatchPair {
  id: string;
  fr: string;
  en: string;
}

interface MatchPairsResult {
  updates: Map<string, SRSUpdate>;
  score: number;
  details: { phraseId: string; correct: boolean }[];
}

export function processMatchPairs(
  pairs: MatchPair[],
  selections: Record<string, string>, // frPhraseId → selectedEnPhraseId
  memory: Map<string, MemoryItem>,
  role: Role
): MatchPairsResult {
  const updates = new Map<string, SRSUpdate>();
  const details: { phraseId: string; correct: boolean }[] = [];
  let correctCount = 0;

  for (const pair of pairs) {
    // Vérifier si CETTE paire est correcte
    const selectedEnId = selections[pair.id];
    const isCorrect = selectedEnId === pair.id;

    if (isCorrect) {
      correctCount++;
    }

    details.push({ phraseId: pair.id, correct: isCorrect });

    // Récupérer ou créer état actuel
    let currentItem = memory.get(pair.id);
    if (!currentItem) {
      currentItem = createMemoryItem(pair.id, role);
    }

    // Calculer mise à jour pour CET item uniquement
    const result: InteractionResult = {
      isCorrect,
      isOral: false,
      isTimeout: false,
    };

    const update = calculateSRS(currentItem, result);
    updates.set(pair.id, update);
  }

  const score = pairs.length > 0 ? correctCount / pairs.length : 0;

  return { updates, score, details };
}

// ─────────────────────────────────────────────────────────────────
// GESTION MULTI-CIBLES GÉNÉRIQUE
// ─────────────────────────────────────────────────────────────────

interface TargetEvaluation {
  phraseId: string;
  isCorrect: boolean;
}

export function processMultiTarget(
  evaluations: TargetEvaluation[],
  memory: Map<string, MemoryItem>,
  role: Role,
  isOral: boolean = false
): Map<string, SRSUpdate> {
  const updates = new Map<string, SRSUpdate>();

  for (const evaluation of evaluations) {
    let currentItem = memory.get(evaluation.phraseId);
    if (!currentItem) {
      currentItem = createMemoryItem(evaluation.phraseId, role);
    }

    const result: InteractionResult = {
      isCorrect: evaluation.isCorrect,
      isOral,
      isTimeout: false,
    };

    const update = calculateSRS(currentItem, result);
    updates.set(evaluation.phraseId, update);
  }

  return updates;
}

// ─────────────────────────────────────────────────────────────────
// VÉRIFICATION PRÉ-TRAITEMENT SRS
// ─────────────────────────────────────────────────────────────────

export function shouldProcessSRS(userInput: string, expectedWordCount: number): boolean {
  if (!userInput || userInput.trim().length === 0) {
    return false;
  }

  const inputWords = userInput.trim().split(/\s+/).length;
  const minWords = Math.ceil(expectedWordCount * VALIDATION_CONFIG.TEXT_MIN_LENGTH_RATIO);

  if (inputWords < minWords) {
    return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────
// SAFE CALCULATE (création auto si item non existant)
// ─────────────────────────────────────────────────────────────────

export function safeCalculateSRS(
  memory: Map<string, MemoryItem>,
  phraseId: string,
  role: Role,
  result: InteractionResult
): { update: SRSUpdate; created: boolean; newItem?: MemoryItem } {
  let item = memory.get(phraseId);
  let created = false;

  if (!item) {
    item = createMemoryItem(phraseId, role);
    created = true;
  }

  const update = calculateSRS(item, result);

  return { update, created, newItem: created ? item : undefined };
}

// ─────────────────────────────────────────────────────────────────
// REQUÊTES SRS
// ─────────────────────────────────────────────────────────────────

export function getDueItems(
  memory: Map<string, MemoryItem>,
  role: Role,
  limit: number = 10
): MemoryItem[] {
  const now = Date.now();

  return Array.from(memory.values())
    .filter((item) => item.role === role && item.dueAt <= now && !item.mastered)
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, limit);
}

export function getRecentErrors(
  memory: Map<string, MemoryItem>,
  role: Role,
  limit: number = 5
): MemoryItem[] {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return Array.from(memory.values())
    .filter(
      (item) =>
        item.role === role &&
        item.lastResult === false &&
        item.lastSeen !== null &&
        item.lastSeen > sevenDaysAgo
    )
    .sort((a, b) => {
      if (b.errorCount !== a.errorCount) {
        return b.errorCount - a.errorCount;
      }
      return (b.lastSeen || 0) - (a.lastSeen || 0);
    })
    .slice(0, limit);
}

export function getMasteredCount(memory: Map<string, MemoryItem>, role: Role): number {
  return Array.from(memory.values()).filter((item) => item.role === role && item.mastered)
    .length;
}

export function getStats(memory: Map<string, MemoryItem>, role: Role): SRSStats {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const items = Array.from(memory.values()).filter((item) => item.role === role);

  return {
    total: items.length,
    mastered: items.filter((i) => i.mastered).length,
    due: items.filter((i) => i.dueAt <= now && !i.mastered).length,
    learning: items.filter(
      (i) => (i.repsWritten > 0 || i.repsOral > 0) && !i.mastered
    ).length,
    new: items.filter((i) => i.repsWritten === 0 && i.repsOral === 0).length,
    recentErrors: items.filter(
      (i) => i.lastResult === false && i.lastSeen && i.lastSeen > sevenDaysAgo
    ).length,
  };
}

// ─────────────────────────────────────────────────────────────────
// GESTION MÉMOIRE PAR MÉTIER
// ─────────────────────────────────────────────────────────────────

export function getMemoryKey(userId: string, phraseId: string, role: Role): string {
  return `${userId}_${phraseId}_${role}`;
}

export function getMemoryForRole(
  allMemory: Map<string, MemoryItem>,
  role: Role
): Map<string, MemoryItem> {
  const roleMemory = new Map<string, MemoryItem>();

  for (const [key, item] of allMemory) {
    if (item.role === role) {
      roleMemory.set(item.phraseId, item);
    }
  }

  return roleMemory;
}

// ─────────────────────────────────────────────────────────────────
// CLAMP VALUES (sécurité)
// ─────────────────────────────────────────────────────────────────

export function clampSRSValues(update: SRSUpdate): SRSUpdate {
  return {
    ...update,
    ease: Math.max(SRS_CONFIG.EASE_MIN, Math.min(SRS_CONFIG.EASE_MAX, update.ease)),
    interval: Math.max(
      SRS_CONFIG.INTERVAL_MIN,
      Math.min(SRS_CONFIG.INTERVAL_MAX, update.interval)
    ),
    repsWritten: Math.max(0, update.repsWritten),
    repsOral: Math.max(0, update.repsOral),
    errorCount: Math.max(0, update.errorCount),
  };
}
