import * as XLSX from 'xlsx'
import { IMPORT_HEADER_SYNONYMS, POSITIONING_IMPORT_FIELDS } from '@/lib/positioning/config'
import { ImportMapping, ImportPreviewRow, ImportPreviewSummary } from '@/lib/positioning/types'
import { normalizeEmail, normalizeHeader, normalizePhone, normalizeText, splitFullName } from '@/lib/positioning/utils'

function getWorkbookRows(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const firstSheetName = workbook.SheetNames[0]
  if (!firstSheetName) return { headers: [], rows: [] as Record<string, unknown>[] }

  const sheet = workbook.Sheets[firstSheetName]
  const matrix = XLSX.utils.sheet_to_json<(string | null)[]>(sheet, {
    header: 1,
    defval: '',
    raw: false,
  })

  const [headerRow = [], ...bodyRows] = matrix
  const headers = headerRow.map((value, index) => normalizeText(value) || `Column ${index + 1}`)

  const rows = bodyRows
    .map((row) => {
      const record: Record<string, unknown> = {}
      headers.forEach((header, index) => {
        record[header] = row[index] ?? ''
      })
      return record
    })
    .filter((row) => Object.values(row).some((value) => normalizeText(value)))

  return { headers, rows }
}

export function parseWorkbookPreview(buffer: Buffer) {
  return getWorkbookRows(buffer)
}

export function suggestImportMapping(headers: string[]) {
  const mapping: ImportMapping = {}

  for (const field of POSITIONING_IMPORT_FIELDS) {
    const synonyms = IMPORT_HEADER_SYNONYMS[field.key] ?? []
    const match = headers.find((header) => {
      const normalizedHeader = normalizeHeader(header)
      return synonyms.some((synonym) => normalizedHeader === normalizeHeader(synonym))
    })
    mapping[field.key] = match ?? ''
  }

  return mapping
}

function buildNormalizedRow(rowNumber: number, values: Record<string, unknown>, mapping: ImportMapping) {
  const getValue = (field: string) => normalizeText(mapping[field] ? values[mapping[field]] : '')

  const fullName = getValue('full_name')
  const splitName = splitFullName(fullName)
  const firstName = getValue('first_name') || splitName.firstName
  const lastName = getValue('last_name') || splitName.lastName
  const email = normalizeEmail(getValue('email'))
  const normalizedPhone = normalizePhone(getValue('phone'))

  const previewRow: ImportPreviewRow = {
    rowNumber,
    values: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, normalizeText(value)])),
    normalized: {
      hotel: getValue('hotel'),
      organization: getValue('organization') || null,
      first_name: firstName,
      last_name: lastName,
      phone: getValue('phone'),
      normalized_phone: normalizedPhone,
      email,
      department: getValue('department') || null,
      external_ref: getValue('external_ref') || null,
    },
    errors: [],
    duplicateReasons: [],
  }

  if (!previewRow.normalized.hotel) previewRow.errors.push('Hotel manquant')
  if (!previewRow.normalized.first_name) previewRow.errors.push('Prenom manquant')
  if (!previewRow.normalized.last_name) previewRow.errors.push('Nom manquant')
  if (!previewRow.normalized.phone) previewRow.errors.push('Telephone manquant')
  if (!normalizedPhone) previewRow.errors.push('Telephone invalide ou non internationalisable')

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    previewRow.errors.push('Email invalide')
  }

  return previewRow
}

export function validateNormalizedPreviewRow(row: ImportPreviewRow) {
  const errors = [...row.errors]
  const hotel = normalizeText(row.normalized.hotel)
  const firstName = normalizeText(row.normalized.first_name)
  const lastName = normalizeText(row.normalized.last_name)
  const phone = normalizeText(row.normalized.phone)
  const normalizedPhone = normalizePhone(phone)
  const email = normalizeEmail(row.normalized.email)

  if (!hotel && !errors.includes('Hotel manquant')) errors.push('Hotel manquant')
  if (!firstName && !errors.includes('Prenom manquant')) errors.push('Prenom manquant')
  if (!lastName && !errors.includes('Nom manquant')) errors.push('Nom manquant')
  if (!phone && !errors.includes('Telephone manquant')) errors.push('Telephone manquant')
  if (!normalizedPhone && !errors.includes('Telephone invalide ou non internationalisable')) {
    errors.push('Telephone invalide ou non internationalisable')
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !errors.includes('Email invalide')) {
    errors.push('Email invalide')
  }

  return {
    ...row,
    normalized: {
      ...row.normalized,
      hotel,
      first_name: firstName,
      last_name: lastName,
      phone,
      normalized_phone: normalizedPhone,
      email,
      department: normalizeText(row.normalized.department) || null,
      organization: normalizeText(row.normalized.organization) || null,
      external_ref: normalizeText(row.normalized.external_ref) || null,
    },
    errors,
  }
}

export function buildImportPreview(
  rows: Record<string, unknown>[],
  mapping: ImportMapping,
  existingParticipants: Array<{
    hotel: string
    normalized_phone: string | null
    email: string | null
    external_ref: string | null
  }>,
) {
  const previewRows = rows.map((row, index) => buildNormalizedRow(index + 2, row, mapping))
  const seenPhones = new Set<string>()
  const seenEmails = new Set<string>()
  const seenRefs = new Set<string>()

  const existingPhoneKeys = new Set(
    existingParticipants
      .filter((participant) => participant.hotel && participant.normalized_phone)
      .map((participant) => `${participant.hotel.toLowerCase()}::${participant.normalized_phone}`),
  )
  const existingEmailKeys = new Set(
    existingParticipants
      .filter((participant) => participant.hotel && participant.email)
      .map((participant) => `${participant.hotel.toLowerCase()}::${participant.email?.toLowerCase()}`),
  )
  const existingRefKeys = new Set(
    existingParticipants
      .filter((participant) => participant.external_ref)
      .map((participant) => participant.external_ref as string),
  )

  for (const row of previewRows) {
    const hotelKey = row.normalized.hotel.toLowerCase()
    const phoneKey = row.normalized.normalized_phone ? `${hotelKey}::${row.normalized.normalized_phone}` : null
    const emailKey = row.normalized.email ? `${hotelKey}::${row.normalized.email}` : null
    const refKey = row.normalized.external_ref

    if (phoneKey) {
      if (seenPhones.has(phoneKey)) row.duplicateReasons.push('Doublon telephone dans le fichier')
      if (existingPhoneKeys.has(phoneKey)) row.duplicateReasons.push('Telephone deja importe')
      seenPhones.add(phoneKey)
    }

    if (emailKey) {
      if (seenEmails.has(emailKey)) row.duplicateReasons.push('Doublon email dans le fichier')
      if (existingEmailKeys.has(emailKey)) row.duplicateReasons.push('Email deja importe')
      seenEmails.add(emailKey)
    }

    if (refKey) {
      if (seenRefs.has(refKey)) row.duplicateReasons.push('Reference externe dupliquee dans le fichier')
      if (existingRefKeys.has(refKey)) row.duplicateReasons.push('Reference externe deja importee')
      seenRefs.add(refKey)
    }
  }

  const summary: ImportPreviewSummary = {
    totalRows: previewRows.length,
    validRows: previewRows.filter((row) => row.errors.length === 0).length,
    duplicateRows: previewRows.filter((row) => row.duplicateReasons.length > 0).length,
    invalidRows: previewRows.filter((row) => row.errors.length > 0).length,
    importableRows: previewRows.filter((row) => row.errors.length === 0 && row.duplicateReasons.length === 0).length,
  }

  return { previewRows, summary }
}
