import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TestClient from './TestClient'

export default async function TestOnlinePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <TestClient />
    </div>
  )
}
