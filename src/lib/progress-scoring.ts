import { XP_CONFIG } from '../types'
import type { Level } from '../types'

// ═══════════════════════════════════════════════════════════════
// Fonctions pures de calcul de progression
// Pas de dépendance Supabase — testable unitairement
// ═══════════════════════════════════════════════════════════════

// Type minimal pour une action_progress (ce qu'on lit de la DB)
export interface ActionProgressRow {
  action_id: string
  phrases_completed: number
  phrases_total: number
  quiz_score_avg: number
  quiz_attempts: number
  scenario_completed: boolean
  scenario_score: number | null
  statut: 'not_started' | 'in_progress' | 'completed' | 'mastered'
}

// Type minimal pour une session (ce qu'on lit de la DB)
export interface SessionRow {
  score_session: number | null
  exercises_completed: number
  start_time: string
}

// Résultat du calcul global
export interface ProgressUpdate {
  total_xp: number
  current_level: Level
  actions_completed: number
  actions_mastered: number
  overall_score: number
  streak: number
}

// ── Score moyen pondéré ──
// 40% phrases, 40% quiz, 20% scénario
export function calculateOverallScore(actions: ActionProgressRow[]): number {
  if (actions.length === 0) return 0

  let phraseScoreSum = 0
  let quizScoreSum = 0
  let scenarioScoreSum = 0
  let phraseCount = 0
  let quizCount = 0
  let scenarioCount = 0

  for (const a of actions) {
    // Score phrases : ratio complétées / total
    if (a.phrases_total > 0) {
      phraseScoreSum += (a.phrases_completed / a.phrases_total) * 100
      phraseCount++
    }
    // Score quiz
    if (a.quiz_attempts > 0) {
      quizScoreSum += a.quiz_score_avg
      quizCount++
    }
    // Score scénario
    if (a.scenario_completed && a.scenario_score !== null) {
      scenarioScoreSum += a.scenario_score
      scenarioCount++
    }
  }

  const phraseAvg = phraseCount > 0 ? phraseScoreSum / phraseCount : 0
  const quizAvg = quizCount > 0 ? quizScoreSum / quizCount : 0
  const scenarioAvg = scenarioCount > 0 ? scenarioScoreSum / scenarioCount : 0

  // Pondération : si une catégorie n'a pas de données, on redistribue
  let totalWeight = 0
  let weightedSum = 0

  if (phraseCount > 0) { weightedSum += phraseAvg * 40; totalWeight += 40 }
  if (quizCount > 0) { weightedSum += quizAvg * 40; totalWeight += 40 }
  if (scenarioCount > 0) { weightedSum += scenarioAvg * 20; totalWeight += 20 }

  if (totalWeight === 0) return 0
  return Math.round((weightedSum / totalWeight) * 100) / 100
}

// ── XP total ──
// Basé sur les exercices complétés et les sessions terminées
export function calculateTotalXP(actions: ActionProgressRow[], sessions: SessionRow[]): number {
  let xp = 0

  // XP des phrases complétées (CORRECT_NEW par phrase)
  for (const a of actions) {
    xp += a.phrases_completed * XP_CONFIG.CORRECT_NEW
  }

  // XP des quiz réussis
  for (const a of actions) {
    if (a.quiz_attempts > 0) {
      const correctQuizzes = Math.round(a.quiz_attempts * (a.quiz_score_avg / 100))
      xp += correctQuizzes * XP_CONFIG.CORRECT_DUE
    }
  }

  // XP des scénarios complétés
  for (const a of actions) {
    if (a.scenario_completed) {
      xp += XP_CONFIG.SCENARIO_STEP
    }
  }

  // Bonus de session complète
  xp += sessions.length * XP_CONFIG.SESSION_COMPLETE_BONUS

  return xp
}

// ── Niveau courant ──
// N1 si score < 40%, N2 si < 70%, N3 sinon
export function calculateCurrentLevel(score: number): Level {
  if (score < 40) return 'N1'
  if (score < 70) return 'N2'
  return 'N3'
}

// ── Streak (jours consécutifs) ──
export function calculateStreak(
  lastActivityDate: string | null,
  currentStreak: number
): number {
  if (!lastActivityDate) return 1 // Première activité

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastDate = new Date(lastActivityDate)
  lastDate.setHours(0, 0, 0, 0)

  const diffMs = today.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return currentStreak       // Même jour
  if (diffDays === 1) return currentStreak + 1    // Jour suivant
  return 1                                         // Streak cassé
}

// ── Comptage actions ──
export function countActions(actions: ActionProgressRow[]): { completed: number; mastered: number } {
  let completed = 0
  let mastered = 0

  for (const a of actions) {
    if (a.statut === 'completed' || a.statut === 'mastered') completed++
    if (a.statut === 'mastered') mastered++
  }

  return { completed, mastered }
}

// ── Fonction principale ──
// Assemble tous les calculs en un seul objet de mise à jour
export function computeProgressUpdate(
  actions: ActionProgressRow[],
  sessions: SessionRow[],
  currentStreak: number,
  lastActivityDate: string | null
): ProgressUpdate {
  const overall_score = calculateOverallScore(actions)
  const total_xp = calculateTotalXP(actions, sessions)
  const current_level = calculateCurrentLevel(overall_score)
  const streak = calculateStreak(lastActivityDate, currentStreak)
  const { completed, mastered } = countActions(actions)

  return {
    total_xp,
    current_level,
    actions_completed: completed,
    actions_mastered: mastered,
    overall_score,
    streak,
  }
}
