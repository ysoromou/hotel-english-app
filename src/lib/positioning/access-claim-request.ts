export type ClaimRequestBody = {
  hotel?: string
  phone?: string
  launch?: boolean | string
}

export class ClaimRequestParseError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'ClaimRequestParseError'
    this.status = status
  }
}

export function parseClaimJsonBody(rawBody: string) {
  const trimmed = rawBody.trim()
  if (!trimmed) {
    throw new ClaimRequestParseError(
      'Requete invalide. Merci de verifier les informations saisies.',
    )
  }

  let body: ClaimRequestBody
  try {
    body = JSON.parse(trimmed) as ClaimRequestBody
  } catch {
    throw new ClaimRequestParseError(
      'Requete invalide. Merci de verifier les informations saisies.',
    )
  }

  return {
    hotel: body.hotel,
    phone: body.phone,
    launchRequested: body.launch === true || body.launch === 'true',
  }
}
