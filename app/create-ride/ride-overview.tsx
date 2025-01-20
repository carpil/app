import { useContext, useRef } from 'react'
import { View, StyleSheet, Platform, Text } from 'react-native'
import { SelectLocationContext } from '../../context/select-location'
import MapView, { Marker, Region } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { googleMapsTheme } from '../../utils/constansts/google-maps-theme'
import { Modalize } from 'react-native-modalize'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import RideLocationsPill from '../../components/create-ride-modal/locations'
import PassengersPill from '../../components/create-ride-modal/passengers'
import SchedulePill from '../../components/create-ride-modal/schedule'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const COSTA_RICA_REGION: Region = {
  latitude: 9.7489,
  latitudeDelta: 5.0,
  longitude: -83.7534,
  longitudeDelta: 5.0,
}

export default function RideOverview() {
  const { origin, destination } = useContext(SelectLocationContext)
  const mapRef = useRef(null)
  const modalizeRef = useRef<Modalize>(null)

  if (!origin || !destination) {
    return <Text>Selecciona tu origen y destino</Text>
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          userInterfaceStyle={'dark'}
          customMapStyle={googleMapsTheme}
          initialRegion={COSTA_RICA_REGION}
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
            strokeWidth={5}
            strokeColor={'#6F52EA'}
          />
          <Marker
            coordinate={{
              latitude: origin.location.lat!,
              longitude: origin.location.lng!,
            }}
            title="Origin"
            description="Origin"
          />
          <Marker
            coordinate={{
              latitude: destination.location.lat!,
              longitude: destination.location.lng!,
            }}
            title="Destination"
            description="Destination"
          />
        </MapView>

        <Modalize
          ref={modalizeRef}
          alwaysOpen={Platform.OS === 'ios' ? 150 : 100}
          modalStyle={{
            backgroundColor: 'transparent',
            marginBottom: 30,
          }}
          modalTopOffset={Platform.OS === 'ios' ? 120 : 0}
        >
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              gap: 20,
            }}
          >
            <RideLocationsPill origin={origin} destination={destination} />
            <PassengersPill />
            <SchedulePill />
          </View>
        </Modalize>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#111827',
  },
})
