// ═══════════════════════════════════════════════════════════════
// TYPES ET CONSTANTES - Application Anglais Hôtelier
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────

export type Level = 'N1' | 'N2' | 'N3';
export type CECRLevel = 'A1' | 'A2' | 'B1';
export type Role = 'RECEPTION' | 'HOUSEKEEPING' | 'RESTAURANT' | 'SECURITY';
export type Dimension = 'COMPREHENSION' | 'PRODUCTION' | 'INTERACTION' | 'CONFLICT';
export type ExerciseSource = 'DUE' | 'ERROR' | 'NEW';
export type TestType = 'INITIAL' | 'FINAL';

export type ExerciseType = 
  | 'TRANSLATE_TO_EN'
  | 'TRANSLATE_TO_FR'
  | 'FILL_BLANK'
  | 'REORDER'
  | 'SITUATION_QCM'
  | 'LISTENING'
  | 'MATCH_PAIRS'
  | 'APPROPRIATE_RESPONSE'
  | 'DICTATION'
  | 'SCENARIO';

// ─────────────────────────────────────────────────────────────────
// CONSTANTES SRS
// ─────────────────────────────────────────────────────────────────

export const SRS_CONFIG = {
  EASE_MIN: 1.30,
  EASE_MAX: 3.00,
  EASE_DEFAULT: 2.50,
  EASE_BONUS_SUCCESS: 0.10,
  EASE_PENALTY_FAILURE: 0.20,
  EASE_PENALTY_TIMEOUT: 0.10,
  
  INTERVAL_MIN: 1,
  INTERVAL_MAX: 365,
  INTERVAL_TIMEOUT_FACTOR: 0.7,
  
  MASTERY_WRITTEN_THRESHOLD: 3,
  MASTERY_ORAL_THRESHOLD: 1,
  MASTERY_LOSS_ERROR_COUNT: 3,
  
  INTERVALS_INITIAL: [1, 3, 7],
} as const;

// ─────────────────────────────────────────────────────────────────
// CONSTANTES SESSION
// ─────────────────────────────────────────────────────────────────

export const SESSION_CONFIG = {
  SIZE_DEFAULT: 12,
  SIZE_MIN: 8,
  SIZE_MAX: 20,
  RATIO_DUE: 0.40,
  RATIO_ERRORS: 0.25,
  RATIO_NEW: 0.35,
  MAX_CONSECUTIVE_SAME_TYPE: 2,
} as const;

// ─────────────────────────────────────────────────────────────────
// CONSTANTES TEST
// ─────────────────────────────────────────────────────────────────

export const TEST_CONFIG = {
  QUESTIONS_TOTAL: 20,
  QUESTIONS_PER_DIMENSION: 4,
  LEVEL_THRESHOLD_N1: 0.40,
  LEVEL_THRESHOLD_N2: 0.70,
  COMPLETION_FOR_FINAL: 0.80,
} as const;

// ─────────────────────────────────────────────────────────────────
// CONSTANTES VALIDATION
// ─────────────────────────────────────────────────────────────────

export const VALIDATION_CONFIG = {
  TEXT_MIN_RATIO: 0.70,
  TEXT_MIN_LENGTH_RATIO: 0.60,
  TIMEOUT_SECONDS: 20,
} as const;

// ─────────────────────────────────────────────────────────────────
// CONSTANTES XP
// ─────────────────────────────────────────────────────────────────

export const XP_CONFIG = {
  CORRECT_NEW: 10,
  CORRECT_DUE: 12,
  CORRECT_ERROR: 15,
  SCENARIO_STEP: 20,
  SESSION_COMPLETE_BONUS: 25,
} as const;

// ─────────────────────────────────────────────────────────────────
// INTERFACES DONNÉES
// ─────────────────────────────────────────────────────────────────

export interface Phrase {
  id: string;
  role: Role;
  actionId: string;
  phraseFr: string;
  phraseEn: string;
  phase: string;
  level: CECRLevel;
  skillId: string;
  wordCount: number;
}

export interface Action {
  id: string;
  role: Role;
  name: string;
  description: string;
  level: CECRLevel;
  isConflict: boolean;
  skillId: string;
}

export interface Skill {
  id: string;
  role: Role;
  name: string;
  description: string;
  dimension: Dimension;
  order: number;
}

export interface ScenarioStep {
  id: string;
  situation: string;
  clientSays?: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    feedback: string;
  }[];
  nextStep: string | null;
}

