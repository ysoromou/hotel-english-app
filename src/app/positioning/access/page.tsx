import { normalizePositioningAccessHotel } from '@/lib/positioning/collective-access'
import PositioningAccessClient from './PositioningAccessClient'

function InvalidAccessLink() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6">
      <div className="w-full max-w-md rounded-[32px] bg-white px-6 py-8 text-center shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Lien invalide</h1>
        <p className="mt-3 text-sm text-gray-600">
          Lien invalide. Merci d&apos;utiliser le lien transmis par votre hotel.
        </p>
      </div>
    </div>
  )
}

export default function PositioningAccessPage({
  searchParams,
}: {
  searchParams?: { hotel?: string }
}) {
  const hotel = normalizePositioningAccessHotel(searchParams?.hotel)

  if (!hotel) {
    return <InvalidAccessLink />
  }

  return <PositioningAccessClient hotel={hotel} />
}
