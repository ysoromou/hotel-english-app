import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// API de déconnexion — détruit la session Supabase et redirige vers login
export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
