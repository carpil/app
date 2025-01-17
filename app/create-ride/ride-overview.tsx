import { useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { SelectLocationContext } from '../../context/select-location'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
export default function RideOverview() {
  const { origin, destination } = useContext(SelectLocationContext)

  if (!origin || !destination) {
    return <Text>Selecciona tu origen y destino</Text>
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle={'dark'}
        provider={PROVIDER_GOOGLE}
      >
        <MapViewDirections
          origin={{
            latitude: origin.location.lat!,
            longitude: origin.location.lng!,
          }}
          destination={{
            latitude: destination.location.lat!,
            longitude: destination.location.lng!,
          }}
          apikey={GOOGLE_MAPS_API_KEY}
        />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
})
