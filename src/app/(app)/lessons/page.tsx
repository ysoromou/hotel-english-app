import { redirect } from 'next/navigation'

// La page /lessons redirige vers le dashboard
// Les leçons sont accessibles via /lessons/[metier]
export default function LessonsPage() {
  redirect('/dashboard')
}
