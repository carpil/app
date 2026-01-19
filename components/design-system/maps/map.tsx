import { useRef, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import {
  GOOGLE_MAPS_API_KEY,
  googleMapsTheme,
} from '@utils/constansts/google-maps-theme'
import MapView, { LatLng, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { Location } from '~types/location'
import { COLORS } from '@utils/constansts/colors'
import MapPoint from './point'

export const COSTA_RICA_REGION: Region = {
  latitude: 9.7489,
  latitudeDelta: 5.0,
  longitude: -83.7534,
  longitudeDelta: 5.0,
}

const MARKER_COLORS = {
  origin: COLORS.primary,
  destination: COLORS.secondary,
  meetingPoint: COLORS.star_yellow,
}

const toCoordinate = (location: Location): LatLng => ({
  latitude: location.location.lat!,
  longitude: location.location.lng!,
})

interface MapProps {
  origin: Location
  destination: Location
  meetingPoint?: Location
}

export default function Map({ origin, destination, meetingPoint }: MapProps) {
  const mapRef = useRef<MapView>(null)

  const coordinates = useMemo(() => {
    const points = [toCoordinate(origin), toCoordinate(destination)]
    if (meetingPoint) {
      points.push(toCoordinate(meetingPoint))
    }
    return points
  }, [origin, destination, meetingPoint])

  const edgePadding = useMemo(() => {
    return {
      top: 220,
      right: 150,
      bottom: 300,
      left: 150,
    }
  }, [])

  const handleFitToCoordinates = () => {
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding,
      animated: true,
    })
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      userInterfaceStyle={'dark'}
      customMapStyle={googleMapsTheme}
      initialRegion={COSTA_RICA_REGION}
      provider={PROVIDER_GOOGLE}
    >
      <MapViewDirections
        origin={coordinates[0]}
        destination={coordinates[1]}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={5}
        strokeColor={COLORS.primary}
        strokeColors={[COLORS.primary]}
        onReady={handleFitToCoordinates}
      />
      <MapPoint location={origin} color={MARKER_COLORS.origin} />
      <MapPoint location={destination} color={MARKER_COLORS.destination} />
      {meetingPoint && (
        <MapPoint location={meetingPoint} color={MARKER_COLORS.meetingPoint} />
      )}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
