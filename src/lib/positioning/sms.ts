import { MessageDispatchResult, ParticipantRow } from '@/lib/positioning/types'

export const SMS_TEST_NUMBER = '2250797660543'

export type SmsMessageKind = 'test_single' | 'initial' | 'reminder_1' | 'reminder_2'

export interface SmsProviderConfig {
  provider: string
  configured: boolean
  reason?: string
}

export function getSmsProviderConfig(): SmsProviderConfig {
  const provider = process.env.SMS_PROVIDER || 'dry_run'
  if (provider !== 'orange') {
    return { provider, configured: false, reason: 'SMS_PROVIDER different de "orange" (mode dry-run/CSV).' }
  }
  if (!process.env.ORANGE_SMS_CLIENT_ID || !process.env.ORANGE_SMS_CLIENT_SECRET || !process.env.ORANGE_SMS_SENDER) {
    return {
      provider,
      configured: false,
      reason: 'Variables Orange manquantes (ORANGE_SMS_CLIENT_ID/SECRET/SENDER).',
    }
  }
  return { provider, configured: true }
}

interface OrangeToken {
  accessToken: string
  expiresAt: number
}

let cachedToken: OrangeToken | null = null

async function fetchOrangeToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.accessToken
  }

  const clientId = process.env.ORANGE_SMS_CLIENT_ID as string
  const clientSecret = process.env.ORANGE_SMS_CLIENT_SECRET as string
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch('https://api.orange.com/oauth/v3/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: 'grant_type=client_credentials',
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Orange OAuth error ${response.status}: ${text}`)
  }
  const payload = JSON.parse(text) as { access_token?: string; expires_in?: number }
  if (!payload.access_token) {
    throw new Error('Orange OAuth: access_token manquant.')
  }

  cachedToken = {
    accessToken: payload.access_token,
    expiresAt: now + (payload.expires_in ?? 3600) * 1000,
  }
  return cachedToken.accessToken
}

function formatTel(value: string) {
  const digits = value.replace(/\D+/g, '')
  if (!digits) return null
  return `tel:+${digits}`
}

function formatSenderAddress(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.toLowerCase().startsWith('tel:')) return trimmed
  const digits = trimmed.replace(/\D+/g, '')
  if (digits.length >= 6) return `tel:+${digits}`
  // alphanumeric short name (Sender ID): Orange exposes it as tel:<name>
  return `tel:${trimmed}`
}

export async function sendOrangeSms({
  destination,
  message,
  senderOverride,
}: {
  destination: string
  message: string
  senderOverride?: string | null
}): Promise<MessageDispatchResult> {
  const provider = 'orange'
  const envSender = (process.env.ORANGE_SMS_SENDER as string) || ''
  const senderRaw = (senderOverride && senderOverride.trim().length > 0 ? senderOverride : envSender).trim()
  const senderTel = formatSenderAddress(senderRaw)
  const recipientTel = formatTel(destination)

  if (!senderTel) {
    return {
      provider,
      status: 'failed',
      destination,
      errorMessage: 'ORANGE_SMS_SENDER vide ou invalide.',
    }
  }
  if (!recipientTel) {
    return {
      provider,
      status: 'failed',
      destination,
      errorMessage: 'Numero destinataire invalide.',
    }
  }

  let accessToken: string
  try {
    accessToken = await fetchOrangeToken()
  } catch (error) {
    return {
      provider,
      status: 'failed',
      destination,
      errorMessage: error instanceof Error ? error.message : 'Erreur OAuth Orange.',
      senderUsed: senderTel,
    }
  }

  const senderForUrl = encodeURIComponent(senderTel)
  const url = `https://api.orange.com/smsmessaging/v1/outbound/${senderForUrl}/requests`

  const body = {
    outboundSMSMessageRequest: {
      address: [recipientTel],
      senderAddress: senderTel,
      outboundSMSTextMessage: { message },
    },
  }

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (error) {
    return {
      provider,
      status: 'failed',
      destination,
      errorMessage: error instanceof Error ? error.message : 'Erreur reseau Orange.',
      senderUsed: senderTel,
    }
  }

  const text = await response.text()
  const trimmedText = text.slice(0, 800)

  if (!response.ok) {
    return {
      provider,
      status: 'failed',
      destination,
      httpStatus: response.status,
      rawResponse: trimmedText,
      senderUsed: senderTel,
      errorMessage: `Orange ${response.status}: ${trimmedText}`,
    }
  }

  let providerMessageId: string | undefined
  let acceptedByOrange = false
  try {
    const payload = JSON.parse(text) as Record<string, any>
    const req = payload?.outboundSMSMessageRequest
    const ref = req?.resourceURL
    if (typeof ref === 'string') providerMessageId = ref
    // Orange echoes back the request when accepted; presence of resourceURL
    // OR a deliveryInfoList with a non-error code is the real success marker.
    const deliveryInfo = req?.deliveryInfoList?.deliveryInfo?.[0]
    const deliveryStatus =
      typeof deliveryInfo?.deliveryStatus === 'string' ? deliveryInfo.deliveryStatus : null
    if (deliveryStatus && /Error|Undeliverable|Failed/i.test(deliveryStatus)) {
      return {
        provider,
        status: 'failed',
        destination,
        httpStatus: response.status,
        rawResponse: trimmedText,
        senderUsed: senderTel,
        errorMessage: `Orange deliveryStatus=${deliveryStatus}`,
      }
    }
    acceptedByOrange = Boolean(ref || deliveryStatus)
  } catch {
    // unparseable — be conservative and treat as failed so the UI does not lie
    return {
      provider,
      status: 'failed',
      destination,
      httpStatus: response.status,
      rawResponse: trimmedText,
      senderUsed: senderTel,
      errorMessage: 'Reponse Orange illisible (JSON invalide).',
    }
  }

  if (!acceptedByOrange) {
    return {
      provider,
      status: 'failed',
      destination,
      httpStatus: response.status,
      rawResponse: trimmedText,
      senderUsed: senderTel,
      errorMessage: 'Orange a repondu 2xx mais sans resourceURL ni deliveryStatus.',
    }
  }

  return {
    provider,
    status: 'sent',
    destination,
    providerMessageId,
    httpStatus: response.status,
    rawResponse: trimmedText,
    senderUsed: senderTel,
  }
}

