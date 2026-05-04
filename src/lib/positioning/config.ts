import { ImportFieldDefinition, LevelRule, PositioningSectionKey } from '@/lib/positioning/types'

export const POSITIONING_TEST_VERSION = 'v2-ai'
export const POSITIONING_DURATION_MINUTES = 45
export const POSITIONING_LINK_EXPIRY_HOURS = 168
export const POSITIONING_DEFAULT_DEADLINE_DAYS = 7
export const POSITIONING_DEFAULT_GROUP_SIZE = 8

export const POSITIONING_SECTION_ORDER: PositioningSectionKey[] = [
  'reading',
  'listening',
  'vocabulary',
  'situations',
]

export const POSITIONING_AUTO_WEIGHT = 0.6
export const POSITIONING_WRITING_WEIGHT = 0.2
export const POSITIONING_SPEAKING_WEIGHT = 0.2

export const POSITIONING_AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter'
export const POSITIONING_AI_MODEL = process.env.AI_MODEL || 'qwen/qwen3.6-flash'
export const POSITIONING_AI_MODEL_FALLBACK = 'qwen/qwen3.6-flash'

export const POSITIONING_IMPORT_FIELDS: ImportFieldDefinition[] = [
  { key: 'hotel', label: 'Hotel', required: true },
  { key: 'organization', label: 'Organisation / entite' },
  { key: 'first_name', label: 'Prenom', required: true },
  { key: 'last_name', label: 'Nom', required: true },
  { key: 'full_name', label: 'Nom complet' },
  { key: 'phone', label: 'Telephone', required: true },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Service' },
  { key: 'external_ref', label: 'Reference externe' },
]

export const POSITIONING_LEVEL_RULES: LevelRule[] = [
  { key: 'A1', label: 'Debutant', minScore: 0, maxScore: 39, recommendedGroupPrefix: 'Groupe A1' },
  { key: 'A2', label: 'Elementaire', minScore: 40, maxScore: 59, recommendedGroupPrefix: 'Groupe A2' },
  { key: 'B1', label: 'Intermediaire', minScore: 60, maxScore: 79, recommendedGroupPrefix: 'Groupe B1' },
  { key: 'B2', label: 'Intermediaire superieur', minScore: 80, maxScore: 100, recommendedGroupPrefix: 'Groupe B2' },
]

export const IMPORT_HEADER_SYNONYMS: Record<string, string[]> = {
  hotel: ['hotel', 'hôtel', 'etablissement', 'établissement', 'site', 'property'],
  organization: ['organisation', 'organization', 'societe', 'société', 'company', 'entity', 'entite', 'groupe'],
  first_name: ['prenom', 'prénom', 'first name', 'firstname', 'given name'],
  last_name: ['nom', 'last name', 'lastname', 'surname', 'family name'],
  full_name: ['nom complet', 'full name', 'name', 'participant', 'employee'],
  phone: ['telephone', 'téléphone', 'phone', 'mobile', 'whatsapp', 'numero', 'numéro'],
  email: ['email', 'e-mail', 'mail', 'courriel'],
  department: ['department', 'departement', 'département', 'service', 'team'],
  external_ref: ['reference', 'référence', 'matricule', 'external ref', 'external_ref', 'id'],
}
