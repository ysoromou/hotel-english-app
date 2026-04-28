import PositioningParticipantClient from './PositioningParticipantClient'

export default function PositioningParticipantPage({ params }: { params: { token: string } }) {
  return <PositioningParticipantClient token={params.token} />
}
