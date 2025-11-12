import { GOOGLE_MAPS_API_KEY } from '@utils/constansts/google-maps-theme'
import { Location } from '~types/location'

interface StaticMapOptions {
  origin: Location
  destination: Location
  width?: number
  height?: number
  scale?: number
}

/**
 * Generates a Google Maps Static API URL with a route between two locations
 * @param options - Map configuration options
 * @returns Promise with the static map image URL
 */
export async function getStaticMapImageUrl({
  origin,
  destination,
  width = 640,
  height = 240,
  scale = 2,
}: StaticMapOptions): Promise<string> {
  try {
    // Fetch directions to get the encoded polyline
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.location.lat},${origin.location.lng}&destination=${destination.location.lat},${destination.location.lng}&key=${GOOGLE_MAPS_API_KEY}`

    const response = await fetch(directionsUrl)
    const data = await response.json()

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No routes found')
    }

    const encodedPolyline = data.routes[0].overview_polyline.points

    // Dark theme styling for static map (matching app theme)
    const styleParams = [
      'style=element:geometry|color:0x242f3e',
      'style=element:labels.text.fill|color:0x746855',
      'style=element:labels.text.stroke|color:0x242f3e',
      'style=feature:administrative.locality|element:labels.text.fill|color:0xd59563',
      'style=feature:poi|element:labels.text.fill|color:0xd59563',
      'style=feature:poi.park|element:geometry|color:0x263c3f',
      'style=feature:poi.park|element:labels.text.fill|color:0x6b9a76',
      'style=feature:road|element:geometry|color:0x38414e',
      'style=feature:road|element:geometry.stroke|color:0x212a37',
      'style=feature:road|element:labels.text.fill|color:0x9ca5b3',
      'style=feature:road.highway|element:geometry|color:0x746855',
      'style=feature:road.highway|element:geometry.stroke|color:0x1f2835',
      'style=feature:road.highway|element:labels.text.fill|color:0xf3d19c',
      'style=feature:transit|element:geometry|color:0x2f3948',
      'style=feature:transit.station|element:labels.text.fill|color:0xd59563',
      'style=feature:water|element:geometry|color:0x17263c',
      'style=feature:water|element:labels.text.fill|color:0x515c6d',
      'style=feature:water|element:labels.text.stroke|color:0x17263c',
      'style=feature:road|element:labels|visibility:off',
    ].join('&')

    // Generate static map URL with the route polyline, dark theme, custom colors, and HD resolution
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&scale=${scale}&${styleParams}&path=color:0x4285F4|weight:5|enc:${encodedPolyline}&markers=color:0x6F52EA|${origin.location.lat},${origin.location.lng}&markers=color:0x2AADAD|${destination.location.lat},${destination.location.lng}&key=${GOOGLE_MAPS_API_KEY}`

    return staticMapUrl
  } catch (error) {
    console.error('Error generating static map image URL:', error)
    throw error
  }
}
