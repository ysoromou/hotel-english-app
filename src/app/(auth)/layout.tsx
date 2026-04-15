// Layout partagé par les pages de connexion et d'inscription
// Il centre le contenu et limite la largeur max sur grand écran
// (même si l'app est mobile-first, ça reste joli sur tablette/PC)

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
