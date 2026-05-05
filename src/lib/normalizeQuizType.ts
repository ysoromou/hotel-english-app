// Mappe les type_quiz de la base de données vers des types canoniques
// pour que chaque type affiche un exercice visuellement distinct

export type CanonicalQuizType =
  | 'MCQ_STANDARD'
  | 'TRANSLATION_ACTIVE'
  | 'LISTEN_AND_SELECT'
  | 'LISTEN_AND_SPEAK'
  | 'ORDER_SEQUENCE'
  | 'MATCH_TRANSLATION'
  | 'TONE_CHECK'
  | 'SITUATION_BEST_RESPONSE'

export function normalizeQuizType(typeQuiz: string): CanonicalQuizType {
  switch (typeQuiz.toUpperCase()) {
    case 'QCM':
    case 'MULTIPLE_CHOICE':
      return 'MCQ_STANDARD'

    case 'TRADUCTION':
    case 'TRANSLATION_ACTIVE':
      return 'TRANSLATION_ACTIVE'

    case 'LISTEN_AND_SELECT':
      return 'LISTEN_AND_SELECT'

    case 'LISTEN_AND_SPEAK':
      return 'LISTEN_AND_SPEAK'

    case 'ORDER_SEQUENCE':
      return 'ORDER_SEQUENCE'

    case 'MATCH_TRANSLATION':
      return 'MATCH_TRANSLATION'

    case 'MCQ_TONE':
    case 'MCQ_POLICY':
      return 'TONE_CHECK'

    case 'SITUATION':
    case 'CONFLIT':
      return 'SITUATION_BEST_RESPONSE'

    default:
      return 'MCQ_STANDARD'
  }
}

// Labels affichés selon le type canonique
export const QUIZ_TYPE_LABELS: Record<CanonicalQuizType, { tag: string; heading: string }> = {
  MCQ_STANDARD:            { tag: 'QCM',              heading: 'Choisissez la bonne réponse' },
  TRANSLATION_ACTIVE:      { tag: 'Traduction',       heading: 'Meilleure traduction' },
  LISTEN_AND_SELECT:       { tag: 'Écoute',           heading: 'Qu\'avez-vous entendu ?' },
  LISTEN_AND_SPEAK:        { tag: 'Écoute & répétition', heading: 'Écoutez puis reformulez la phrase' },
  ORDER_SEQUENCE:          { tag: 'Remise en ordre',   heading: 'Remettez les étapes dans l\'ordre' },
  MATCH_TRANSLATION:       { tag: 'Association',      heading: 'Associez chaque terme à sa traduction' },
  TONE_CHECK:              { tag: 'Ton & politesse',   heading: 'Laquelle est plus polie ?' },
  SITUATION_BEST_RESPONSE: { tag: 'Mise en situation', heading: 'Meilleure réponse' },
}
