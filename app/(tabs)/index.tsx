import { ScrollView } from 'react-native'
import { rideRequests } from '@utils/mocks/ride-requests'
import { rides } from '@utils/mocks/rides'
import RideCard from '@components/ride-card'
import RideRequestCard from '@components/ride-request-card'
import CreateRideButton from '@components/create-ride-button'
import SafeScreen from '@components/safe-screen'

export default function Index() {
  return (
    <SafeScreen>
      <ScrollView>
        {rides.map((ride) => (
          <RideCard ride={ride} key={ride.id} />
        ))}
        {rideRequests.map((rideRequest) => (
          <RideRequestCard ride={rideRequest} key={rideRequest.id} />
        ))}
      </ScrollView>
      <CreateRideButton />
    </SafeScreen>
  )
}
