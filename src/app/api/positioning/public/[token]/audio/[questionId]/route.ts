import { NextRequest, NextResponse } from 'next/server'
import { getPublicInviteContext } from '@/lib/positioning/access'
import { getPositioningQuestionById } from '@/lib/positioning/questions'

export async function GET(
  _: NextRequest,
  { params }: { params: { token: string; questionId: string } },
) {
  const context = await getPublicInviteContext(params.token).catch(() => null)
  if (!context) {
    return new NextResponse('Lien invalide', { status: 404 })
  }

  const question = getPositioningQuestionById(params.questionId)
  if (!question) {
    return new NextResponse('Question inconnue', { status: 404 })
  }

  const audioText = question.promptAudio
  const audioUrl = question.audioUrl

  if (!audioText && !audioUrl) {
    return new NextResponse('Aucun contenu audio disponible.', { status: 404 })
  }

  if (audioUrl) {
    try {
      const upstream = await fetch(audioUrl)
      if (!upstream.ok) {
        return new NextResponse('Audio indisponible', { status: 502 })
      }
      const buffer = await upstream.arrayBuffer()
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': upstream.headers.get('content-type') || 'audio/mpeg',
          'Cache-Control': 'private, max-age=3600',
        },
      })
    } catch {
      return new NextResponse('Erreur audio', { status: 502 })
    }
  }

  const encoded = encodeURIComponent(String(audioText).slice(0, 200))
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en-GB&client=tw-ob`

  try {
    const upstream = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    })
    if (!upstream.ok) {
      return new NextResponse('Audio indisponible', { status: 502 })
    }
    const buffer = await upstream.arrayBuffer()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    return new NextResponse('Erreur audio', { status: 502 })
  }
}