export interface Scenario {
  id: string;
  role: Role;
  actionId: string;
  title: string;
  type: 'NORMAL' | 'CONFLICT' | 'CONFLICT_ADVANCED';
  level: CECRLevel;
  context: string;
  steps: ScenarioStep[];
  skillIds: string[];
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES UTILISATEUR
// ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  level: Level;
  role: Role | null;
  xp: number;
  streak: number;
  lastSessionAt: number | null;
  placementCompleted: boolean;
  finalTestCompleted: boolean;
  placementDate: number | null;
  finalTestDate: number | null;
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES MÉMOIRE SRS
// ─────────────────────────────────────────────────────────────────

export interface MemoryItem {
  phraseId: string;
  role: Role;
  repsWritten: number;
  repsOral: number;
  ease: number;
  interval: number;
  dueAt: number;
  lastSeen: number | null;
  lastResult: boolean | null;
  errorCount: number;
  mastered: boolean;
}

export interface InteractionResult {
  isCorrect: boolean;
  isOral: boolean;
  isTimeout: boolean;
}

export interface SRSUpdate {
  repsWritten: number;
  repsOral: number;
  ease: number;
  interval: number;
  dueAt: number;
  mastered: boolean;
  errorCount: number;
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES EXERCICES
// ─────────────────────────────────────────────────────────────────

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  source: ExerciseSource;
  instruction: string;
  targets: string[];
}

export interface TranslateExercise extends BaseExercise {
  type: 'TRANSLATE_TO_EN' | 'TRANSLATE_TO_FR';
  prompt: string;
  expectedAnswer: string;
  acceptableVariants: string[];
  minWordCount: number;
}

export interface FillBlankExercise extends BaseExercise {
  type: 'FILL_BLANK';
  prompt: string;
  hint: string;
  expectedAnswer: string;
  wordPosition: number;
}

export interface ReorderExercise extends BaseExercise {
  type: 'REORDER';
  hint: string;
  words: string[];
  expectedOrder: string[];
}

export interface QCMExercise extends BaseExercise {
  type: 'SITUATION_QCM' | 'LISTENING' | 'APPROPRIATE_RESPONSE';
  context?: string;
  prompt?: string;
  audioText?: string;
  clientSays?: string;
  hint?: string;
  options: ExerciseOption[];
  correctId: string;
}

export interface MatchPairsExercise extends BaseExercise {
  type: 'MATCH_PAIRS';
  pairs: {
    id: string;
    fr: string;
    en: string;
  }[];
}

export interface DictationExercise extends BaseExercise {
  type: 'DICTATION';
  audioText: string;
  wordCountHint: number;
  expectedAnswer: string;
}

export interface ScenarioExercise extends BaseExercise {
  type: 'SCENARIO';
  scenario: Scenario;
}

export type Exercise = 
  | TranslateExercise 
  | FillBlankExercise 
  | ReorderExercise 
  | QCMExercise 
  | MatchPairsExercise 
  | DictationExercise
  | ScenarioExercise;

// ─────────────────────────────────────────────────────────────────
// INTERFACES VALIDATION
// ─────────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  correct: boolean;
  processSRS: boolean;
  ratio?: number;
  reason?: 'EMPTY' | 'TOO_SHORT' | 'TIMEOUT';
  missingWords?: string[];
  extraWords?: string[];
}

export interface MatchPairResult {
  phraseId: string;
  correct: boolean;
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES SCORES
// ─────────────────────────────────────────────────────────────────

export interface SkillScore {
  skillId: string;
  testType: TestType;
  score: number;
  maxScore: number;
  testedAt: number;
}

export interface ComparisonReport {
  userId: string;
  role: Role;
  generatedAt: number;
  skills: {
    id: string;
    name: string;
    dimension: Dimension;
    initial: number;
    final: number;
    progression: number;
    status: 'IMPROVED' | 'REGRESSED' | 'STABLE';
  }[];
  summary: {
    averageInitial: number;
    averageFinal: number;
    averageProgression: number;
    skillsImproved: number;
    skillsRegressed: number;
    skillsStable: number;
  };
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES TEST
// ─────────────────────────────────────────────────────────────────

export interface TestQuestion {
  id: string;
  dimension: Dimension;
  level: CECRLevel;
  type: 'QCM' | 'TEXT' | 'ORAL';
  question: string;
  options?: ExerciseOption[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  skillMapping: Record<Role, string>;
  points: number;
  testSet: 'INITIAL' | 'FINAL' | 'BOTH';
}

export interface TestAnswer {
  questionId: string;
  answer: string;
  correct: boolean;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES SESSION
// ─────────────────────────────────────────────────────────────────

export interface SessionLog {
  exerciseId: string;
  type: ExerciseType;
  correct: boolean;
  timestamp: number;
  timeSpent: number;
}

export interface Session {
  id: string;
  role: Role;
  startedAt: number;
  completedAt: number | null;
  exercisesTotal: number;
  exercisesCorrect: number;
  xpEarned: number;
  exerciseLog: SessionLog[];
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES STATS
// ─────────────────────────────────────────────────────────────────

export interface SRSStats {
  total: number;
  mastered: number;
  due: number;
  learning: number;
  new: number;
  recentErrors: number;
}

// ─────────────────────────────────────────────────────────────────
// INTERFACES PROGRESSION GLOBALE
// ─────────────────────────────────────────────────────────────────

export type BadgeCode =
  | 'FIRST_LESSON'
  | 'FIVE_ACTIONS'
  | 'TEN_ACTIONS'
  | 'ALL_ACTIONS'
  | 'METIER_RECEPTION'
  | 'METIER_HOUSEKEEPING'
  | 'METIER_RESTAURANT'
  | 'METIER_SECURITY'
  | 'STREAK_7'
  | 'STREAK_30'
  | 'XP_500'
  | 'XP_2000'
  | 'PERFECT_SCORE'
  | 'CERTIFIED';

export interface BadgeDefinition {
  code: BadgeCode;
  label: string;
  description: string;
  emoji: string;
  category: 'progression' | 'metier' | 'engagement' | 'excellence';
}

export interface UserProgress {
  user_id: string;
  total_xp: number;
  current_level: Level;
  actions_completed: number;
  actions_mastered: number;
  overall_score: number;
  streak: number;
  last_activity_date: string | null;
  badges: BadgeCode[];
  certification_status: 'not_eligible' | 'eligible' | 'certified';
  certified_at: string | null;
  certified_by: string | null;
  updated_at: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

export function getAllowedLevels(level: Level): CECRLevel[] {
  switch (level) {
    case 'N1': return ['A1'];
    case 'N2': return ['A1', 'A2'];
    case 'N3': return ['A1', 'A2', 'B1'];
  }
}

export function calculateLevel(score: number, maxScore: number): Level {
  const ratio = score / maxScore;
  if (ratio < TEST_CONFIG.LEVEL_THRESHOLD_N1) return 'N1';
  if (ratio < TEST_CONFIG.LEVEL_THRESHOLD_N2) return 'N2';
  return 'N3';
}
