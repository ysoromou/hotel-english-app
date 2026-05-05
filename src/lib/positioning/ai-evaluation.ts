import {
  POSITIONING_AI_MODEL,
  POSITIONING_AI_MODEL_FALLBACK,
  POSITIONING_AI_PROVIDER,
} from '@/lib/positioning/config'
import { COMPETENCE_IDS, CompetenceId } from '@/lib/positioning/competences'
import { getPositioningProductions } from '@/lib/positioning/questions'
import {
  PositioningAiStatus,
  PositioningProductionPrompt,
} from '@/lib/positioning/types'

export interface AiEvaluationInput {
  prompt: PositioningProductionPrompt
  responseText?: string | null
  transcription?: string | null
  hasAudio?: boolean
}

export interface AiEvaluationResult {
  ai_score: number | null
  ai_level: string | null
  ai_competences: CompetenceId[]
  ai_errors: string[]
  ai_justification: string | null
  ai_confidence: 'high' | 'medium' | 'low' | null
  ai_status: PositioningAiStatus
  raw_ai_response: Record<string, unknown> | null
}

export function isAiConfigured() {
  return Boolean(process.env.OPENROUTER_API_KEY)
}

export interface AiBlockReport {
  blocked: true
  reason: string
  unblockAction: string
}

export function getAiBlockReport(): AiBlockReport | null {
  if (isAiConfigured()) return null
  return {
    blocked: true,
    reason: 'OPENROUTER_API_KEY absent. Aucune evaluation IA possible pour writing/speaking.',
    unblockAction:
      'Ajouter OPENROUTER_API_KEY dans .env.local (avec AI_PROVIDER=openrouter et AI_MODEL=qwen/qwen3.6-flash) puis redemarrer le serveur Next.js.',
  }
}

const SYSTEM_PROMPT = `You are a strict English-as-a-foreign-language evaluator for a hotel-industry positioning test (CEFR A1 to B2). Output ONLY valid compact JSON. No prose. No markdown. No code fences. Schema:
{
  "ai_score": integer 0..100,
  "ai_level": "A1"|"A2"|"B1"|"B2",
  "ai_competences": string[] (subset of provided competence ids actually demonstrated),
  "ai_errors": string[] (max 3 short bullet phrases),
  "ai_justification": string (1 to 2 short sentences in French, factual),
  "ai_confidence": "high"|"medium"|"low"
}
Be honest and lenient on accent and minor grammar; reward task completion, hotel vocabulary, professional tone, and clarity. If the response is empty, off-topic, or unintelligible, return ai_score 0 and ai_confidence "low".`

function buildUserPrompt(input: AiEvaluationInput) {
  const { prompt, responseText, transcription } = input
  const candidateText = (transcription || responseText || '').trim()
  return [
    `Kind: ${prompt.kind}`,
    `CEFR target: ${prompt.level}`,
    `Metier: ${prompt.metier}`,
    `Competence ids to consider: ${prompt.competences.join(', ')}`,
    `Allowed competence ids (return ONLY ids from this list): ${COMPETENCE_IDS.join(', ')}`,
    `Task given to candidate: ${prompt.task}`,
    `Context: ${prompt.context}`,
    '---',
    candidateText
      ? `Candidate response:\n${candidateText}`
      : '(Candidate response is empty or missing)',
    '---',
    'Return ONLY the JSON object.',
  ].join('\n')
}

function fallbackEvaluation(reason: string, status: PositioningAiStatus): AiEvaluationResult {
  return {
    ai_score: null,
    ai_level: null,
    ai_competences: [],
    ai_errors: [reason],
    ai_justification: reason,
    ai_confidence: null,
    ai_status: status,
    raw_ai_response: null,
  }
}

function parseAiJson(text: string): Record<string, unknown> | null {
  if (!text) return null
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    return JSON.parse(trimmed) as Record<string, unknown>
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0]) as Record<string, unknown>
    } catch {
      return null
    }
  }
}

