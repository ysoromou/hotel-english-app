import { NextRequest, NextResponse } from 'next/server'
import { getManagerRequestAccess } from '@/lib/positioning/access'
import {
  buildImportPreview,
  parseWorkbookPreview,
  suggestImportMapping,
  validateNormalizedPreviewRow,
} from '@/lib/positioning/import'
import { POSITIONING_IMPORT_FIELDS } from '@/lib/positioning/config'
import { ImportPreviewRow } from '@/lib/positioning/types'

export async function POST(request: NextRequest) {
  const { supabase, userId, allowed } = await getManagerRequestAccess()

  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  if (!allowed) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as { rows?: ImportPreviewRow[] }
    const rows = Array.isArray(body.rows) ? body.rows.map(validateNormalizedPreviewRow) : []
    const importableRows = rows.filter((row) => row.errors.length === 0 && row.duplicateReasons.length === 0)

    if (importableRows.length === 0) {
      return NextResponse.json({
        importedCount: 0,
        failedRows: [],
        summary: {
          totalRows: rows.length,
          duplicates: rows.filter((row) => row.duplicateReasons.length > 0).length,
          invalid: rows.filter((row) => row.errors.length > 0).length,
        },
      })
    }

    const failedRows: Array<{ rowNumber: number; error: string }> = []
    let importedCount = 0

    for (const row of importableRows) {
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .insert({
          hotel: row.normalized.hotel,
          organization: row.normalized.organization,
          first_name: row.normalized.first_name,
          last_name: row.normalized.last_name,
          phone: row.normalized.phone,
          normalized_phone: row.normalized.normalized_phone,
          email: row.normalized.email,
          department: row.normalized.department,
          external_ref: row.normalized.external_ref,
          status: 'imported',
        })
        .select('id')
        .single()

      if (participantError || !participant) {
        failedRows.push({
          rowNumber: row.rowNumber,
          error: participantError?.message || "Impossible d'insérer le participant",
        })
        continue
      }

      const { error: inviteError } = await supabase.from('test_invites').insert({
        participant_id: participant.id,
        status: 'not_sent',
      })

      if (inviteError) {
        await supabase.from('participants').delete().eq('id', participant.id)
        failedRows.push({
          rowNumber: row.rowNumber,
          error: inviteError.message,
        })
        continue
      }

      importedCount += 1
    }

    return NextResponse.json({
      importedCount,
      failedRows,
      summary: {
        totalRows: rows.length,
        duplicates: rows.filter((row) => row.duplicateReasons.length > 0).length,
        invalid: rows.filter((row) => row.errors.length > 0).length,
      },
    })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
  }

  const mappingFromForm = formData.get('mapping')
  const buffer = Buffer.from(await file.arrayBuffer())
  const { headers, rows } = parseWorkbookPreview(buffer)
  const suggestedMapping = suggestImportMapping(headers)
  const mapping =
    typeof mappingFromForm === 'string' && mappingFromForm
      ? { ...suggestedMapping, ...(JSON.parse(mappingFromForm) as Record<string, string>) }
      : suggestedMapping

  const { data: existingParticipants } = await supabase
    .from('participants')
    .select('hotel, normalized_phone, email, external_ref')

  const { previewRows, summary } = buildImportPreview(rows, mapping, existingParticipants || [])

  return NextResponse.json({
    headers,
    availableFields: POSITIONING_IMPORT_FIELDS,
    suggestedMapping,
    mapping,
    previewRows,
    summary,
  })
}
