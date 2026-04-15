import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

const METIERS = [
  {
    prefix: 'REC_',
    label: 'Réception',
    image: '/images/dashboard/metier-reception.jpg',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
      </svg>
    ),
  },
  {
    prefix: 'HK_',
    label: 'Housekeeping',
    image: '/images/dashboard/metier-housekeeping.jpg',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
      </svg>
    ),
  },
  {
    prefix: 'REST_',
    label: 'Entretien',
    image: '/images/dashboard/metier-entretien.jpg',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
      </svg>
    ),
  },
  {
    prefix: 'SEC_',
    label: 'Art Culinaire',
    image: '/images/dashboard/metier-culinaire.jpg',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12"/>
      </svg>
    ),
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nom_complet, metier_code, niveau_actuel')
    .eq('id', user.id)
    .single()

  const { data: actions } = await supabase
    .from('actions_metier')
    .select('id, metier, action, niveau_cible')
    .order('id')

  const { data: progress } = await supabase
    .from('user_action_progress')
    .select('action_id, statut, phrases_completed, phrases_total')
    .eq('user_id', user.id)

  const progressMap = new Map((progress ?? []).map(p => [p.action_id, p]))

  function getMetierProgress(prefix: string) {
    const metierActions = (actions ?? []).filter(a => a.id.startsWith(prefix))
    if (metierActions.length === 0) return { completed: 0, total: 0, percent: 0 }
    let completed = 0
    for (const action of metierActions) {
      const p = progressMap.get(action.id)
      if (p && (p.statut === 'completed' || p.statut === 'mastered')) completed++
    }
    return {
      completed,
      total: metierActions.length,
      percent: Math.round((completed / metierActions.length) * 100),
    }
  }

  const totalActions      = (actions ?? []).length
  const completedActions  = (progress ?? []).filter(
    p => p.statut === 'completed' || p.statut === 'mastered'
  ).length
  const heuresEtude  = Math.floor((completedActions * 30) / 60)
  const minutesEtude = (completedActions * 30) % 60
  const certificats  = METIERS.filter(m => getMetierProgress(m.prefix).percent === 100).length

  return (
    <div className="min-h-screen bg-white pb-24">

      {/* ── HERO avec découpe vague ── */}
      <div className="relative w-full" style={{ height: '220px' }}>
        <Image
          src="/images/dashboard/dashboard-hero.jpg"
          alt="Personnel hôtelier en formation"
          fill className="object-cover object-center" priority
        />
        {/* Vague blanche */}
        <svg viewBox="0 0 390 56" xmlns="http://www.w3.org/2000/svg"
             className="absolute bottom-0 left-0 w-full"
             preserveAspectRatio="none"
             style={{ display: 'block', height: '56px' }}>
          <path d="M0,45 C100,15 290,65 390,35 L390,56 L0,56 Z" fill="white"/>
        </svg>
      </div>

      <div className="px-5 -mt-2">

        {/* Titre */}
        <h1 className="text-[26px] font-extrabold text-[#000000] text-center mb-5">
          Tableau de Bord
        </h1>

        {/* ── STATS ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-around py-4 mb-6"
             style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>

          <div className="text-center">
            <p className="text-[11px] text-[#666] uppercase tracking-wider mb-1">Cours Suivis</p>
            <p className="text-xl font-extrabold text-[#000]">
              {completedActions}<span className="text-[#4CAF50]">/{totalActions}</span>
            </p>
          </div>

          <div className="w-px h-10 bg-[#E5E7EB]"/>

          <div className="text-center">
            <p className="text-[11px] text-[#666] uppercase tracking-wider mb-1">Heures d&apos;Étude</p>
            <p className="text-xl font-extrabold text-[#000]">
              {heuresEtude}h{minutesEtude > 0 ? minutesEtude : ''}
            </p>
          </div>

          <div className="w-px h-10 bg-[#E5E7EB]"/>

          <div className="text-center">
            <p className="text-[11px] text-[#666] uppercase tracking-wider mb-1">Certificats</p>
            <p className="text-xl font-extrabold text-[#000]">{certificats}</p>
          </div>
        </div>

        {/* ── GRILLE MÉTIERS ── */}
        <div className="grid grid-cols-2 gap-4">
          {METIERS.map(metier => {
            const prog = getMetierProgress(metier.prefix)
            return (
              <Link
                key={metier.prefix}
                href={`/lessons/${metier.prefix}`}
                className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden active:scale-95 transition-transform block"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
              >
                {/* Photo métier */}
                <div className="relative w-full h-[100px] bg-[#F5F5F5]">
                  <Image src={metier.image} alt={metier.label} fill className="object-cover"/>
                </div>

                {/* Bas de carte */}
                <div className="p-3">
                  {/* Icône carré blanc bordure verte + label */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#006633] text-[#006633] shrink-0">
                      {metier.icon}
                    </span>
                    <span className="text-sm font-bold text-[#000000]">
                      {metier.label}
                    </span>
                  </div>

                  {/* Barre de progression fine */}
                  <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4CAF50] rounded-full transition-all"
                         style={{ width: `${prog.percent}%` }}/>
                  </div>
                  <p className="text-[10px] text-[#666] mt-1 text-right font-medium">
                    {prog.completed}/{prog.total}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
