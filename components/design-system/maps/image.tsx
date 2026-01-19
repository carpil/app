import { View, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { Location } from '~types/location'
import { useEffect, useState, useMemo } from 'react'
import { getStaticMapImageUrl } from 'services/maps/static-map'

interface MapImageProps {
  origin: Location
  destination: Location
  width?: number
  height?: number
}

const MAP_PADDING = {
  top: 220,
  right: 150,
  bottom: 300,
  left: 150,
}

export default function MapImage({
  origin,
  destination,
  width = 640,
  height = 240,
}: MapImageProps) {
  const [mapImageUrl, setMapImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const padding = useMemo(() => MAP_PADDING, [])

  useEffect(() => {
    const fetchMapImage = async () => {
      try {
        const url = await getStaticMapImageUrl({
          origin,
          destination,
          width,
          height,
          padding,
        })
        setMapImageUrl(url)
      } catch (error) {
        console.error('Error fetching map image:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMapImage()
  }, [origin, destination, width, height, padding])

  return (
    <View style={[styles.mapContainer, { height }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        mapImageUrl && (
          <Image
            source={{ uri: mapImageUrl }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    backgroundColor: COLORS.inactive_gray,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
