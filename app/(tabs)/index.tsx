import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import SafeScreen from '@components/safe-screen'
import SegmentedControl from '@components/segmented-control'
import RidesList from '@components/rides-list'
import RideRequestsList from '@components/ride-requests-list'
import CreateRideButton from '@components/create-ride-button'

export default function Index() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const segments = ['Ofreciendo ride', 'Buscando ride']

  return (
    <SafeScreen applyTopInset={false}>
      <View style={styles.container}>
        <SegmentedControl
          segments={segments}
          selectedIndex={selectedIndex}
          onIndexChange={setSelectedIndex}
        />
        <View style={styles.content}>
          <View
            style={[styles.listContainer, selectedIndex !== 0 && styles.hidden]}
          >
            <RidesList />
          </View>
          <View
            style={[styles.listContainer, selectedIndex !== 1 && styles.hidden]}
          >
            <RideRequestsList />
          </View>
        </View>
      </View>
      <CreateRideButton />
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none', // Prevents touch events when hidden
  },
})
