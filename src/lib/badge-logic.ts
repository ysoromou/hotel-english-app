import type { BadgeCode } from '../types'
import type { ActionProgressRow, ProgressUpdate } from './progress-scoring'

// ═══════════════════════════════════════════════════════════════
// Logique d'attribution des badges — fonctions pures
// ═══════════════════════════════════════════════════════════════

// Préfixes métier pour les badges par métier
const METIER_PREFIXES: Record<string, BadgeCode> = {
  'REC_': 'METIER_RECEPTION',
  'HK_': 'METIER_HOUSEKEEPING',
  'REST_': 'METIER_RESTAURANT',
  'SEC_': 'METIER_SECURITY',
}

// 5 actions par métier
const ACTIONS_PER_METIER = 5

// Vérifie chaque condition et retourne la liste mise à jour des badges
export function checkAndAwardBadges(
  actions: ActionProgressRow[],
  progress: ProgressUpdate,
  existingBadges: BadgeCode[]
): BadgeCode[] {
  const badges = new Set<BadgeCode>(existingBadges)

  // ── Progression ──

  // FIRST_LESSON : au moins 1 action complétée
  if (progress.actions_completed >= 1) {
    badges.add('FIRST_LESSON')
  }

  // FIVE_ACTIONS : 5 actions complétées
  if (progress.actions_completed >= 5) {
    badges.add('FIVE_ACTIONS')
  }

  // TEN_ACTIONS : 10 actions complétées
  if (progress.actions_completed >= 10) {
    badges.add('TEN_ACTIONS')
  }

  // ALL_ACTIONS : 20 actions complétées (toutes)
  if (progress.actions_completed >= 20) {
    badges.add('ALL_ACTIONS')
  }

  // ── Métiers ──
  // Un badge par métier quand les 5 actions du métier sont complétées
  for (const [prefix, badgeCode] of Object.entries(METIER_PREFIXES)) {
    const metierActions = actions.filter(a => a.action_id.startsWith(prefix))
    const completedInMetier = metierActions.filter(
      a => a.statut === 'completed' || a.statut === 'mastered'
    ).length
    if (completedInMetier >= ACTIONS_PER_METIER) {
      badges.add(badgeCode)
    }
  }

  // ── Engagement ──

  // STREAK_7 : 7 jours consécutifs
  if (progress.streak >= 7) {
    badges.add('STREAK_7')
  }

  // STREAK_30 : 30 jours consécutifs
  if (progress.streak >= 30) {
    badges.add('STREAK_30')
  }

  // XP_500 : 500 XP accumulés
  if (progress.total_xp >= 500) {
    badges.add('XP_500')
  }

  // XP_2000 : 2000 XP accumulés
  if (progress.total_xp >= 2000) {
    badges.add('XP_2000')
  }

  // ── Excellence ──

  // PERFECT_SCORE : score global de 100%
  if (progress.overall_score >= 100) {
    badges.add('PERFECT_SCORE')
  }

  // Note : CERTIFIED est attribué uniquement par le endpoint /api/stats/certify

  return Array.from(badges)
}

// Vérifie si un apprenant est éligible à la certification
// Condition : 20 actions mastered
export function checkCertificationEligibility(actions: ActionProgressRow[]): boolean {
  const masteredCount = actions.filter(a => a.statut === 'mastered').length
  return masteredCount >= 20
}
