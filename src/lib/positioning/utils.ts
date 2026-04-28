import crypto from 'crypto'

export function normalizeHeader(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function normalizeText(value: unknown) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

export function normalizeEmail(value: unknown) {
  const email = normalizeText(value).toLowerCase()
  return email || null
}

export function normalizePhone(value: unknown, defaultCountryCode = process.env.DEFAULT_PHONE_COUNTRY_CODE || '225') {
  const raw = normalizeText(value)
  if (!raw) return null

  let digits = raw.replace(/\D+/g, '')
  if (!digits) return null

  if (digits.startsWith('00')) {
    digits = digits.slice(2)
  } else if (!raw.startsWith('+') && digits.startsWith('0') && defaultCountryCode) {
    digits = `${defaultCountryCode}${digits.slice(1)}`
  }

  return digits.length >= 10 ? digits : null
}

export function splitFullName(fullName: string) {
  const normalized = normalizeText(fullName)
  if (!normalized) return { firstName: '', lastName: '' }

  const parts = normalized.split(' ')
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.at(-1) ?? '',
  }
}

export function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function generateAccessToken() {
  return crypto.randomBytes(32).toString('base64url')
}

export function formatDateLabel(value: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function toCsvValue(value: unknown) {
  const stringValue = String(value ?? '')
  if (/[",;\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}
