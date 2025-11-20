import { LocationIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { View } from 'react-native'
import { Marker } from 'react-native-maps'
import { Location } from '~types/location'

interface MarkerProps {
  location: Location
  color: string
}

export default function MapPoint({ location, color }: MarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: location.location.lat!,
        longitude: location.location.lng!,
      }}
      title={location.name.primary}
      description={location.name.secondary}
      pinColor={color}
    >
      <View
        style={{
          backgroundColor: COLORS.dark_gray,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: color,
          padding: 5,
        }}
      >
        <LocationIcon color={color} />
      </View>
    </Marker>
  )
}
