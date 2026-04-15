import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

// Métadonnées pour le SEO et le partage (titre de l'app dans l'onglet du navigateur)
export const metadata: Metadata = {
  title: 'Hotel English Pro',
  description: 'Apprenez l\'anglais professionnel hôtelier — CAFORMAC',
}

// Configuration mobile : empêche le zoom involontaire sur les champs de formulaire
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#006633',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
