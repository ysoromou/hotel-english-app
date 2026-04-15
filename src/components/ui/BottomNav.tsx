'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* Icônes Lucide-style (traits fins 1.8) — monochromes */
const ICON = {
  home: (active: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
         stroke={active ? '#006633' : '#9CA3AF'} strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591
               0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125
               1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621
               0 1.125.504 1.125 1.125V21h4.125c.621 0
               1.125-.504 1.125-1.125V9.75"/>
    </svg>
  ),
  book: (active: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
         stroke={active ? '#006633' : '#9CA3AF'} strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052
               0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6
               18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966
               0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987
               8.987 0 0 0 18 18a8.967 8.967 0 0 0-6
               2.292m0-14.25v14.25"/>
    </svg>
  ),
  user: (active: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
         stroke={active ? '#006633' : '#9CA3AF'} strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1
               7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998
               0A17.933 17.933 0 0 1 12 21.75c-2.676
               0-5.216-.584-7.499-1.632Z"/>
    </svg>
  ),
  team: (active: boolean) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"
         stroke={active ? '#006633' : '#9CA3AF'} strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0
               0 0-4.682-2.72m.94 3.198.001.031c0
               .225-.012.447-.037.666A11.944 11.944 0 0 1 12
               21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062
               0 0 1 6 18.719m12 0a5.971 5.971 0
               0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12
               12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0
               0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971
               5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6
               0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5
               0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
    </svg>
  ),
}

const BASE_TABS = [
  { label: 'Accueil',    href: '/dashboard', icon: ICON.home },
  { label: 'Cours',      href: '/lessons',   icon: ICON.book },
  { label: 'Profil',     href: '/profile',   icon: ICON.user },
]

const MANAGER_TAB = { label: 'Formations', href: '/manager', icon: ICON.team }

interface BottomNavProps { showManager?: boolean }

export default function BottomNav({ showManager = false }: BottomNavProps) {
  const pathname = usePathname()
  const tabs = showManager ? [...BASE_TABS, MANAGER_TAB] : BASE_TABS

  return (
    /* Fond blanc pur, bordure haut très fine, ombre douce vers le haut */
    <nav className="fixed bottom-0 left-0 right-0 bg-white
                    border-t border-[#E5E7EB] z-50
                    shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around py-1">
        {tabs.map(tab => {
          const isActive = pathname === tab.href
                        || pathname.startsWith(tab.href + '/')
          return (
            <Link key={tab.href} href={tab.href}
                  className="flex flex-col items-center justify-center
                             min-h-[56px] px-4 gap-1">
              {tab.icon(isActive)}
              <span className="text-[11px] font-semibold"
                    style={{ color: isActive ? '#006633' : '#9CA3AF' }}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
