import {
  POSITIONING_AUTO_WEIGHT,
  POSITIONING_LEVEL_RULES,
  POSITIONING_SPEAKING_WEIGHT,
  POSITIONING_WRITING_WEIGHT,
} from '@/lib/positioning/config'
import { COMPETENCE_IDS, CompetenceId } from '@/lib/positioning/competences'
import { getPositioningQuestions } from '@/lib/positioning/questions'
import { seededShuffle } from '@/lib/positioning/utils'
import {
  AttemptResponsesMap,
  ComputedAttemptResult,
  PositioningLevelKey,
  PositioningQuestion,
} from '@/lib/positioning/types'

function getLevelRule(score: number) {
  return (
    POSITIONING_LEVEL_RULES.find((rule) => score >= rule.minScore && score <= rule.maxScore) ??
    POSITIONING_LEVEL_RULES[0]
  )
}

export function computeAttemptResult(responses: AttemptResponsesMap): ComputedAttemptResult {
  const questions = getPositioningQuestions()
  const sectionBuckets = new Map<string, { score: number; maxScore: number; answered: number }>()
  const competenceCoverage = Object.fromEntries(
    COMPETENCE_IDS.map((id) => [id, { hits: 0, misses: 0, attempts: 0 }]),
  ) as Record<CompetenceId, { hits: number; misses: number; attempts: number }>
  const anomalies: string[] = []
  let totalCorrect = 0

  for (const question of questions) {
    const bucket = sectionBuckets.get(question.section) ?? { score: 0, maxScore: 0, answered: 0 }
    bucket.maxScore += 1

    const response = responses[question.id]
    let isCorrect = false
    if (response?.answer) {
      bucket.answered += 1
      if (response.answer === question.correctOptionId) {
        bucket.score += 1
        totalCorrect += 1
        isCorrect = true
      }
    }

    if (response?.answer) {
      for (const competence of question.competences) {
        competenceCoverage[competence].attempts += 1
        if (isCorrect) competenceCoverage[competence].hits += 1
        else competenceCoverage[competence].misses += 1
      }
    }

    sectionBuckets.set(question.section, bucket)
  }

  const totalQuestions = questions.length
  const autoScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const levelRule = getLevelRule(autoScore)

  const sectionScores = Array.from(sectionBuckets.entries()).map(([sectionKey, bucket]) => {
    if (bucket.answered === 0) {
      anomalies.push(`Section ${sectionKey} sans reponse enregistree.`)
    }

    return {
      sectionKey: sectionKey as ComputedAttemptResult['sectionScores'][number]['sectionKey'],
      score: bucket.score,
      maxScore: bucket.maxScore,
      percentage: bucket.maxScore > 0 ? Math.round((bucket.score / bucket.maxScore) * 100) : 0,
    }
  })

  return {
    totalCorrect,
    totalQuestions,
    autoScore,
    level: levelRule.key,
    levelLabel: levelRule.label,
    recommendedGroupBase: levelRule.recommendedGroupPrefix,
    sectionScores,
    competenceCoverage,
    anomalies,
  }
}

export interface ProvisionalScoreInput {
  autoScore: number | null
  writingScore: number | null
  speakingScore: number | null
}

export interface ProvisionalScoreOutput {
  provisional: number
  level: PositioningLevelKey
  levelLabel: string
  recommendedGroupBase: string
}

export function computeProvisionalScore(input: ProvisionalScoreInput): ProvisionalScoreOutput {
  const auto = input.autoScore ?? 0
  const writing = input.writingScore ?? 0
  const speaking = input.speakingScore ?? 0

  const totalWeight =
    (input.autoScore !== null ? POSITIONING_AUTO_WEIGHT : 0) +
    (input.writingScore !== null ? POSITIONING_WRITING_WEIGHT : 0) +
    (input.speakingScore !== null ? POSITIONING_SPEAKING_WEIGHT : 0)

  const weightedSum =
    (input.autoScore !== null ? auto * POSITIONING_AUTO_WEIGHT : 0) +
    (input.writingScore !== null ? writing * POSITIONING_WRITING_WEIGHT : 0) +
    (input.speakingScore !== null ? speaking * POSITIONING_SPEAKING_WEIGHT : 0)

  const provisional = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0
  const rule = getLevelRule(provisional)

  return {
    provisional,
    level: rule.key,
    levelLabel: rule.label,
    recommendedGroupBase: rule.recommendedGroupPrefix,
  }
}

export function deriveCompetenceVerdict(
  coverage: Record<CompetenceId, { hits: number; misses: number; attempts: number }>,
  productionCompetences: { strong: CompetenceId[]; weak: CompetenceId[] },
) {
  const strong = new Set<CompetenceId>(productionCompetences.strong)
  const weak = new Set<CompetenceId>(productionCompetences.weak)

  for (const id of COMPETENCE_IDS) {
    const stat = coverage[id]
    if (stat.attempts === 0) continue
    const ratio = stat.hits / stat.attempts
    if (ratio >= 0.75) strong.add(id)
    else if (ratio <= 0.34) weak.add(id)
  }

  return {
    strong: Array.from(strong),
    weak: Array.from(weak),
  }
}

export function getLevelMeta(levelKey: string | null): { key: PositioningLevelKey; label: string; groupPrefix: string } {
  const fallback = POSITIONING_LEVEL_RULES[0]
  const rule = POSITIONING_LEVEL_RULES.find((item) => item.key === levelKey) ?? fallback
  return {
    key: rule.key,
    label: rule.label,
    groupPrefix: rule.recommendedGroupPrefix,
  }
}

export function buildRecommendedGroupLabel(
  levelKey: string | null,
  index: number,
  totalGroups: number,
) {
  const meta = getLevelMeta(levelKey)
  const suffix = String(index + 1).padStart(2, '0')
  return totalGroups > 1 ? `${meta.groupPrefix} ${suffix}` : meta.groupPrefix
}

export function serializeQuestionBank(questions: PositioningQuestion[], shuffleSeed?: string) {
  return questions.map((question) => ({
    id: question.id,
    section: question.section,
    prompt: question.prompt,
    requiresAudio: Boolean(question.promptAudio || question.audioUrl),
    options: shuffleSeed
      ? seededShuffle(question.options, `${shuffleSeed}::${question.id}`)
      : question.options,
  }))
}
