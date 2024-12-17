import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { rides } from '../utils/mocks/rides'
import RideCard from '../components/ride-card'
import { rideRequests } from '../utils/mocks/ride-requests'
import RideRequestCard from '../components/ride-request-card'

export default function Index() {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingHorizontal: 10,
      }}
    >
      <ScrollView>
        {rides.map((ride) => (
          <RideCard ride={ride} key={ride.id} />
        ))}
        {rideRequests.map((rideRequest) => (
          <RideRequestCard ride={rideRequest} key={rideRequest.id} />
        ))}
      </ScrollView>
    </View>
  )
}
