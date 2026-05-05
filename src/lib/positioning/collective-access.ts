export const POSITIONING_ACCESS_HOTELS = ['NOOM', 'SEEN'] as const

export type PositioningAccessHotel = (typeof POSITIONING_ACCESS_HOTELS)[number]

export function normalizePositioningAccessHotel(value: unknown): PositioningAccessHotel | null {
  const normalized = String(value ?? '').trim().toUpperCase()
  if (normalized === 'NOOM' || normalized === 'SEEN') return normalized
  return null
}

export function matchesPositioningAccessHotel(
  value: unknown,
  hotel: PositioningAccessHotel,
) {
  const normalized = String(value ?? '').trim().toUpperCase()
  return normalized === hotel || normalized.includes(hotel)
}

export function normalizeIvoryCoastPhone(value: unknown) {
  const raw = String(value ?? '').trim()
  if (!raw) return null

  let digits = raw.replace(/\D+/g, '')
  if (!digits) return null

  if (digits.startsWith('00')) {
    digits = digits.slice(2)
  }

  if (digits.startsWith('225')) {
    return /^225\d{10}$/.test(digits) ? digits : null
  }

  if (/^0\d{9}$/.test(digits)) {
    return `225${digits}`
  }

  return null
}
