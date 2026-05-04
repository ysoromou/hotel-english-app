import type { CompetenceId } from '@/lib/positioning/competences'

export type PositioningSectionKey = 'reading' | 'listening' | 'vocabulary' | 'situations'
export type PositioningProductionKind = 'writing' | 'speaking'
export type PositioningMetier = 'reception' | 'housekeeping' | 'restaurant' | 'security'

export type PositioningLevelKey = 'A1' | 'A2' | 'B1' | 'B2'

export type PositioningInviteStatus =
  | 'not_sent'
  | 'sent'
  | 'opened'
  | 'started'
  | 'completed'
  | 'expired'

export type PositioningAttemptStatus = 'not_started' | 'in_progress' | 'completed' | 'expired'

export type PositioningAiStatus =
  | 'ia_validated'
  | 'needs_trainer_review'
  | 'trainer_corrected'
  | 'audio_unusable'
  | 'missing_answer'

export interface PositioningQuestionOption {
  id: string
  text: string
}

export interface PositioningQuestion {
  id: string
  section: PositioningSectionKey
  prompt: string
  promptAudio?: string
  audioUrl?: string
  level: PositioningLevelKey
  type: 'mcq'
  options: PositioningQuestionOption[]
  correctOptionId: string
  competences: CompetenceId[]
  metier: PositioningMetier
}

export interface PositioningProductionPrompt {
  id: string
  kind: PositioningProductionKind
  level: PositioningLevelKey
  metier: PositioningMetier
  competences: CompetenceId[]
  context: string
  task: string
  guidance?: string
}

export interface LevelRule {
  key: PositioningLevelKey
  label: string
  minScore: number
  maxScore: number
  recommendedGroupPrefix: string
}

export interface ImportFieldDefinition {
  key:
    | 'hotel'
    | 'organization'
    | 'first_name'
    | 'last_name'
    | 'full_name'
    | 'phone'
    | 'email'
    | 'department'
    | 'external_ref'
  label: string
  required?: boolean
}

export type ImportMapping = Record<string, string>

export interface ImportPreviewRow {
  rowNumber: number
  values: Record<string, string>
  normalized: {
    hotel: string
    organization: string | null
    first_name: string
    last_name: string
    phone: string
    normalized_phone: string | null
    email: string | null
    department: string | null
    external_ref: string | null
  }
  errors: string[]
  duplicateReasons: string[]
}

export interface ImportPreviewSummary {
  totalRows: number
  validRows: number
  duplicateRows: number
  invalidRows: number
  importableRows: number
}

export interface ParticipantRow {
  id: string
  hotel: string
  organization: string | null
  first_name: string
  last_name: string
  full_name: string
  phone: string
  normalized_phone: string | null
  email: string | null
  department: string | null
  external_ref: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface TestInviteRow {
  id: string
  participant_id: string
  token_hash: string | null
  expires_at: string | null
  deadline_at: string | null
  status: PositioningInviteStatus
  sent_at: string | null
  opened_at: string | null
  started_at: string | null
  completed_at: string | null
  last_reminder_at: string | null
  access_version: number
  created_at: string
  updated_at: string
}

export interface TestAttemptRow {
  id: string
  participant_id: string
  invite_id: string
  status: PositioningAttemptStatus
  started_at: string | null
  submitted_at: string | null
  completed_at: string | null
  total_score: number | null
  estimated_level: string | null
  recommended_group: string | null
  duration_seconds: number | null
  device_info: Record<string, unknown> | null
  anomalies_json: unknown[] | null
  raw_result_json: Record<string, unknown> | null
  auto_score: number | null
  writing_score: number | null
  speaking_score: number | null
  provisional_score: number | null
  ai_status: PositioningAiStatus | null
  strong_competences: CompetenceId[] | null
  weak_competences: CompetenceId[] | null
  created_at: string
  updated_at: string
}

export interface TestSectionResultRow {
  id: string
  attempt_id: string
  section_key: PositioningSectionKey
  score: number
  max_score: number
  details_json: Record<string, unknown> | null
  created_at: string
}

export interface TestProductionRow {
  id: string
  attempt_id: string
  participant_id: string
  prompt_id: string
  kind: PositioningProductionKind
  response_text: string | null
  transcription: string | null
  has_audio: boolean
  ai_score: number | null
  ai_level: string | null
  ai_competences: CompetenceId[] | null
  ai_errors: string[] | null
  ai_justification: string | null
  ai_confidence: string | null
  ai_status: PositioningAiStatus
  trainer_score: number | null
  trainer_note: string | null
  raw_ai_response: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface OutboundMessageRow {
  id: string
  participant_id: string
  invite_id: string | null
  channel: string
  destination: string
  message_body: string
  provider: string
  message_kind: string
  status: 'queued' | 'prepared' | 'sent' | 'failed'
  provider_message_id: string | null
  provider_payload: Record<string, unknown> | null
  sent_at: string | null
  error_message: string | null
  created_at: string
}

export interface GroupRecommendationRow {
  id: string
  participant_id: string
  attempt_id: string | null
  recommended_group: string
  rationale: string | null
  created_at: string
  updated_at: string
}

export interface AttemptResponsesMap {
  [questionId: string]: {
    answer: string
    answeredAt: string
  }
}

export interface AttemptProductionDraft {
  promptId: string
  kind: PositioningProductionKind
  responseText?: string
  transcription?: string
  hasAudio?: boolean
  durationSeconds?: number
  submittedAt: string
}

export interface AttemptProgressState {
  responses: AttemptResponsesMap
  productions: Record<string, AttemptProductionDraft>
  currentQuestionIndex: number
  phase: 'qcm' | 'writing' | 'speaking' | 'review'
  sectionOrder: PositioningSectionKey[]
  testVersion: string
}

export interface SectionScore {
  sectionKey: PositioningSectionKey
  score: number
  maxScore: number
  percentage: number
}

export interface ComputedAttemptResult {
  totalCorrect: number
  totalQuestions: number
  autoScore: number
  level: PositioningLevelKey
  levelLabel: string
  recommendedGroupBase: string
  sectionScores: SectionScore[]
  competenceCoverage: Record<CompetenceId, { hits: number; misses: number; attempts: number }>
  anomalies: string[]
}

export interface MessageDispatchResult {
  provider: string
  status: 'prepared' | 'sent' | 'failed'
  destination: string
  deliveryUrl?: string
  providerMessageId?: string
  errorMessage?: string
}
