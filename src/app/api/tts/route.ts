import { NextRequest, NextResponse } from 'next/server'

// Proxy TTS — appelle Google Translate côté serveur et renvoie le MP3
// Évite les blocages navigateur (CORS, CSP, Edge)
export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get('text')
  if (!text) {
    return new NextResponse('Paramètre text manquant', { status: 400 })
  }

  const encoded = encodeURIComponent(text.slice(0, 200))
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en-GB&client=tw-ob`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/',
      },
    })

    if (!response.ok) {
      return new NextResponse('Erreur TTS', { status: 502 })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('Erreur serveur TTS', { status: 500 })
  }
}
