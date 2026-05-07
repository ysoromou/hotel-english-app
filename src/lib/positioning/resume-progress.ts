import type { AttemptProductionDraft } from '@/lib/positioning/types'

type ResumePromptLike = {
  id: string
}

function hasMeaningfulText(value: string | undefined) {
  return Boolean(value?.trim())
}

export function hasSavedProductionDraft(draft?: AttemptProductionDraft | null) {
  if (!draft) return false

  if (draft.kind === 'writing') {
    return hasMeaningfulText(draft.responseText)
  }

  return Boolean(draft.hasAudio) || hasMeaningfulText(draft.transcription)
}

export function getFirstIncompleteProductionIndex(
  prompts: ResumePromptLike[],
  productions: Record<string, AttemptProductionDraft>,
) {
  const firstIncompleteIndex = prompts.findIndex(
    (prompt) => !hasSavedProductionDraft(productions[prompt.id]),
  )

  return firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex
}
