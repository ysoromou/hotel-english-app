import { redirect } from 'next/navigation'

// La page d'accueil redirige automatiquement vers la connexion
// Plus tard, si l'utilisateur est déjà connecté, on le redirigera vers le dashboard
export default function Home() {
  redirect('/login')
}
