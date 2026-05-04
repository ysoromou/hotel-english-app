import { POSITIONING_DURATION_MINUTES } from '@/lib/positioning/config'
import { MessageDispatchResult, ParticipantRow } from '@/lib/positioning/types'
import { formatDateLabel } from '@/lib/positioning/utils'

export function buildInviteMessage({
  participant,
  accessUrl,
  deadlineAt,
}: {
  participant: Pick<ParticipantRow, 'first_name' | 'hotel'>
  accessUrl: string
  deadlineAt: string | null
}) {
  const deadlineLabel = formatDateLabel(deadlineAt)
  const lines = [
    `Bonjour ${participant.first_name},`,
    '',
    'Voici votre lien personnel pour le test de positionnement en anglais CAFORMAC :',
    accessUrl,
    '',
    `Duree estimee : ${POSITIONING_DURATION_MINUTES} minutes.`,
    deadlineLabel ? `Merci de faire le test avant le ${deadlineLabel}.` : null,
    'Merci de faire le test sur telephone, dans un endroit calme.',
    '',
    `${participant.hotel} - lien strictement personnel.`,
  ].filter(Boolean)

  return lines.join('\n')
}

export async function dispatchWhatsAppMessage({
  phone,
  message,
}: {
  phone: string
  message: string
}): Promise<MessageDispatchResult> {
  const provider = process.env.WHATSAPP_PROVIDER || 'manual_whatsapp'

  if (provider === 'twilio') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_WHATSAPP_FROM

    if (!accountSid || !authToken || !from) {
      return {
        provider,
        status: 'failed',
        destination: phone,
        errorMessage: 'Twilio WhatsApp is not fully configured.',
      }
    }

    const body = new URLSearchParams({
      From: from.startsWith('whatsapp:') ? from : `whatsapp:${from}`,
      To: phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`,
      Body: message,
    })

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    const payload = (await response.json()) as { sid?: string; message?: string }
    if (!response.ok) {
      return {
        provider,
        status: 'failed',
        destination: phone,
        errorMessage: payload.message || 'Unknown Twilio error',
      }
    }

    return {
      provider,
      status: 'sent',
      destination: phone,
      providerMessageId: payload.sid,
    }
  }

  const normalizedPhone = phone.replace(/\D+/g, '')
  return {
    provider: 'manual_whatsapp',
    status: 'prepared',
    destination: phone,
    deliveryUrl: `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`,
  }
}
