import { createBrowserClient } from '@supabase/ssr'

// Client Supabase pour le navigateur (côté utilisateur)
// Utilisé dans les composants React pour lire/écrire des données
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
