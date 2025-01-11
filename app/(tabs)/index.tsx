import { ScrollView } from 'react-native'
import { rideRequests } from '../../utils/mocks/ride-requests'
import { rides } from '../../utils/mocks/rides'
import RideCard from '../../components/ride-card'
import RideRequestCard from '../../components/ride-request-card'
import Screen from '../../components/screen'
import CreateRideButton from '../../components/create-ride-button'

export default function Index() {
  return (
    <Screen>
      <ScrollView>
        {rides.map((ride) => (
          <RideCard ride={ride} key={ride.id} />
        ))}
        {rideRequests.map((rideRequest) => (
          <RideRequestCard ride={rideRequest} key={rideRequest.id} />
        ))}
      </ScrollView>
      <CreateRideButton />
    </Screen>
  )
}
