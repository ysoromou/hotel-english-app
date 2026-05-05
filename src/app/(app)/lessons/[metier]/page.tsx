import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProgressBar from '@/components/ui/ProgressBar'

const METIER_CONFIG: Record<string, { label: string; icon: React.ReactNode; fallbackPrefixes: string[] }> = {
  'REC_':  { label: 'Réception', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
    </svg>
  ), fallbackPrefixes: [] },
  'HK_':   { label: 'Housekeeping', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
    </svg>
  ), fallbackPrefixes: [] },
  'REST_': { label: 'Restaurant', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
    </svg>
  ), fallbackPrefixes: ['FB_'] },
  'SEC_':  { label: 'Sécurité', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12"/>
    </svg>
  ), fallbackPrefixes: [] },
}

export default async function MetierPage({
  params,
}: {
  params: Promise<{ metier: string }>
}) {
  const { metier } = await params
  const prefix = decodeURIComponent(metier)
  const config = METIER_CONFIG[prefix]

  if (!config) redirect('/dashboard')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let { data: actions } = await supabase
    .from('actions_metier')
    .select('id, metier, action, description, niveau_cible, critique_conflit')
    .like('id', `${prefix}%`)
    .order('id')

  if ((!actions || actions.length === 0) && config.fallbackPrefixes.length > 0) {
    for (const fallbackPrefix of config.fallbackPrefixes) {
      const { data: fallbackActions } = await supabase
        .from('actions_metier')
        .select('id, metier, action, description, niveau_cible, critique_conflit')
        .like('id', `${fallbackPrefix}%`)
        .order('id')

      if (fallbackActions && fallbackActions.length > 0) {
        actions = fallbackActions
        break
      }
    }
  }

  if (!actions || actions.length === 0) redirect('/dashboard')

  const { data: progress } = await supabase
    .from('user_action_progress')
    .select('action_id, statut, phrases_completed, phrases_total')
    .eq('user_id', user.id)

  const progressMap = new Map((progress ?? []).map(p => [p.action_id, p]))

  let completedActions = 0
  actions.forEach(action => {
    const entry = progressMap.get(action.id)
    if (entry?.statut === 'completed' || entry?.statut === 'mastered') completedActions++
  })

  const totalActions = actions.length
  const globalPercent = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-24">
      <div
        className="bg-white px-5 pt-8 pb-4 sticky top-0 z-20"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#006633] text-[#006633] shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#006633] text-[#006633] shrink-0">
              {config.icon}
            </span>
            <h1 className="text-lg font-extrabold text-[#000000]">Formation {config.label}</h1>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 max-w-md mx-auto space-y-5">
        <div
          className="bg-white rounded-2xl p-5 border border-[#E5E7EB]"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-[#000]">
              {completedActions}/{totalActions}
              <span className="text-[#999] font-medium ml-1 text-xs">modules complétés</span>
            </p>
            <span className="text-base font-extrabold text-[#006633]">{globalPercent}%</span>
          </div>
          <ProgressBar value={globalPercent} color="bg-[#4CAF50]" size="sm" />
        </div>

        <div className="space-y-3">
          {actions.map((action, index) => {
            const entry = progressMap.get(action.id)
            const statut = entry?.statut ?? 'not_started'
            const isCompleted = statut === 'completed' || statut === 'mastered'

            return (
              <Link
                key={action.id}
                href={`/lessons/${prefix}/${action.id}`}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-[#E5E7EB] hover:border-[#006633] active:scale-[0.98] transition-all block"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <span className={`flex items-center justify-center w-11 h-11 rounded-xl border shrink-0 ${
                  isCompleted
                    ? 'bg-[#4CAF50]/10 border-[#4CAF50] text-[#006633]'
                    : 'bg-white border-[#006633] text-[#006633]'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                    </svg>
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-0.5">
                    Module {index + 1}
                  </p>
                  <h3 className="font-extrabold text-[#000000] text-[15px] leading-tight mb-1">
                    {action.action}
                  </h3>
                  <p className="text-[13px] text-[#666] line-clamp-2 mb-2">
                    {action.description}
                  </p>

                  {isCompleted ? (
                    <span className="text-xs bg-[#4CAF50]/10 text-[#006633] px-3 py-1 rounded-full font-semibold">
                      Terminé
                    </span>
                  ) : (
                    <span
                      className="inline-block px-4 py-1.5 bg-[#006633] text-white text-xs font-bold rounded-full"
                      style={{ boxShadow: '0 2px 8px rgba(0,102,51,0.25)' }}
                    >
                      Commencer
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
