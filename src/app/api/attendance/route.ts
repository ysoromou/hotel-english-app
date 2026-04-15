// POST /api/attendance — Saisie ou mise à jour de la présence
// GET  /api/attendance?date=YYYY-MM-DD — Liste présence pour une date

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface AttendanceBody {
  learner_id: string
  session_date: string       // YYYY-MM-DD
  session_label?: string
  statut: 'present' | 'late' | 'absent' | 'excused'
  commentaire?: string
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || !['hr', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await req.json() as AttendanceBody
  const { learner_id, session_date, session_label, statut, commentaire } = body

  if (!learner_id || !session_date || !statut) {
    return NextResponse.json({ error: 'learner_id, session_date et statut requis' }, { status: 400 })
  }

  const validStatuts = ['present', 'late', 'absent', 'excused']
  if (!validStatuts.includes(statut)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('attendance')
    .upsert({
      learner_id,
      recorded_by: user.id,
      session_date,
      session_label: session_label || null,
      statut,
      commentaire: commentaire || null,
    }, {
      onConflict: 'learner_id,session_date,session_label',
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur upsert attendance:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, attendance: data })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || !['hr', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const date = req.nextUrl.searchParams.get('date')

  let query = supabase.from('attendance').select('*').order('session_date', { ascending: false })
  if (date) query = query.eq('session_date', date)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ attendance: data || [] })
}
