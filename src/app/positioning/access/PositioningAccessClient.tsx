'use client'

import { type FormEvent, type ReactNode, useState } from 'react'
import { PositioningAccessHotel } from '@/lib/positioning/collective-access'

type ClaimState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; firstName: string; accessUrl: string }
  | { status: 'completed'; firstName: string; message: string }

export default function PositioningAccessClient({
  hotel,
}: {
  hotel: PositioningAccessHotel
}) {
  const [phone, setPhone] = useState('')
  const [claimState, setClaimState] = useState<ClaimState>({ status: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setClaimState({ status: 'loading' })

    try {
      const response = await fetch('/api/positioning/access/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotel,
          phone,
        }),
      })

      const payload = (await response.json()) as {
        firstName?: string
        accessUrl?: string
        completed?: boolean
        message?: string
        error?: string
      }

      if (!response.ok) {
        setClaimState({
          status: 'error',
          message:
            payload.error ||
            "Impossible d'ouvrir le test pour le moment. Merci de reessayer.",
        })
        return
      }

      if (payload.completed) {
        setClaimState({
          status: 'completed',
          firstName: payload.firstName || '',
          message: payload.message || 'Vous avez deja termine le test.',
        })
        return
      }

      if (!payload.firstName || !payload.accessUrl) {
        setClaimState({
          status: 'error',
          message: "Impossible d'ouvrir le test pour le moment. Merci de reessayer.",
        })
        return
      }

      setClaimState({
        status: 'ready',
        firstName: payload.firstName,
        accessUrl: payload.accessUrl,
      })
    } catch {
      setClaimState({
        status: 'error',
        message: "Impossible d'ouvrir le test pour le moment. Merci de reessayer.",
      })
    }
  }

  if (claimState.status === 'ready') {
    return (
      <ScreenShell>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Test de positionnement
        </p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Bonjour {claimState.firstName}, votre test est pret.
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Cliquez ci-dessous pour ouvrir votre test personnel.
        </p>
        <button
          type="button"
          onClick={() => window.location.assign(claimState.accessUrl)}
          className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Lancer le test
        </button>
      </ScreenShell>
    )
  }

  if (claimState.status === 'completed') {
    return (
      <ScreenShell>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Test de positionnement
        </p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Bonjour {claimState.firstName || 'vous'}
        </h1>
        <p className="mt-3 text-sm text-gray-600">{claimState.message}</p>
      </ScreenShell>
    )
  }

  return (
    <ScreenShell>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
        Test de positionnement
      </p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Bienvenue au test de positionnement anglais CAFORMAC.
      </h1>
      <p className="mt-4 text-sm text-gray-600">
        Veuillez saisir votre numero WhatsApp :
      </p>

      <form className="mt-6 text-left" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="positioning-access-phone">
          Numero WhatsApp
        </label>
        <input
          id="positioning-access-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="07 97 66 05 43"
          className="w-full rounded-3xl border border-gray-200 px-4 py-4 text-base text-gray-900 outline-none focus:border-emerald-500"
        />

        {claimState.status === 'error' ? (
          <p className="mt-3 text-sm text-red-600">{claimState.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={claimState.status === 'loading' || phone.trim().length === 0}
          className="mt-6 w-full rounded-full bg-gray-900 px-5 py-4 text-base font-semibold text-white disabled:opacity-40"
        >
          {claimState.status === 'loading' ? 'Verification...' : 'Acceder au test'}
        </button>
      </form>
    </ScreenShell>
  )
}

function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6">
      <div className="w-full max-w-md rounded-[32px] bg-white px-6 py-8 text-center shadow-sm ring-1 ring-gray-100">
        {children}
      </div>
    </div>
  )
}
