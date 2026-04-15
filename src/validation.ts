// ═══════════════════════════════════════════════════════════════
// MODULE VALIDATION - Vérification des réponses
// ═══════════════════════════════════════════════════════════════

import { ValidationResult, VALIDATION_CONFIG } from './types';

// ─────────────────────────────────────────────────────────────────
// NORMALISATION TEXTE
// ─────────────────────────────────────────────────────────────────

interface NormalizeOptions {
  ignoreCase?: boolean;
  ignorePunctuation?: boolean;
  ignoreArticles?: boolean;
}

const DEFAULT_NORMALIZE_OPTIONS: NormalizeOptions = {
  ignoreCase: true,
  ignorePunctuation: true,
  ignoreArticles: true,
};

export function normalize(text: string, options: NormalizeOptions = {}): string {
  const opts = { ...DEFAULT_NORMALIZE_OPTIONS, ...options };
  let result = text;

  if (opts.ignoreCase) {
    result = result.toLowerCase();
  }

  if (opts.ignorePunctuation) {
    result = result.replace(/[.,?!;:'"''""\-–—]/g, '');
  }

  if (opts.ignoreArticles) {
    // Articles anglais et français
    result = result.replace(/\b(a|an|the|le|la|les|un|une|des|l'|d')\b/gi, '');
  }

  // Normaliser espaces
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION RÉPONSE TEXTE
// ─────────────────────────────────────────────────────────────────

export function validateTextAnswer(
  userInput: string,
  expected: string,
  acceptableVariants: string[] = []
): ValidationResult {
  // 1. Pré-validation : réponse non vide
  if (!userInput || userInput.trim().length === 0) {
    return {
      valid: false,
      correct: false,
      processSRS: false,
      reason: 'EMPTY',
    };
  }

  // 2. Normalisation
  const normalizedInput = normalize(userInput);
  const normalizedExpected = normalize(expected);

  // 3. Vérification longueur minimale
  const expectedWords = normalizedExpected.split(' ').filter(w => w.length > 0);
  const inputWords = normalizedInput.split(' ').filter(w => w.length > 0);

  const minWordCount = Math.ceil(expectedWords.length * VALIDATION_CONFIG.TEXT_MIN_LENGTH_RATIO);

  if (inputWords.length < minWordCount) {
    return {
      valid: false,
      correct: false,
      processSRS: false,
      reason: 'TOO_SHORT',
    };
  }

  // 4. Vérification variantes acceptables (match exact après normalisation)
  const allAcceptable = [expected, ...acceptableVariants];
  for (const variant of allAcceptable) {
    if (normalize(variant) === normalizedInput) {
      return {
        valid: true,
        correct: true,
        processSRS: true,
        ratio: 1,
      };
    }
  }

  // 5. Comparaison par mots
  const expectedSet = new Set(expectedWords);
  const inputSet = new Set(inputWords);

  const correctWords = [...expectedSet].filter((word) => inputSet.has(word));
  const missingWords = [...expectedSet].filter((word) => !inputSet.has(word));
  const extraWords = [...inputSet].filter((word) => !expectedSet.has(word));

  const ratio = expectedSet.size > 0 ? correctWords.length / expectedSet.size : 0;
  const isCorrect = ratio >= VALIDATION_CONFIG.TEXT_MIN_RATIO;

  return {
    valid: true,
    correct: isCorrect,
    processSRS: true,
    ratio,
    missingWords,
    extraWords,
  };
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION MOT UNIQUE (FILL_BLANK)
// ─────────────────────────────────────────────────────────────────

export function validateSingleWord(userInput: string, expected: string): ValidationResult {
  if (!userInput || userInput.trim().length === 0) {
    return {
      valid: false,
      correct: false,
      processSRS: false,
      reason: 'EMPTY',
    };
  }

  const normalizedInput = normalize(userInput);
  const normalizedExpected = normalize(expected);

  const isCorrect = normalizedInput === normalizedExpected;

  return {
    valid: true,
    correct: isCorrect,
    processSRS: true,
  };
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION RÉORDONNANCEMENT
// ─────────────────────────────────────────────────────────────────

export function validateReorder(
  userOrder: string[],
  expectedOrder: string[]
): ValidationResult {
  if (!userOrder || userOrder.length === 0) {
    return {
      valid: false,
      correct: false,
      processSRS: false,
      reason: 'EMPTY',
    };
  }

  // Normaliser et comparer
  const normalizedUser = userOrder.map((w) => normalize(w));
  const normalizedExpected = expectedOrder.map((w) => normalize(w));

  const isCorrect =
    normalizedUser.length === normalizedExpected.length &&
    normalizedUser.every((word, index) => word === normalizedExpected[index]);

  return {
    valid: true,
    correct: isCorrect,
    processSRS: true,
  };
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION QCM
// ─────────────────────────────────────────────────────────────────

export function validateQCM(selectedId: string, correctId: string): ValidationResult {
  if (!selectedId) {
    return {
      valid: false,
      correct: false,
      processSRS: false,
      reason: 'EMPTY',
    };
  }

  const isCorrect = selectedId === correctId;

  return {
    valid: true,
    correct: isCorrect,
    processSRS: true,
  };
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION MATCH PAIRS
// ─────────────────────────────────────────────────────────────────

export interface MatchPairValidation {
  pairId: string;
  correct: boolean;
}

export function validateMatchPairs(
  pairs: { id: string; fr: string; en: string }[],
  selections: Record<string, string> // frPairId → selectedEnPairId
): {
  valid: boolean;
  results: MatchPairValidation[];
  score: number;
  processSRS: boolean;
} {
  if (Object.keys(selections).length === 0) {
    return {
      valid: false,
      results: [],
      score: 0,
      processSRS: false,
    };
  }

  const results: MatchPairValidation[] = [];
  let correctCount = 0;

  for (const pair of pairs) {
    const selectedEnId = selections[pair.id];
    const isCorrect = selectedEnId === pair.id;

    if (isCorrect) {
      correctCount++;
    }

    results.push({
      pairId: pair.id,
      correct: isCorrect,
    });
  }

  const score = pairs.length > 0 ? correctCount / pairs.length : 0;

  return {
    valid: true,
    results,
    score,
    processSRS: true,
  };
}

// ─────────────────────────────────────────────────────────────────
// VALIDATION TIMEOUT
// ─────────────────────────────────────────────────────────────────

export function createTimeoutResult(): ValidationResult {
  return {
    valid: true,
    correct: false,
    processSRS: true,
    reason: 'TIMEOUT',
  };
}

// ─────────────────────────────────────────────────────────────────
// LEVENSHTEIN DISTANCE (pour suggestions futures)
// ─────────────────────────────────────────────────────────────────

export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// ─────────────────────────────────────────────────────────────────
// SIMILARITÉ (pour feedback)
// ─────────────────────────────────────────────────────────────────

export function similarity(a: string, b: string): number {
  const normalizedA = normalize(a);
  const normalizedB = normalize(b);

  if (normalizedA === normalizedB) return 1;
  if (normalizedA.length === 0 || normalizedB.length === 0) return 0;

  const distance = levenshteinDistance(normalizedA, normalizedB);
  const maxLength = Math.max(normalizedA.length, normalizedB.length);

  return 1 - distance / maxLength;
}
