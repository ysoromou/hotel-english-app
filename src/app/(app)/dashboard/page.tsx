import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

const METIERS = [
  {
    prefix: 'REC_',
    fallbackPrefixes: [] as string[],
    label: 'Reception',
    accentClass: 'from-emerald-600 via-emerald-500 to-lime-400',
    panelClass: 'from-emerald-50 to-white',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
    ),
  },
  {
    prefix: 'HK_',
    fallbackPrefixes: [] as string[],
    label: 'Housekeeping',
    accentClass: 'from-cyan-600 via-sky-500 to-blue-400',
    panelClass: 'from-sky-50 to-white',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
        />
      </svg>
    ),
  },
  {
    prefix: 'REST_',
    fallbackPrefixes: ['FB_'],
    label: 'Restaurant',
    accentClass: 'from-amber-500 via-orange-500 to-rose-400',
    panelClass: 'from-amber-50 to-white',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    ),
  },
  {
    prefix: 'SEC_',
    fallbackPrefixes: [] as string[],
    label: 'Securite',
    accentClass: 'from-slate-700 via-slate-600 to-emerald-600',
    panelClass: 'from-slate-50 to-white',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12"
        />
      </svg>
    ),
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('profiles').select('nom_complet, metier_code, niveau_actuel').eq('id', user.id).single()

  const { data: actions } = await supabase.from('actions_metier').select('id, metier, action, niveau_cible').order('id')
  const { data: progress } = await supabase
    .from('user_action_progress')
    .select('action_id, statut, phrases_completed, phrases_total')
    .eq('user_id', user.id)

  const progressMap = new Map((progress ?? []).map((entry) => [entry.action_id, entry]))

  function getMetierActions(prefix: string, fallbackPrefixes: string[]) {
    const allActions = actions ?? []
    const primaryActions = allActions.filter((action) => action.id.startsWith(prefix))
    if (primaryActions.length > 0 || fallbackPrefixes.length === 0) return primaryActions

    for (const fallbackPrefix of fallbackPrefixes) {
      const fallbackActions = allActions.filter((action) => action.id.startsWith(fallbackPrefix))
      if (fallbackActions.length > 0) return fallbackActions
    }

    return []
  }

  function getMetierProgress(metier: (typeof METIERS)[number]) {
    const metierActions = getMetierActions(metier.prefix, metier.fallbackPrefixes)
    if (metierActions.length === 0) return { completed: 0, total: 0, percent: 0 }

    let completed = 0
    for (const action of metierActions) {
      const entry = progressMap.get(action.id)
      if (entry && (entry.statut === 'completed' || entry.statut === 'mastered')) completed += 1
    }

    return {
      completed,
      total: metierActions.length,
      percent: Math.round((completed / metierActions.length) * 100),
    }
  }

  const metierProgress = METIERS.map((metier) => ({
    metier,
    progress: getMetierProgress(metier),
  }))

  const totalActions = metierProgress.reduce((sum, entry) => sum + entry.progress.total, 0)
  const completedActions = metierProgress.reduce((sum, entry) => sum + entry.progress.completed, 0)
  const heuresEtude = Math.floor((completedActions * 30) / 60)
  const minutesEtude = (completedActions * 30) % 60
  const certificats = metierProgress.filter((entry) => entry.progress.total > 0 && entry.progress.percent === 100).length

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="relative w-full" style={{ height: '220px' }}>
        <Image
          src="/images/login/login-hero.jpg"
          alt="Personnel hotelier en formation"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05250f]/70 via-[#05250f]/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 px-5 pt-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Formation mobile</p>
          <p className="mt-2 max-w-[240px] text-lg font-bold leading-tight">
            Progression terrain en anglais professionnel
          </p>
        </div>
        <svg
          viewBox="0 0 390 56"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
          style={{ display: 'block', height: '56px' }}
        >
          <path d="M0,45 C100,15 290,65 390,35 L390,56 L0,56 Z" fill="white" />
        </svg>
      </div>

      <div className="px-5 -mt-2">
        <h1 className="mb-5 text-center text-[26px] font-extrabold text-[#000000]">Tableau de Bord</h1>

        <div
          className="mb-6 flex items-center justify-around rounded-2xl border border-[#E5E7EB] bg-white py-4"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
        >
          <div className="text-center">
            <p className="mb-1 text-[11px] uppercase tracking-wider text-[#666]">Cours suivis</p>
            <p className="text-xl font-extrabold text-[#000]">
              {completedActions}
              <span className="text-[#4CAF50]">/{totalActions}</span>
            </p>
          </div>

          <div className="h-10 w-px bg-[#E5E7EB]" />

          <div className="text-center">
            <p className="mb-1 text-[11px] uppercase tracking-wider text-[#666]">Heures d'etude</p>
            <p className="text-xl font-extrabold text-[#000]">
              {heuresEtude}h{minutesEtude > 0 ? minutesEtude : ''}
            </p>
          </div>

          <div className="h-10 w-px bg-[#E5E7EB]" />

          <div className="text-center">
            <p className="mb-1 text-[11px] uppercase tracking-wider text-[#666]">Certificats</p>
            <p className="text-xl font-extrabold text-[#000]">{certificats}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metierProgress.map(({ metier, progress: metierStats }) => (
            <Link
              key={metier.prefix}
              href={`/lessons/${metier.prefix}`}
              className="block overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-transform active:scale-95"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
            >
              <div className={`relative flex h-[100px] items-end overflow-hidden bg-gradient-to-br ${metier.accentClass} p-3`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]" />
                <div className="relative flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-[#006633]">
                    {metier.icon}
                  </span>
                  {metier.label}
                </div>
              </div>

              <div className={`bg-gradient-to-b ${metier.panelClass} p-3`}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#000000]">{metier.label}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#006633]">
                    {metierStats.total > 0 ? 'Actif' : 'En attente'}
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                  <div className="h-full rounded-full bg-[#4CAF50] transition-all" style={{ width: `${metierStats.percent}%` }} />
                </div>
                <p className="mt-1 text-right text-[10px] font-medium text-[#666]">
                  {metierStats.completed}/{metierStats.total}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
