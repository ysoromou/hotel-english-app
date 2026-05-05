import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, isAdminClientConfigured } from '@/lib/supabase/admin'
import { claimPositioningAccess, PositioningAccessRepository } from '@/lib/positioning/collective-access-service'
import {
  OutboundMessageRow,
  ParticipantRow,
  TestAttemptRow,
  TestInviteRow,
} from '@/lib/positioning/types'
import { PositioningAccessHotel, matchesPositioningAccessHotel } from '@/lib/positioning/collective-access'

function buildRepository(): PositioningAccessRepository {
  const admin = createAdminClient()

  return {
    async listParticipantsByHotel(hotel: PositioningAccessHotel) {
      const { data, error } = await admin
        .from('participants')
        .select('*')
        .ilike('hotel', `%${hotel}%`)

      if (error) throw error
      return ((data || []) as ParticipantRow[]).filter((participant) =>
        matchesPositioningAccessHotel(participant.hotel, hotel),
      )
    },
    async findLatestInvite(participantId) {
      const { data, error } = await admin
        .from('test_invites')
        .select('*')
        .eq('participant_id', participantId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error
      return ((data || [])[0] as TestInviteRow | undefined) ?? null
    },
    async findLatestAttempt(participantId, inviteId) {
      let query = admin
        .from('test_attempts')
        .select('*')
        .eq('participant_id', participantId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (inviteId) {
        query = query.eq('invite_id', inviteId)
      }

      const { data, error } = await query
      if (error) throw error
      return ((data || [])[0] as TestAttemptRow | undefined) ?? null
    },
    async findLatestAccessMessage(participantId, inviteId) {
      let query = admin
        .from('outbound_messages')
        .select('*')
        .eq('participant_id', participantId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (inviteId) {
        query = query.eq('invite_id', inviteId)
      }

      const { data, error } = await query
      if (error) throw error

      const rows = (data || []) as OutboundMessageRow[]
      return (
        rows.find((row) => {
          if (!row.provider_payload || Array.isArray(row.provider_payload)) return false
          return typeof (row.provider_payload as Record<string, unknown>).accessUrl === 'string'
        }) ?? null
      )
    },
    async createInvite(payload) {
      const { data, error } = await admin
        .from('test_invites')
        .insert(payload)
        .select('*')
        .single()

      if (error) throw error
      return data as TestInviteRow
    },
    async updateInvite(inviteId, payload) {
      const { data, error } = await admin
        .from('test_invites')
        .update(payload)
        .eq('id', inviteId)
        .select('*')
        .single()

      if (error) throw error
      return data as TestInviteRow
    },
    async updateParticipant(participantId, payload) {
      const { error } = await admin.from('participants').update(payload).eq('id', participantId)
      if (error) throw error
    },
    async insertOutboundMessage(payload) {
      const { error } = await admin.from('outbound_messages').insert(payload)
      if (error) throw error
    },
    logAnomaly(anomaly, context) {
      console.warn('[positioning/access/claim]', anomaly, context)
    },
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminClientConfigured()) {
    return NextResponse.json(
      { error: "Le parcours public n'est pas configure sur cet environnement." },
      { status: 503 },
    )
  }

  try {
    const body = (await request.json()) as {
      hotel?: string
      phone?: string
    }

    const result = await claimPositioningAccess({
      repository: buildRepository(),
      hotel: body.hotel,
      phone: body.phone,
      origin: request.nextUrl.origin,
    })

    if (result.kind === 'invalid_hotel') {
      return NextResponse.json(
        { error: "Lien invalide. Merci d'utiliser le lien transmis par votre hotel." },
        { status: 400 },
      )
    }

    if (result.kind === 'invalid_phone') {
      return NextResponse.json(
        { error: 'Numero WhatsApp invalide. Merci de verifier le format saisi.' },
        { status: 400 },
      )
    }

    if (result.kind === 'not_found') {
      return NextResponse.json(
        {
          error:
            "Numero non reconnu. Verifiez le numero transmis a votre hotel ou contactez votre responsable.",
        },
        { status: 404 },
      )
    }

    if (result.kind === 'duplicate') {
      return NextResponse.json(
        {
          error:
            'Plusieurs profils correspondent a ce numero. Contactez votre responsable.',
        },
        { status: 409 },
      )
    }

    if (result.kind === 'completed') {
      return NextResponse.json({
        completed: true,
        firstName: result.firstName,
        message: 'Vous avez deja termine le test.',
      })
    }

    return NextResponse.json({
      completed: false,
      firstName: result.firstName,
      accessUrl: result.accessUrl,
    })
  } catch (error) {
    console.error('POST /api/positioning/access/claim failed:', error)
    return NextResponse.json(
      { error: "Impossible d'ouvrir le test pour le moment. Merci de reessayer." },
      { status: 500 },
    )
  }
}
