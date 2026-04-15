import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Ce fichier intercepte chaque navigation pour vérifier la connexion
// Il doit être à la RACINE du projet (pas dans src/)
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// Ne vérifier que les pages de l'app, pas les fichiers statiques
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|audio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
