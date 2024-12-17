import { ScrollView, View } from 'react-native'
import RideCard from '../../components/ride-card'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { rides } from '../../utils/mocks/rides'

export default function Home() {
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
      </ScrollView>
    </View>
  )
}
