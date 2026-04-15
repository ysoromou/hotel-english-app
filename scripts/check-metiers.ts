import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://szonjhazchqmgnkwzldh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6b25qaGF6Y2hxbWdua3d6bGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzA2ODYsImV4cCI6MjA4NDY0NjY4Nn0.a1cgdld6ZrBZK7IPmMCotcu79cqyu9i6x9qA1cYJ6x8'
)

async function check() {
  // Login
  await supabase.auth.signInWithPassword({
    email: 'test-verify@hotelenglish.com',
    password: 'test123456',
  })

  // Get distinct metier values
  const { data } = await supabase
    .from('actions_metier')
    .select('metier')

  const metiers = [...new Set((data ?? []).map(a => a.metier))]

  console.log('Valeurs metier dans la base :')
  for (const m of metiers) {
    const bytes = Buffer.from(m, 'utf-8')
    console.log(`  "${m}" (${bytes.length} bytes) → hex: ${bytes.toString('hex')}`)
  }

  // Compare with expected
  const expected = ['Réception', 'Housekeeping', 'Restaurant', 'Sécurité']
  console.log('\nComparaison :')
  for (const e of expected) {
    const match = metiers.find(m => m === e)
    console.log(`  "${e}" → ${match ? 'MATCH' : 'PAS DE MATCH'}`)
  }

  await supabase.auth.signOut()
}

check()
