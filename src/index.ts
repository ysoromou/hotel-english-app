// ═══════════════════════════════════════════════════════════════
// INDEX - Point d'entrée de l'application
// ═══════════════════════════════════════════════════════════════

// Types
export * from './types';

// SRS
export {
  createMemoryItem,
  calculateSRS,
  applyUpdate,
  processMatchPairs,
  processMultiTarget,
  shouldProcessSRS,
  safeCalculateSRS,
  getDueItems,
  getRecentErrors,
  getMasteredCount,
  getStats,
  getMemoryKey,
  getMemoryForRole,
  clampSRSValues,
} from './srs';

// Validation
export {
  normalize,
  validateTextAnswer,
  validateSingleWord,
  validateReorder,
  validateQCM,
  validateMatchPairs,
  createTimeoutResult,
  levenshteinDistance,
  similarity,
} from './validation';

// Session
export {
  generateSession,
  calculateXP,
  calculateSessionBonus,
} from './session';

// Scoring
export {
  calculateSkillProgressScore,
  evaluateTest,
  saveSkillScores,
  getSkillScores,
  generateComparisonReport,
  checkFinalTestEligibility,
  calculateGlobalStats,
  generateCSVReport,
} from './scoring';
