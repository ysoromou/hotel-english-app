import { createHash, randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, isAdminClientConfigured } from '@/lib/supabase/admin'
import { ONLINE_QUESTIONS_BANK } from '@/lib/testOnlineData'

const TEST_DURATION_SECONDS = 45 * 60
const PUBLIC_SESSION_COOKIE = 'test_online_public_session'
const PUBLIC_SESSION_MAX_AGE_SECONDS = 14 * 24 * 60 * 60

const HOTEL_OPTIONS = new Set(['NOOM', 'SEEN'])
const SERVICE_LABELS: Record<string, string> = {
  RECEPTION: 'Réception',
  HOUSEKEEPING: 'Housekeeping',
  RESTAURANT: 'Restaurant',
  SECURITY: 'Sécurité',
}

type TestStatusRow = {
  learner_id: string
  statut: 'not_started' | 'in_progress' | 'completed'
  score_global: number | null
  niveau_suggere: string | null
  started_at: string | null
  completed_at: string | null
  candidate_first_name?: string | null
  candidate_last_name?: string | null
  candidate_hotel?: string | null
  candidate_service?: string | null
  candidate_phone?: string | null
  candidate_email?: string | null
  public_access_token_hash?: string | null
  public_access_expires_at?: string | null
}

type SessionSource = 'auth' | 'public'

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function normalizePhone(value: string) {
  const trimmed = value.trim()
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D+/g, '')
  return hasPlus ? `+${digits}` : digits
}

function splitName(fullName: string | null) {
  if (!fullName) return { firstName: null, lastName: null }
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: null, lastName: null }
  return {
    firstName: parts[0] || null,
    lastName: parts.slice(1).join(' ') || null,
  }
}

function buildParticipantPayload(status: TestStatusRow | null, profile?: {
  nom_complet?: string | null
  etablissement?: string | null
  metier_code?: string | null
  email?: string | null
}) {
  const profileNames = splitName(profile?.nom_complet || null)
  const serviceCode = status?.candidate_service || profile?.metier_code || null

  return {
    first_name: status?.candidate_first_name || profileNames.firstName,
    last_name: status?.candidate_last_name || profileNames.lastName,
    full_name:
      profile?.nom_complet ||
      [status?.candidate_first_name, status?.candidate_last_name].filter(Boolean).join(' ') ||
      null,
    hotel: status?.candidate_hotel || profile?.etablissement || null,
    service_code: serviceCode,
    service_label: serviceCode ? SERVICE_LABELS[serviceCode] || serviceCode : null,
    phone: status?.candidate_phone || null,
    email: status?.candidate_email || profile?.email || null,
  }
}

function getRemainingSeconds(startedAt: string | null, statut: string) {
  if (!startedAt || statut !== 'in_progress') return TEST_DURATION_SECONDS
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
  return Math.max(0, TEST_DURATION_SECONDS - elapsedSeconds)
}

async function loadStatusForLearner(client: any, learnerId: string) {
  const { data, error } = await client
    .from('test_online_status')
    .select('*')
    .eq('learner_id', learnerId)
    .single()

  if (error) throw error
  return data as TestStatusRow
}

async function ensureStatusForLearner(client: any, learnerId: string) {
  const { data, error } = await client
    .from('test_online_status')
    .select('*')
    .eq('learner_id', learnerId)
    .maybeSingle()

  if (error) throw error
  if (data) return data as TestStatusRow

  const { data: created, error: createError } = await client
    .from('test_online_status')
    .insert({ learner_id: learnerId, statut: 'not_started' })
    .select('*')
    .single()

  if (createError) throw createError
  return created as TestStatusRow
}

async function loadResponsesForLearner(client: any, learnerId: string) {
  const { data, error } = await client
    .from('test_online_responses')
    .select('*')
    .eq('learner_id', learnerId)

  if (error) throw error
  return data || []
}

