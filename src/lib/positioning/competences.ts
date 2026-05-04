export const COMPETENCE_IDS = [
  'accueillir_client',
  'comprendre_demande',
  'repondre_demande',
  'donner_information',
  'orienter_client',
  'verifier_information',
  'reformuler_confirmer',
  'gerer_reclamation',
  'proposer_solution',
  'gerer_situation_difficile',
  'utiliser_vocabulaire_metier',
  'maintenir_echange_fluide',
  'gerer_appel',
  'conclure_interaction',
  'dire_non_professionnellement',
] as const

export type CompetenceId = (typeof COMPETENCE_IDS)[number]

export const COMPETENCE_LABELS: Record<CompetenceId, string> = {
  accueillir_client: 'Accueillir un client en anglais',
  comprendre_demande: 'Comprendre une demande simple a l\'oral',
  repondre_demande: 'Repondre a une demande simple',
  donner_information: 'Donner une information claire',
  orienter_client: 'Orienter un client ou indiquer une direction',
  verifier_information: 'Verifier une information ou une demande',
  reformuler_confirmer: 'Reformuler pour valider la comprehension',
  gerer_reclamation: 'Gerer une reclamation simple',
  proposer_solution: 'Proposer une solution adaptee',
  gerer_situation_difficile: 'Gerer une situation difficile ou une incomprehension',
  utiliser_vocabulaire_metier: 'Utiliser le vocabulaire metier adapte en situation',
  maintenir_echange_fluide: 'Maintenir un echange fluide avec le client',
  gerer_appel: 'Gerer un echange telephonique simple',
  conclure_interaction: 'Cloturer un echange de maniere professionnelle',
  dire_non_professionnellement: 'Refuser / poser une limite de facon professionnelle',
}

export const CRITICAL_COMPETENCES: CompetenceId[] = [
  'comprendre_demande',
  'repondre_demande',
  'donner_information',
  'reformuler_confirmer',
  'gerer_reclamation',
  'proposer_solution',
  'utiliser_vocabulaire_metier',
  'maintenir_echange_fluide',
  'gerer_appel',
  'conclure_interaction',
  'dire_non_professionnellement',
]