function clampScore(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return Math.max(0, Math.min(100, Math.round(value)))
}

function normalizeCompetences(value: unknown): CompetenceId[] {
  if (!Array.isArray(value)) return []
  const allowed = new Set<string>(COMPETENCE_IDS as readonly string[])
  return value
    .filter((item): item is string => typeof item === 'string' && allowed.has(item))
    .map((item) => item as CompetenceId)
}

function normalizeErrors(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .slice(0, 3)
    .map((item) => item.trim().slice(0, 200))
}

function normalizeLevel(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const upper = value.toUpperCase()
  return ['A1', 'A2', 'B1', 'B2'].includes(upper) ? upper : null
}

function normalizeConfidence(value: unknown): 'high' | 'medium' | 'low' | null {
  if (value === 'high' || value === 'medium' || value === 'low') return value
  return null
}

const OPENROUTER_TIMEOUT_MS = Number(process.env.AI_REQUEST_TIMEOUT_MS || 60_000)
const EXPECTED_PRODUCTION_COUNTS = getPositioningProductions().reduce(
  (acc, prompt) => {
    acc[prompt.kind] += 1
    return acc
  },
  { writing: 0, speaking: 0 } as Record<'writing' | 'speaking', number>,
)
const HARD_BLOCKING_STATUSES = new Set<PositioningAiStatus>([
  'audio_unusable',
  'missing_answer',
  'ai_error',
])

function getUsableProductionScore(production: {
  ai_score: number | null
  trainer_score?: number | null
  ai_status: PositioningAiStatus
}) {
  if (
    production.ai_status === 'trainer_corrected' &&
    typeof production.trainer_score === 'number'
  ) {
    return production.trainer_score
  }

  return typeof production.ai_score === 'number' ? production.ai_score : null
}

async function callOpenRouter(model: string, userPrompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured.')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://caformac.local',
        'X-Title': 'CAFORMAC Positioning',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 400,
        response_format: { type: 'json_object' },
      }),
    })
  } catch (error) {
    clearTimeout(timer)
    if ((error as Error).name === 'AbortError') {
      throw new Error(`OpenRouter timeout (${OPENROUTER_TIMEOUT_MS}ms) on model ${model}.`)
    }
    throw error
  }
  clearTimeout(timer)

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    const lower = text.toLowerCase()
    const isInvalidModel =
      response.status === 400 &&
      (lower.includes('not a valid model') || lower.includes('invalid model'))
    const friendly = isInvalidModel
      ? `Modele IA invalide (${model}). Verifier AI_MODEL dans .env / Vercel.`
      : `OpenRouter ${response.status}: ${text.slice(0, 200)}`
    console.error('[positioning][openrouter] model=%s status=%s body=%s', model, response.status, text.slice(0, 500))
    throw new Error(friendly)
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = json.choices?.[0]?.message?.content || ''
  return { content, raw: json as Record<string, unknown> }
}