async function resolveSession(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return {
      source: 'auth' as SessionSource,
      learnerId: user.id,
      supabase,
      admin: null,
      status: null as TestStatusRow | null,
      profile: null as any,
    }
  }

  const rawToken = req.cookies.get(PUBLIC_SESSION_COOKIE)?.value
  if (!rawToken) {
    return { source: null, learnerId: null, supabase, admin: null, status: null, profile: null }
  }

  if (!isAdminClientConfigured()) {
    return { source: 'public', learnerId: null, supabase, admin: null, status: null, profile: null }
  }

  const admin = createAdminClient()
  const { data: status, error } = await admin
    .from('test_online_status')
    .select('*')
    .eq('public_access_token_hash', hashToken(rawToken))
    .maybeSingle()

  if (error) throw error
  if (!status) {
    return { source: 'public', learnerId: null, supabase, admin, status: null, profile: null }
  }

  if (status.public_access_expires_at && new Date(status.public_access_expires_at).getTime() < Date.now()) {
    return { source: 'public', learnerId: null, supabase, admin, status: null, profile: null }
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('nom_complet, etablissement, metier_code, email')
    .eq('id', status.learner_id)
    .maybeSingle()

  return {
    source: 'public' as SessionSource,
    learnerId: status.learner_id as string,
    supabase,
    admin,
    status: status as TestStatusRow,
    profile,
  }
}

