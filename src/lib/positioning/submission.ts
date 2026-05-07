import {
  AttemptProductionDraft,
  AttemptProgressState,
  PositioningProductionPrompt,
} from '@/lib/positioning/types'

export interface AttemptSubmissionReadiness {
  ready: boolean
  isReviewPhase: boolean
  missingQuestionIds: string[]
  missingProductionIds: string[]
}

function hasMeaningfulWritingDraft(draft: AttemptProductionDraft | undefined) {
  return Boolean(draft?.responseText?.trim())
}

function hasMeaningfulSpeakingDraft(draft: AttemptProductionDraft | undefined) {
  return Boolean(draft?.hasAudio || draft?.transcription?.trim())
}

function hasMeaningfulProductionDraft(
  prompt: PositioningProductionPrompt,
  draft: AttemptProductionDraft | undefined,
) {
  if (prompt.kind === 'writing') return hasMeaningfulWritingDraft(draft)
  return hasMeaningfulSpeakingDraft(draft)
}

export function getAttemptSubmissionReadiness({
  progress,
  questionIds,
  productions,
}: {
  progress: AttemptProgressState
  questionIds: string[]
  productions: PositioningProductionPrompt[]
}): AttemptSubmissionReadiness {
  const responses = progress.responses || {}
  const productionDrafts = progress.productions || {}

  const missingQuestionIds = questionIds.filter((questionId) => {
    const answer = responses[questionId]?.answer
    return typeof answer !== 'string' || answer.trim().length === 0
  })

  const missingProductionIds = productions
    .filter((prompt) => !hasMeaningfulProductionDraft(prompt, productionDrafts[prompt.id]))
    .map((prompt) => prompt.id)

  const isReviewPhase = progress.phase === 'review'

  return {
    ready: isReviewPhase && missingQuestionIds.length === 0 && missingProductionIds.length === 0,
    isReviewPhase,
    missingQuestionIds,
    missingProductionIds,
  }
}
