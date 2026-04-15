import type { BadgeDefinition } from './types'

// Catalogue des 14 badges disponibles dans l'application
// Chaque badge a un code unique, un label FR, une description, un emoji et une catégorie

export const BADGE_CATALOG: BadgeDefinition[] = [
  // ── Progression ──
  {
    code: 'FIRST_LESSON',
    label: 'Première leçon',
    description: 'Compléter sa première leçon',
    emoji: '🎯',
    category: 'progression',
  },
  {
    code: 'FIVE_ACTIONS',
    label: '5 actions',
    description: 'Compléter 5 actions',
    emoji: '⭐',
    category: 'progression',
  },
  {
    code: 'TEN_ACTIONS',
    label: '10 actions',
    description: 'Compléter 10 actions',
    emoji: '🌟',
    category: 'progression',
  },
  {
    code: 'ALL_ACTIONS',
    label: 'Toutes les actions',
    description: 'Compléter les 20 actions',
    emoji: '🏆',
    category: 'progression',
  },

  // ── Métiers ──
  {
    code: 'METIER_RECEPTION',
    label: 'Réception',
    description: 'Compléter toutes les actions Réception',
    emoji: '🛎️',
    category: 'metier',
  },
  {
    code: 'METIER_HOUSEKEEPING',
    label: 'Housekeeping',
    description: 'Compléter toutes les actions Housekeeping',
    emoji: '🧹',
    category: 'metier',
  },
  {
    code: 'METIER_RESTAURANT',
    label: 'Restaurant',
    description: 'Compléter toutes les actions Restaurant',
    emoji: '🍽️',
    category: 'metier',
  },
  {
    code: 'METIER_SECURITY',
    label: 'Sécurité',
    description: 'Compléter toutes les actions Sécurité',
    emoji: '🔒',
    category: 'metier',
  },

  // ── Engagement ──
  {
    code: 'STREAK_7',
    label: '7 jours',
    description: '7 jours consécutifs de pratique',
    emoji: '🔥',
    category: 'engagement',
  },
  {
    code: 'STREAK_30',
    label: '30 jours',
    description: '30 jours consécutifs de pratique',
    emoji: '💎',
    category: 'engagement',
  },
  {
    code: 'XP_500',
    label: '500 XP',
    description: 'Accumuler 500 points d\'expérience',
    emoji: '📈',
    category: 'engagement',
  },
  {
    code: 'XP_2000',
    label: '2000 XP',
    description: 'Accumuler 2000 points d\'expérience',
    emoji: '🚀',
    category: 'engagement',
  },

  // ── Excellence ──
  {
    code: 'PERFECT_SCORE',
    label: 'Score parfait',
    description: 'Obtenir 100% sur une leçon',
    emoji: '💯',
    category: 'excellence',
  },
  {
    code: 'CERTIFIED',
    label: 'Certifié',
    description: 'Certification validée par un évaluateur RH',
    emoji: '🎓',
    category: 'excellence',
  },
]