export async function evaluateProduction(input: AiEvaluationInput): Promise<AiEvaluationResult> {
  const candidateText = (input.transcription || input.responseText || '').trim()

  if (!candidateText) {
    if (input.prompt.kind === 'speaking' && input.hasAudio) {
      return fallbackEvaluation('Aucune transcription exploitable.', 'audio_unusable')
    }
    return fallbackEvaluation('Reponse manquante.', 'missing_answer')
  }

  if (POSITIONING_AI_PROVIDER !== 'openrouter') {
    return fallbackEvaluation(
      `Provider IA non supporte: ${POSITIONING_AI_PROVIDER}.`,
      'ai_error',
    )
  }

  if (!isAiConfigured()) {
    return fallbackEvaluation(
      'OPENROUTER_API_KEY absent: evaluation manuelle requise.',
      'ai_error',
    )
  }

  const userPrompt = buildUserPrompt(input)
  const modelsToTry = Array.from(
    new Set([POSITIONING_AI_MODEL, POSITIONING_AI_MODEL_FALLBACK].filter(Boolean)),
  )

  let lastError: Error | null = null
  for (const model of modelsToTry) {
    try {
      const { content, raw } = await callOpenRouter(model as string, userPrompt)
      const parsed = parseAiJson(content)
      if (!parsed) {
        lastError = new Error('Reponse IA non parseable.')
        continue
      }

      const score = clampScore(parsed.ai_score)
      if (score === null) {
        lastError = new Error('Score IA absent ou invalide.')
        continue
      }
      const level = normalizeLevel(parsed.ai_level)
      const competences = normalizeCompetences(parsed.ai_competences)
      const errors = normalizeErrors(parsed.ai_errors)
      const justification =
        typeof parsed.ai_justification === 'string'
          ? parsed.ai_justification.trim().slice(0, 400)
          : null
      const confidence = normalizeConfidence(parsed.ai_confidence)

      const status: PositioningAiStatus =
        confidence && confidence !== 'low' ? 'ia_validated' : 'needs_trainer_review'

      return {
        ai_score: score,
        ai_level: level,
        ai_competences: competences,
        ai_errors: errors,
        ai_justification: justification,
        ai_confidence: confidence,
        ai_status: status,
        raw_ai_response: raw,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }

  return fallbackEvaluation(
    `Evaluation IA indisponible: ${lastError?.message || 'erreur inconnue'}.`,
    'ai_error',
  )
}

export function aggregateProductionScores(productions: Array<{
  kind: 'writing' | 'speaking'
  ai_score: number | null
  trainer_score?: number | null
  ai_status: PositioningAiStatus
  ai_competences: CompetenceId[] | null
  ai_level: string | null
}>) {
  const writingRows = productions.filter((p) => p.kind === 'writing')
  const speakingRows = productions.filter((p) => p.kind === 'speaking')

  function computeSectionAverage(rows: typeof productions) {
    const usableScores = rows.map(getUsableProductionScore)
    const hasAllScores =
      rows.length > 0 &&
      usableScores.length === rows.length &&
      usableScores.every((score): score is number => typeof score === 'number')

    return hasAllScores
      ? Math.round(usableScores.reduce((sum, score) => sum + score, 0) / usableScores.length)
      : null
  }

  const writingScore =
    writingRows.length === EXPECTED_PRODUCTION_COUNTS.writing
      ? computeSectionAverage(writingRows)
      : null
  const speakingScore =
    speakingRows.length === EXPECTED_PRODUCTION_COUNTS.speaking
      ? computeSectionAverage(speakingRows)
      : null

  const strong = new Set<CompetenceId>()
  const weak = new Set<CompetenceId>()

  for (const production of productions) {
    const resolvedScore = getUsableProductionScore(production)
    if (typeof resolvedScore !== 'number') continue
    const isStrong = resolvedScore >= 70
    const isWeak = resolvedScore <= 39
    for (const competence of production.ai_competences || []) {
      if (isStrong) strong.add(competence)
      if (isWeak) weak.add(competence)
    }
  }

  const needsReview = productions.some((p) => p.ai_status === 'needs_trainer_review')
  const hardBlockingStatus =
    productions.find(
      (production) =>
        HARD_BLOCKING_STATUSES.has(production.ai_status) &&
        getUsableProductionScore(production) === null,
    )?.ai_status ??
    (writingScore === null || speakingScore === null ? 'ai_error' : null)

  const overallStatus: PositioningAiStatus =
    hardBlockingStatus ??
    (productions.some((production) => production.ai_status === 'trainer_corrected')
      ? 'trainer_corrected'
      : needsReview
        ? 'needs_trainer_review'
        : 'ia_validated')

  return {
    writingScore,
    speakingScore,
    strongFromProductions: Array.from(strong),
    weakFromProductions: Array.from(weak),
    needsReview,
    hasBlockingIssue: writingScore === null || speakingScore === null,
    overallStatus,
  }
}
