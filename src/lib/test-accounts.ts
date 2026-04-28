const KNOWN_TEST_LOCAL_PARTS = new Set([
  'test-verify',
  'hermes.test',
  'proof.learner',
  'codex.visual',
])

export function isInternalTestAccountEmail(email: string | null | undefined) {
  if (!email) return false

  const normalized = email.trim().toLowerCase()
  const [localPart = '', domain = ''] = normalized.split('@')

  if (!localPart) return false
  if (KNOWN_TEST_LOCAL_PARTS.has(localPart)) return true
  if (domain === 'example.com' || domain === 'example.org') return true

  return Array.from(KNOWN_TEST_LOCAL_PARTS).some(
    (marker) => localPart === marker || localPart.startsWith(`${marker}+`),
  )
}

export function splitVisibleLearners<T extends { email: string }>(learners: T[]) {
  const visibleLearners: T[] = []
  let hiddenTestAccountsCount = 0

  for (const learner of learners) {
    if (isInternalTestAccountEmail(learner.email)) {
      hiddenTestAccountsCount += 1
    } else {
      visibleLearners.push(learner)
    }
  }

  return { visibleLearners, hiddenTestAccountsCount }
}
