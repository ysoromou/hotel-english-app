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

  const [
    participantsRes,
    invitesRes,
    attemptsRes,
    sectionsRes,
    messagesRes,
    groupsRes,
    productionsRes,
  ] = await Promise.all([
    supabase.from('participants').select('*'),
    supabase.from('test_invites').select('*'),
    supabase.from('test_attempts').select('*'),
    supabase.from('test_section_results').select('*'),
    supabase.from('outbound_messages').select('*'),
    supabase.from('group_recommendations').select('*'),
    supabase.from('test_productions').select('*'),
  ])

  const dashboard = buildPositioningDashboardData({
    participants: participantsRes.data || [],
    invites: invitesRes.data || [],
    attempts: attemptsRes.data || [],
    sectionResults: sectionsRes.data || [],
    messages: messagesRes.data || [],
    groupRecommendations: groupsRes.data || [],
    productions: productionsRes.data || [],
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
    score_auto: row.autoScore ?? '',
    score_writing_ia: row.writingScore ?? '',
    score_speaking_ia: row.speakingScore ?? '',
    score_global_provisoire: row.provisionalScore ?? row.totalScore ?? '',
    score_global: row.totalScore ?? row.provisionalScore ?? '',
    level: row.levelLabel ?? row.level ?? '',
    recommended_group: row.recommendedGroup ?? '',
    ai_status: row.aiStatus ?? '',
    needs_trainer_review: row.needsTrainerReview ? 'oui' : 'non',
    competences_fortes: row.strongCompetences.join(' | '),
    competences_faibles: row.weakCompetences.join(' | '),
    reading_score: row.sectionDetails.reading?.score ?? '',
    reading_total: row.sectionDetails.reading?.max ?? '',
    listening_score: row.sectionDetails.listening?.score ?? '',
    listening_total: row.sectionDetails.listening?.max ?? '',
    vocabulary_score: row.sectionDetails.vocabulary?.score ?? '',
    vocabulary_total: row.sectionDetails.vocabulary?.max ?? '',
    situations_score: row.sectionDetails.situations?.score ?? '',
    situations_total: row.sectionDetails.situations?.max ?? '',
    answered_questions: row.answeredQuestions,
    questions_total: row.totalQuestions,
    productions_submitted: row.productionsSubmitted,
    productions_total: row.totalProductions,
    completed_items: row.completedItems,
    total_items: row.totalItems,
    anomalies: row.anomalies.join(' | '),
    followup_status: row.absenceCategory,
    whatsapp_status: row.latestMessageStatus ?? '',
    whatsapp_last_at: row.latestMessageAt ?? '',
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
      score_global_provisoire: participant.totalScore ?? '',
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
