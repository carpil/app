import { ScrollView, View } from 'react-native'
import RideCard from '../../components/ride-card'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
      </ScrollView>
    </View>
  )
}
