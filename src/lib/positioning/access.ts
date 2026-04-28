import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, isAdminClientConfigured } from '@/lib/supabase/admin'
import { getPositioningQuestions } from '@/lib/positioning/questions'
import { ParticipantRow, TestAttemptRow, TestInviteRow } from '@/lib/positioning/types'
import { sha256 } from '@/lib/positioning/utils'

export async function requireManagerPageAccess() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['hr', 'admin'].includes(profile.role)) redirect('/dashboard')

  return { supabase, userId: user.id }
}

export async function getManagerRequestAccess() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { supabase, userId: null, allowed: false }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return {
    supabase,
    userId: user.id,
    allowed: Boolean(profile && ['hr', 'admin'].includes(profile.role)),
  }
}

export async function getPublicInviteContext(token: string) {
  if (!isAdminClientConfigured()) {
    throw new Error('Positioning public runtime is not configured.')
  }

  const admin = createAdminClient()
  const tokenHash = sha256(token)

  const inviteResponse = await admin
    .from('test_invites')
    .select('*')
    .eq('token_hash', tokenHash)
    .maybeSingle()
  const invite = (inviteResponse.data as TestInviteRow | null) ?? null

  if (!invite) return null

  const participantResponse = await admin
    .from('participants')
    .select('*')
    .eq('id', invite.participant_id)
    .single()
  const participant = (participantResponse.data as ParticipantRow | null) ?? null

  if (!participant) return null

  const attemptResponse = await admin
    .from('test_attempts')
    .select('*')
    .eq('participant_id', participant.id)
    .eq('invite_id', invite.id)
    .maybeSingle()
  const attempt = (attemptResponse.data as TestAttemptRow | null) ?? null

  const hasStartedAttempt = Boolean(attempt?.started_at && attempt.status !== 'completed')
  const isExpired = Boolean(
    invite.expires_at &&
      new Date(invite.expires_at).getTime() < Date.now() &&
      invite.status !== 'completed' &&
      attempt?.status !== 'completed' &&
      !hasStartedAttempt,
  )

  return {
    admin,
    tokenHash,
    invite,
    participant,
    attempt,
    questions: getPositioningQuestions(),
    isExpired,
  }
}

export function buildAccessUrl(token: string, origin?: string) {
  const baseUrl = origin || process.env.NEXT_PUBLIC_APP_URL
  if (!baseUrl) {
    throw new Error('Public app URL is not configured.')
  }

  return `${baseUrl.replace(/\/$/, '')}/positioning/${token}`
}
