'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface ProfileClientProps {
  profile: {
    id: string
    nom_complet: string | null
    metier_code: string | null
    niveau_actuel: string
    role: string
  } | null
  email: string
  stats: {
    total: number
    completed: number
    mastered: number
  }
}

const METIER_OPTIONS = [
  { code: 'REC',  label: 'Réception', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
    </svg>
  )},
  { code: 'HK',   label: 'Housekeeping', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
    </svg>
  )},
  { code: 'REST', label: 'Entretien', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
    </svg>
  )},
  { code: 'SEC',  label: 'Art Culinaire', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
    </svg>
  )},
]

const BADGES = [
  {
    id: 'service',
    label: 'Service Client',
    sublabel: 'Via service client',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"/>
      </svg>
    ),
  },
  {
    id: 'vocabulaire',
    label: 'Vocabulaire',
    sublabel: 'Termes hôteliers',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
      </svg>
    ),
  },
  {
    id: 'accueil',
    label: 'Accueil Pro',
    sublabel: 'Accueil débloqué',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"/>
      </svg>
    ),
  },
]

export default function ProfileClient({ profile, email, stats }: ProfileClientProps) {
  const [nomComplet, setNomComplet] = useState(profile?.nom_complet ?? '')
  const [metierCode, setMetierCode] = useState(profile?.metier_code ?? '')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  async function handleSave() {
    setSaving(true); setSaved(false)
    await supabase.from('profiles')
      .update({ nom_complet: nomComplet || null, metier_code: metierCode || null })
      .eq('id', profile?.id)
    setSaving(false); setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login'); router.refresh()
  }

  const displayName = nomComplet || email.split('@')[0]
  const metierLabel = METIER_OPTIONS.find(m => m.code === metierCode)?.label ?? 'Formation Hôtelière'
  const lessonPct   = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
  const heures      = Math.floor((stats.completed * 30) / 60)
  const minutes     = (stats.completed * 30) % 60

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">

      {/* ── EN-TÊTE blanc ── */}
      <div className="bg-white px-5 pt-12 pb-6 flex flex-col items-center"
           style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>

        {/* Avatar rond — bordure verte */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] border-[#006633] mb-3">
          <Image src="/images/avatars/avatar-default.jpg"
                 alt="Photo de profil" fill className="object-cover"/>
          <div className="absolute inset-0 flex items-center justify-center
                          bg-[#006633] text-white text-2xl font-extrabold">
            {displayName[0]?.toUpperCase()}
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-[#000000]">{displayName}</h1>
        <p className="text-sm text-[#666] mt-0.5">{metierLabel}</p>

        {/* Bouton Modifier — outline pilule */}
        <button onClick={handleSave} disabled={saving}
                className="mt-4 px-6 py-2 border border-[#006633] rounded-full text-sm font-semibold text-[#006633] hover:bg-[#006633] hover:text-white transition-colors disabled:opacity-50"
                style={{ minHeight: '36px' }}>
          {saving ? 'Enregistrement…' : saved ? 'Enregistré !' : 'Modifier le Profil'}
        </button>
      </div>

      <div className="px-5 pt-5 space-y-5">

        {/* ── MES BADGES ── */}
        <section>
          <h2 className="text-base font-extrabold text-[#000000] mb-3">Mes Badges</h2>
          <div className="flex gap-3">
            {BADGES.map(badge => (
              <div key={badge.id}
                   className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] p-3 flex flex-col items-center text-center"
                   style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {/* Icône carré blanc bordure verte */}
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-[#006633] text-[#006633] mb-2">
                  {badge.icon}
                </span>
                <p className="text-[11px] font-bold text-[#000] leading-tight">{badge.label}</p>
                <p className="text-[10px] text-[#666] mt-0.5 leading-tight">{badge.sublabel}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MES PROGRÈS ── */}
        <section>
          <h2 className="text-base font-extrabold text-[#000000] mb-3">Mes Progrès</h2>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-4"
               style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

            {[
              { label: 'Leçons Complétées', value: `${stats.completed}/${stats.total}`, pct: lessonPct },
              { label: 'Heures de Formation', value: `${heures}h${minutes > 0 ? ` ${minutes}min` : ''}`, pct: Math.min(lessonPct, 100) },
              { label: 'Score Moyen', value: `${lessonPct}%`, pct: lessonPct },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#333]">{row.label}</span>
                  <span className="font-bold text-[#000]">{row.value}</span>
                </div>
                {/* Barre de progression fine */}
                <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4CAF50] rounded-full transition-all"
                       style={{ width: `${row.pct}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INFORMATIONS ── */}
        <section>
          <h2 className="text-base font-extrabold text-[#000000] mb-3">Informations</h2>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-4"
               style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

            {/* Champ nom */}
            <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-2xl px-3 bg-[#F5F5F5] focus-within:border-[#006633] transition-all">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#006633] text-[#006633] shrink-0 my-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                </svg>
              </span>
              <input
                type="text" value={nomComplet}
                onChange={e => setNomComplet(e.target.value)}
                placeholder="Votre nom complet"
                className="flex-1 py-3 bg-transparent text-[#000] placeholder-[#999] outline-none text-sm"
              />
            </div>

            {/* Sélection métier */}
            <div className="grid grid-cols-2 gap-2">
              {METIER_OPTIONS.map(m => (
                <button key={m.code} onClick={() => setMetierCode(m.code)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                          metierCode === m.code
                            ? 'border-[#006633] bg-[#006633]/5 text-[#006633]'
                            : 'border-[#E5E7EB] bg-white text-[#333]'
                        }`}>
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg border ${
                    metierCode === m.code ? 'border-[#006633] text-[#006633]' : 'border-[#E5E7EB] text-[#999]'
                  } bg-white shrink-0`}>
                    {m.icon}
                  </span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Bouton sauvegarder — pilule vert */}
            <button onClick={handleSave} disabled={saving}
                    className="w-full py-4 bg-[#006633] hover:bg-[#004d26] text-white font-bold text-base rounded-full transition-colors disabled:opacity-50"
                    style={{ boxShadow: '0 4px 16px rgba(0,102,51,0.25)' }}>
              {saving ? 'Enregistrement…' : saved ? 'Enregistré !' : 'Enregistrer les modifications'}
            </button>
          </div>
        </section>

        {/* Déconnexion */}
        <button onClick={handleSignOut}
                className="w-full py-4 border border-[#E5E7EB] text-[#666] font-semibold rounded-full hover:bg-[#F5F5F5] transition-colors text-sm">
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
