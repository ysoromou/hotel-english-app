import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/ui/BottomNav'

// Layout partagé par toutes les pages protégées (dashboard, leçons, profil, manager)
// Ajoute la barre de navigation en bas + un espace en bas pour ne pas cacher le contenu

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Récupérer le rôle du user pour afficher ou non l'onglet "Gestion"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let showManager = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    showManager = profile?.role === 'hr' || profile?.role === 'admin'
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* 🟢 Header CAFORMAC (Branding) */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="CAFORMAC AFRICONSULT" className="h-8 w-auto" />
          <div className="flex flex-col">
            <span className="text-[12px] font-black tracking-tight text-brand-dark leading-none">CAFORMAC</span>
            <span className="text-[8px] font-bold text-brand-mid tracking-widest leading-none">AFRICONSULT</span>
          </div>
        </div>
        {/* Placeholder for future top actions (e.g. notifications) */}
      </header>

      {/* Contenu de la page avec marge en bas pour la nav */}
      <main className="pb-20 flex-1">
        {children}
      </main>
      {/* Barre de navigation fixée en bas */}
      <BottomNav showManager={showManager} />
    </div>
  )
}