function withClearedSessionCookie(response: NextResponse) {
  response.cookies.set(PUBLIC_SESSION_COOKIE, '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

function withSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(PUBLIC_SESSION_COOKIE, token, {
    path: '/',
    maxAge: PUBLIC_SESSION_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}

async function buildStateResponse(args: {
  client: any
  learnerId: string
  status: TestStatusRow | null
  profile?: { nom_complet?: string | null; etablissement?: string | null; metier_code?: string | null; email?: string | null } | null
  publicMode: boolean
}) {
  const status = args.status || (await ensureStatusForLearner(args.client, args.learnerId))
  const responses = await loadResponsesForLearner(args.client, args.learnerId)
  const participant = buildParticipantPayload(status, args.profile || undefined)

  return NextResponse.json({
    status,
    responses,
    participant,
    public_mode: args.publicMode,
    remaining_seconds: getRemainingSeconds(status.started_at, status.statut),
    requires_identification: false,
  })
}

// GET: récupérer le statut actuel et les réponses
export async function GET(req: NextRequest) {
  try {
    const resolved = await resolveSession(req)

    if (resolved.source === 'auth' && resolved.learnerId) {
      const status = await ensureStatusForLearner(resolved.supabase, resolved.learnerId)
      const { data: profile } = await resolved.supabase
        .from('profiles')
        .select('nom_complet, etablissement, metier_code, email')
        .eq('id', resolved.learnerId)
        .maybeSingle()

      return await buildStateResponse({
        client: resolved.supabase,
        learnerId: resolved.learnerId,
        status,
        profile,
        publicMode: false,
      })
    }

    if (resolved.source === 'public' && resolved.learnerId && resolved.admin) {
      await resolved.admin
        .from('test_online_status')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('learner_id', resolved.learnerId)

      return await buildStateResponse({
        client: resolved.admin,
        learnerId: resolved.learnerId,
        status: resolved.status,
        profile: resolved.profile,
        publicMode: true,
      })
    }

    const response = NextResponse.json({
      requires_identification: true,
      public_mode: true,
      status: null,
      responses: [],
      participant: null,
      remaining_seconds: TEST_DURATION_SECONDS,
    })
    if (req.cookies.get(PUBLIC_SESSION_COOKIE)?.value) {
      return withClearedSessionCookie(response)
    }
    return response
  } catch (error) {
    console.error('GET /api/test-online failed:', error)
    return NextResponse.json({ error: 'Impossible de charger le test.' }, { status: 500 })
  }
}

// POST: enregistrer l'identification, une réponse ou terminer le test
export async function POST(req: NextRequest) {
  try {
    const resolved = await resolveSession(req)
    const body = await req.json()
    const { action, question_id, answer_text, answer_audio, section } = body

    if (action === 'RESET_PUBLIC_SESSION') {
      return withClearedSessionCookie(NextResponse.json({ ok: true }))
    }

    if (action === 'BEGIN_PUBLIC_TEST') {
      if (!isAdminClientConfigured()) {
        return NextResponse.json(
          { error: "Le mode public n'est pas configuré sur cet environnement." },
          { status: 503 },
        )
      }

      const firstName = typeof body.first_name === 'string' ? body.first_name.trim() : ''
      const lastName = typeof body.last_name === 'string' ? body.last_name.trim() : ''
      const hotel = typeof body.hotel === 'string' ? body.hotel.trim().toUpperCase() : ''
      const serviceCode = typeof body.service_code === 'string' ? body.service_code.trim().toUpperCase() : ''
      const phoneRaw = typeof body.phone === 'string' ? body.phone.trim() : ''
      const candidateEmail = typeof body.email === 'string' && body.email.trim() ? body.email.trim().toLowerCase() : null

      if (!firstName || !lastName || !HOTEL_OPTIONS.has(hotel) || !SERVICE_LABELS[serviceCode] || !phoneRaw) {
        return NextResponse.json({ error: 'Informations d’identification incomplètes.' }, { status: 400 })
      }

      const normalizedPhone = normalizePhone(phoneRaw)
      if (normalizedPhone.length < 8) {
        return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 400 })
      }

      const admin = createAdminClient()
      const { data: existingStatuses, error: existingError } = await admin
        .from('test_online_status')
        .select('learner_id, statut')
        .eq('candidate_phone', normalizedPhone)
        .order('created_at', { ascending: false })
        .limit(1)

      if (existingError) {
        return NextResponse.json({ error: existingError.message }, { status: 500 })
      }

      let learnerId = existingStatuses?.[0]?.learner_id as string | undefined

      if (!learnerId) {
        const generatedAuthEmail = `testonline.${normalizedPhone}.${Date.now()}@passation-caformac.app`
        const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
          email: generatedAuthEmail,
          password: randomBytes(18).toString('base64url'),
          email_confirm: true,
          user_metadata: {
            source: 'test-online-public',
          },
        })

        if (createUserError || !createdUser.user) {
          return NextResponse.json({ error: createUserError?.message || 'Création du candidat impossible.' }, { status: 500 })
        }

        learnerId = createdUser.user.id
      }

      const displayEmail = candidateEmail || `test-online+${normalizedPhone}@passation-caformac.app`
      const fullName = `${firstName} ${lastName}`.trim()

      const { error: profileError } = await admin
        .from('profiles')
        .upsert({
          id: learnerId,
          email: displayEmail,
          nom_complet: fullName,
          metier_code: serviceCode,
          etablissement: hotel,
          role: 'learner',
          niveau_actuel: 'A1',
          derniere_connexion: new Date().toISOString(),
          preferences: {
            source: 'test-online-public',
          },
        }, {
          onConflict: 'id',
        })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 })
      }

      const rawToken = randomBytes(32).toString('base64url')
      const expiresAt = new Date(Date.now() + PUBLIC_SESSION_MAX_AGE_SECONDS * 1000).toISOString()

      const { error: statusError } = await admin
        .from('test_online_status')
        .upsert({
          learner_id: learnerId,
          statut: existingStatuses?.[0]?.statut || 'not_started',
          candidate_first_name: firstName,
          candidate_last_name: lastName,
          candidate_hotel: hotel,
          candidate_service: serviceCode,
          candidate_phone: normalizedPhone,
          candidate_email: candidateEmail,
          public_access_token_hash: hashToken(rawToken),
          public_access_expires_at: expiresAt,
          identification_completed_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        }, {
          onConflict: 'learner_id',
        })

      if (statusError) {
        return NextResponse.json({ error: statusError.message }, { status: 500 })
      }

      const status = await loadStatusForLearner(admin, learnerId)
      const responses = await loadResponsesForLearner(admin, learnerId)
      const response = NextResponse.json({
        ok: true,
        status,
        responses,
        participant: buildParticipantPayload(status, {
          nom_complet: fullName,
          etablissement: hotel,
          metier_code: serviceCode,
          email: displayEmail,
        }),
        public_mode: true,
        remaining_seconds: getRemainingSeconds(status.started_at, status.statut),
        requires_identification: false,
      })

      return withSessionCookie(response, rawToken)
    }

    if (!resolved.learnerId) {
      return NextResponse.json({ error: 'Session de test introuvable. Reprenez l’identification.' }, { status: 401 })
    }

    const dataClient = resolved.source === 'public'
      ? resolved.admin
      : resolved.supabase

    if (!dataClient) {
      return NextResponse.json({ error: 'Session de test indisponible.' }, { status: 503 })
    }

    const currentStatus = resolved.status || await ensureStatusForLearner(dataClient, resolved.learnerId)

    if (currentStatus.statut === 'completed' && action !== 'COMPLETE_TEST') {
      return NextResponse.json({ error: 'Ce test est déjà terminé.' }, { status: 409 })
    }

    if (action === 'START_TEST') {
      if (currentStatus.statut === 'completed') {
        return NextResponse.json({
          ok: true,
          status: currentStatus,
          score_global: currentStatus.score_global,
          niveau_suggere: currentStatus.niveau_suggere,
        })
      }

      const { error: startError } = await dataClient
        .from('test_online_status')
        .update({
          statut: 'in_progress',
          started_at: currentStatus.started_at || new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        })
        .eq('learner_id', resolved.learnerId)

      if (startError) return NextResponse.json({ error: startError.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (action === 'SAVE_ANSWER') {
      if (!question_id || !section) {
        return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
      }

      const question = ONLINE_QUESTIONS_BANK.find((q) => q.id === question_id)
      let isCorrect: boolean | null = null
      let pendingHumanReview = false

      if (question && question.type === 'mcq') {
        isCorrect = answer_text === question.correctOptionId
      } else if (question && (question.type === 'recording' || question.type === 'open')) {
        pendingHumanReview = true
      }

      const { error: responseError } = await dataClient
        .from('test_online_responses')
        .upsert({
          learner_id: resolved.learnerId,
          section,
          question_id,
          answer_text: answer_text || null,
          answer_audio: answer_audio || null,
          is_correct: isCorrect,
          pending_human_review: pendingHumanReview,
        }, { onConflict: 'learner_id,question_id' })

      if (responseError) return NextResponse.json({ error: responseError.message }, { status: 500 })

      await dataClient
        .from('test_online_status')
        .update({
          statut: 'in_progress',
          started_at: currentStatus.started_at || new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        })
        .eq('learner_id', resolved.learnerId)

      return NextResponse.json({ ok: true })
    }

    if (action === 'COMPLETE_TEST') {
      if (currentStatus.statut === 'completed') {
        return NextResponse.json({
          ok: true,
          score_global: currentStatus.score_global,
          niveau_suggere: currentStatus.niveau_suggere,
        })
      }

      const responses = await loadResponsesForLearner(dataClient, resolved.learnerId)

      let autoScore = 0
      let totalAuto = 0
      let hasPending = false

      for (const response of responses) {
        if (typeof response.is_correct === 'boolean') {
          totalAuto += 1
          if (response.is_correct) autoScore += 1
        }
        if (response.pending_human_review) {
          hasPending = true
        }
      }

      const scoreGlobal = totalAuto > 0 ? Math.round((autoScore / totalAuto) * 100) : 0
      const niveauSuggere =
        scoreGlobal >= 80
          ? 'sufficient_level_candidate'
          : scoreGlobal >= 40
            ? 'intermediate_group'
            : 'beginner_group'

      if (niveauSuggere === 'sufficient_level_candidate') {
        hasPending = true
      }

      const { error: statusError } = await dataClient
        .from('test_online_status')
        .update({
          statut: 'completed',
          completed_at: new Date().toISOString(),
          score_global: scoreGlobal,
          niveau_suggere: niveauSuggere,
          confiance: hasPending ? 'low' : 'medium',
          oral_pending: hasPending,
          human_confirmation_required: hasPending,
          last_seen_at: new Date().toISOString(),
        })
        .eq('learner_id', resolved.learnerId)

      if (statusError) return NextResponse.json({ error: statusError.message }, { status: 500 })

      return NextResponse.json({ ok: true, score_global: scoreGlobal, niveau_suggere: niveauSuggere })
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })
  } catch (error: any) {
    console.error('POST /api/test-online failed:', error)
    return NextResponse.json({ error: error?.message || 'Erreur serveur.' }, { status: 500 })
  }
}
