import { POSITIONING_LEVEL_RULES } from '@/lib/positioning/config'
import { getPositioningQuestions } from '@/lib/positioning/questions'
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
  const anomalies: string[] = []
  let totalCorrect = 0

  for (const question of questions) {
    const bucket = sectionBuckets.get(question.section) ?? { score: 0, maxScore: 0, answered: 0 }
    bucket.maxScore += 1

    const response = responses[question.id]
    if (response?.answer) {
      bucket.answered += 1
      if (response.answer === question.correctOptionId) {
        bucket.score += 1
        totalCorrect += 1
      }
    }

    sectionBuckets.set(question.section, bucket)
  }

  const totalQuestions = questions.length
  const totalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const levelRule = getLevelRule(totalScore)

  const sectionScores = Array.from(sectionBuckets.entries()).map(([sectionKey, bucket]) => {
    if (bucket.answered === 0) {
      anomalies.push(`Section ${sectionKey} sans réponse enregistrée.`)
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
    totalScore,
    level: levelRule.key,
    levelLabel: levelRule.label,
    recommendedGroupBase: levelRule.recommendedGroupPrefix,
    sectionScores,
    anomalies,
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

export function serializeQuestionBank(questions: PositioningQuestion[]) {
  return questions.map((question) => ({
    id: question.id,
    section: question.section,
    prompt: question.prompt,
    promptAudio: question.promptAudio ?? null,
    audioUrl: question.audioUrl ?? null,
    options: question.options,
  }))
}
