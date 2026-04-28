import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/ui/BottomNav'

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let showManager = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    showManager = profile?.role === 'hr' || profile?.role === 'admin'
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="print:hidden sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo-caformac.png"
              alt="CAFORMAC AFRICONSULT"
              className="h-11 w-auto max-w-[220px] object-contain"
            />
          </div>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
            {showManager ? 'Espace RH' : 'Parcours apprenant'}
          </span>
        </div>
      </header>

      <main className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">{children}</main>
      <BottomNav showManager={showManager} />
    </div>
  )
}
