import Rides from 'app/ride'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Rides />
    </GestureHandlerRootView>
  )
}
