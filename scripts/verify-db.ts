// Script de vérification — crée un user test, se connecte, et vérifie les données
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://szonjhazchqmgnkwzldh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6b25qaGF6Y2hxbWdua3d6bGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzA2ODYsImV4cCI6MjA4NDY0NjY4Nn0.a1cgdld6ZrBZK7IPmMCotcu79cqyu9i6x9qA1cYJ6x8'
)

async function verify() {
  console.log('=== Vérification base de données ===\n')

  // 1. Créer un compte test
  console.log('1. Création compte test...')
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'test-verify@hotelenglish.com',
    password: 'test123456',
  })

  if (signUpError && !signUpError.message.includes('already registered')) {
    console.log(`❌ Erreur inscription: ${signUpError.message}`)
    // Essayer de se connecter au cas où le compte existe déjà
  }

  // 2. Se connecter
  console.log('2. Connexion...')
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'test-verify@hotelenglish.com',
    password: 'test123456',
  })

  if (signInError) {
    console.log(`⚠️  Connexion échouée: ${signInError.message}`)
    console.log('')
    console.log('Cela peut arriver si la confirmation email est activée.')
    console.log('Vérifie dans Supabase > Table Editor que les tables contiennent des données.')
    console.log('')
    console.log('Pour désactiver la confirmation email (recommandé pour le dev) :')
    console.log('  Supabase > Authentication > Providers > Email > Désactiver "Confirm email"')
    return
  }

  console.log('✅ Connecté !\n')

  // 3. Vérifier chaque table
  const tables = [
    { name: 'actions_metier', expected: 20 },
    { name: 'phrases', expected: 100 },
    { name: 'quiz', expected: 40 },
    { name: 'scenarios', expected: 20 },
  ]

  let allOk = true

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`❌ ${table.name}: ERREUR — ${error.message}`)
      allOk = false
    } else {
      const ok = (count ?? 0) >= table.expected
      const icon = ok ? '✅' : '⚠️'
      console.log(`${icon} ${table.name}: ${count} lignes (attendu ≥${table.expected})`)
      if (!ok) allOk = false
    }
  }

  // 4. Vérifier le profil auto-créé
  console.log('')
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, role, niveau_actuel')
    .single()

  if (profile) {
    console.log(`✅ Profil auto-créé: ${profile.email} (${profile.role}, ${profile.niveau_actuel})`)
  } else {
    console.log('⚠️  Profil non trouvé (le trigger fonctionne peut-être pas encore)')
  }

  // 5. Exemples de données
  console.log('\n=== Exemples ===\n')

  const { data: actions } = await supabase
    .from('actions_metier')
    .select('id, metier, action')
    .limit(3)

  if (actions && actions.length > 0) {
    actions.forEach(a => console.log(`  ${a.id} | ${a.metier} | ${a.action}`))
  }

  const { data: phrasesList } = await supabase
    .from('phrases')
    .select('phrase_fr, phrase_en')
    .limit(3)

  if (phrasesList && phrasesList.length > 0) {
    console.log('')
    phrasesList.forEach(p => console.log(`  "${p.phrase_fr}" → "${p.phrase_en}"`))
  }

  // 6. Nettoyage : supprimer le compte test
  // (on le garde pour le moment, on le supprimera plus tard)

  console.log('\n' + (allOk ? '🎉 BASE DE DONNÉES OK — Toutes les données sont là !' : '⚠️  Certaines tables semblent incomplètes'))

  // Déconnexion
  await supabase.auth.signOut()
}

verify()
