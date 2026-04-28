import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getManagerRequestAccess } from '@/lib/positioning/access'
import { buildPositioningDashboardData } from '@/lib/positioning/dashboard'
import { toCsvValue } from '@/lib/positioning/utils'

function buildCsv(rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  return [
    headers.join(';'),
    ...rows.map((row) => headers.map((header) => toCsvValue(row[header])).join(';')),
  ].join('\n')
}

export async function GET(request: NextRequest) {
  const { supabase, userId, allowed } = await getManagerRequestAccess()

  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  if (!allowed) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const exportType = request.nextUrl.searchParams.get('type') || 'results'
  const format = request.nextUrl.searchParams.get('format') || 'csv'

  const [participantsRes, invitesRes, attemptsRes, sectionsRes, messagesRes, groupsRes] = await Promise.all([
    supabase.from('participants').select('*'),
    supabase.from('test_invites').select('*'),
    supabase.from('test_attempts').select('*'),
    supabase.from('test_section_results').select('*'),
    supabase.from('outbound_messages').select('*'),
    supabase.from('group_recommendations').select('*'),
  ])

  const dashboard = buildPositioningDashboardData({
    participants: participantsRes.data || [],
    invites: invitesRes.data || [],
    attempts: attemptsRes.data || [],
    sectionResults: sectionsRes.data || [],
    messages: messagesRes.data || [],
    groupRecommendations: groupsRes.data || [],
  })

  const resultsRows = dashboard.rows.map((row) => ({
    participant: row.fullName,
    hotel: row.hotel,
    organization: row.organization,
    department: row.department,
    phone: row.phone,
    email: row.email,
    invite_status: row.inviteStatus,
    attempt_status: row.attemptStatus,
    score_global: row.totalScore ?? '',
    level: row.levelLabel ?? row.level ?? '',
    recommended_group: row.recommendedGroup ?? '',
    reading: row.sectionScores.reading ?? '',
    listening: row.sectionScores.listening ?? '',
    vocabulary: row.sectionScores.vocabulary ?? '',
    duration_seconds: row.durationSeconds ?? '',
    completed_at: row.completedAt ?? '',
  }))

  const summaryRows = [
    { indicateur: 'Participants', valeur: dashboard.summary.totalParticipants },
    { indicateur: 'Invitations envoyées', valeur: dashboard.summary.totalSent },
    { indicateur: 'Liens ouverts', valeur: dashboard.summary.totalOpened },
    { indicateur: 'Tests démarrés', valeur: dashboard.summary.totalStarted },
    { indicateur: 'Tests terminés', valeur: dashboard.summary.totalCompleted },
    { indicateur: 'Absents', valeur: dashboard.summary.totalAbsents },
    { indicateur: 'Incomplets', valeur: dashboard.summary.totalIncompletes },
    { indicateur: 'Taux de complétion', valeur: `${dashboard.summary.completionRate}%` },
  ]

  const groupRows = dashboard.groups.flatMap((group) =>
    group.participants.map((participant) => ({
      group: group.groupName,
      level: group.level,
      participant: participant.fullName,
      hotel: participant.hotel,
      organization: participant.organization,
      score_global: participant.totalScore ?? '',
    })),
  )

  const selectedRows =
    exportType === 'summary' ? summaryRows : exportType === 'groups' ? groupRows : resultsRows

  if (format === 'xlsx') {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(resultsRows), 'Résultats')
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), 'Synthèse')
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(groupRows), 'Groupes')
    const workbookBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    return new NextResponse(workbookBuffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="positioning-${exportType}.xlsx"`,
      },
    })
  }

  return new NextResponse(buildCsv(selectedRows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="positioning-${exportType}.csv"`,
    },
  })
}
