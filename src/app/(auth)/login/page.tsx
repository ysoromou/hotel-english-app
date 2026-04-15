'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState('')
  const router   = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      if (authError.message.includes('Invalid login credentials'))
        setError('Email ou mot de passe incorrect.')
      else if (authError.message.includes('Email not confirmed'))
        setError('Veuillez confirmer votre email avant de vous connecter.')
      else
        setError('Erreur de connexion. Réessayez.')
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-dvh flex flex-col bg-white">

      {/* ── HERO IMAGE + vague blanche en bas + ligne verte ── */}
      {/* Photo à placer : public/images/login/login-hero.jpg   */}
      {/* Sujet : réceptionniste noire souriante à l'accueil    */}
      <div className="relative w-full" style={{ height: '260px' }}>
        <Image
          src="/images/login/login-hero.jpg"
          alt="Réceptionniste hôtelière souriante"
          fill
          className="object-cover object-top"
          priority
        />

        {/* Vague blanche — une seule courbe douce sur la photo */}
        <svg
          viewBox="0 0 390 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full"
          style={{ height: '60px', display: 'block' }}
        >
          <path
            d="M0,45 C100,15 290,65 390,35 L390,60 L0,60 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* ── CONTENU ── */}
      <div className="flex-1 flex flex-col px-6 pt-2 pb-10">

        {/* Titre extra-bold */}
        <h1 className="text-[26px] font-extrabold text-black text-center leading-tight mb-6">
          Bienvenue sur{' '}
          <span className="text-[#006633]">Hotel English Pro</span>
        </h1>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Champ e-mail avec icône carré blanc bordure verte */}
          <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-2xl px-3 bg-white focus-within:border-[#006633] focus-within:ring-2 focus-within:ring-[#006633]/10 transition-all">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#006633] text-[#006633] shrink-0 my-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
              </svg>
            </span>
            <input
              type="email" autoComplete="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              className="flex-1 py-3.5 bg-transparent text-black placeholder-[#999] outline-none text-sm"
              style={{ minHeight: 'unset' }}
            />
          </div>

          {/* Champ mot de passe avec icône carré blanc bordure verte */}
          <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-2xl px-3 bg-white focus-within:border-[#006633] focus-within:ring-2 focus-within:ring-[#006633]/10 transition-all">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#006633] text-[#006633] shrink-0 my-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
              </svg>
            </span>
            <input
              type="password" autoComplete="current-password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="flex-1 py-3.5 bg-transparent text-black placeholder-[#999] outline-none text-sm"
              style={{ minHeight: 'unset' }}
            />
          </div>

          {/* Mot de passe oublié */}
          <div className="text-right -mt-1">
            <button
              type="button"
              className="text-sm text-[#333] hover:text-[#006633] transition-colors"
              style={{ minHeight: 'unset' }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton Se connecter — vert foncé pilule */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#006633] hover:bg-[#004d26] active:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{ boxShadow: '0 4px 16px rgba(0,102,51,0.25)' }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Connexion…
              </span>
            ) : 'Se connecter'}
          </button>
        </form>

        {/* Pas encore de compte */}
        <p className="text-center text-sm text-[#333] mt-5">
          Vous n&apos;avez pas de compte ?{' '}
          <a href="/register" className="text-[#006633] font-bold hover:underline">
            S&apos;inscrire
          </a>
        </p>

        {/* Séparateur */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E5E7EB]"/>
          <span className="text-xs text-[#999] font-medium">OU</span>
          <div className="flex-1 h-px bg-[#E5E7EB]"/>
        </div>

        {/* Connexion sociale */}
        <div className="flex items-center justify-center gap-5">
          {/* Apple */}
          <button
            type="button"
            aria-label="Connexion avec Apple"
            className="w-12 h-12 rounded-2xl border border-[#E5E7EB] bg-white flex items-center justify-center hover:border-[#006633] transition-colors"
            style={{ minHeight: 'unset' }}
          >
            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </button>
          {/* Google */}
          <button
            type="button"
            aria-label="Connexion avec Google"
            className="w-12 h-12 rounded-2xl border border-[#E5E7EB] bg-white flex items-center justify-center hover:border-[#006633] transition-colors"
            style={{ minHeight: 'unset' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          {/* Facebook */}
          <button
            type="button"
            aria-label="Connexion avec Facebook"
            className="w-12 h-12 rounded-2xl border border-[#E5E7EB] bg-white flex items-center justify-center hover:border-[#006633] transition-colors"
            style={{ minHeight: 'unset' }}
          >
            <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
