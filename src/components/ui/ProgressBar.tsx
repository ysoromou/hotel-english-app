// Barre de progression — utilisée partout dans l'app
// Affiche un pourcentage sous forme de barre colorée

interface ProgressBarProps {
  value: number      // 0 à 100
  color?: string     // classe Tailwind pour la couleur (ex: 'bg-reception')
  size?: 'sm' | 'md' // hauteur de la barre
}

export default function ProgressBar({ value, color = 'bg-primary', size = 'md' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const height = size === 'sm' ? 'h-2' : 'h-3'

  return (
    <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden shadow-inner`}>
      <div
        className={`${height} ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