const ORANGE_ALLOWED_HOSTS = new Set([
  'api.orange.com',
  'backend.dck.cloud.orange',
])
const ORANGE_ALLOWED_HOST_SUFFIXES = ['.api.orange.com', '.cloud.orange']

function isOrangeResourceUrl(value: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return false
  }
  if (parsed.protocol !== 'https:') return false
  const host = parsed.hostname.toLowerCase()
  if (ORANGE_ALLOWED_HOSTS.has(host)) return true
  return ORANGE_ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))
}

export async function fetchOrangeDeliveryInfo(resourceURL: string): Promise<{
  httpStatus: number
  rawResponse: string
  deliveryStatus?: string
  errorMessage?: string
}> {
  if (!isOrangeResourceUrl(resourceURL)) {
    return {
      httpStatus: 0,
      rawResponse: '',
      errorMessage: 'resourceURL hors hostnames Orange autorises (api.orange.com, *.api.orange.com, *.cloud.orange).',
    }
  }
  let accessToken: string
  try {
    accessToken = await fetchOrangeToken()
  } catch (error) {
    return {
      httpStatus: 0,
      rawResponse: '',
      errorMessage: error instanceof Error ? error.message : 'Erreur OAuth Orange.',
    }
  }
  let response: Response
  try {
    response = await fetch(resourceURL, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    })
  } catch (error) {
    return {
      httpStatus: 0,
      rawResponse: '',
      errorMessage: error instanceof Error ? error.message : 'Erreur reseau Orange.',
    }
  }
  const text = (await response.text()).slice(0, 1200)
  let deliveryStatus: string | undefined
  try {
    const payload = JSON.parse(text) as Record<string, any>
    const info = payload?.outboundSMSMessageRequest?.deliveryInfoList?.deliveryInfo?.[0]
    if (typeof info?.deliveryStatus === 'string') deliveryStatus = info.deliveryStatus
  } catch {
    // ignore
  }
  return {
    httpStatus: response.status,
    rawResponse: text,
    deliveryStatus,
    errorMessage: response.ok ? undefined : `Orange ${response.status}`,
  }
}

export function buildSmsBody({
  kind,
  accessUrl,
}: {
  kind: SmsMessageKind
  accessUrl: string
}) {
  if (kind === 'test_single') {
    return [
      'Test SMS CAFORMAC :',
      'votre lien de test fonctionne.',
      'https://hotel-english-app.vercel.app/test-online',
    ].join('\n')
  }
  if (kind === 'initial') {
    return [
      'Test anglais CAFORMAC :',
      accessUrl,
      'A faire sur telephone. Duree : 45 min.',
    ].join('\n')
  }
  if (kind === 'reminder_1') {
    return [
      'Rappel test anglais CAFORMAC :',
      accessUrl,
      'Merci de completer le test des que possible. Duree : 45 min.',
    ].join('\n')
  }
  return [
    'Dernier rappel test anglais CAFORMAC :',
    accessUrl,
    'Merci de completer le test aujourd hui pour constituer les groupes.',
  ].join('\n')
}

export function isValidSmsPhone(participant: Pick<ParticipantRow, 'normalized_phone' | 'phone'>) {
  const candidate = participant.normalized_phone || participant.phone
  if (!candidate) return false
  const digits = String(candidate).replace(/\D+/g, '')
  return digits.length >= 10
}

export function getSmsDestination(participant: Pick<ParticipantRow, 'normalized_phone' | 'phone'>) {
  const candidate = participant.normalized_phone || participant.phone || ''
  return String(candidate).replace(/\D+/g, '')
}
