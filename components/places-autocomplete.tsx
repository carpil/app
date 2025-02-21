import { Text, View } from 'react-native'
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete'
import { Location } from '../types/location'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export const PlaceRow = ({ data }: { data: GooglePlaceData }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 22,
        }}
      >
        {data.structured_formatting.main_text}
      </Text>
      <Text
        style={{
          color: '#A0ABC0',
          fontSize: 12,
        }}
      >
        {data.structured_formatting.secondary_text}
      </Text>
    </View>
  )
}

interface Props {
  placeholder: string
  onPress: (location: Location) => void
  onFail?: (error: any) => void
}

export default function PlacesAutocomplete({
  placeholder,
  onPress,
  onFail,
}: Props) {
  return (
    <GooglePlacesAutocomplete
      fetchDetails
      isRowScrollable={false}
      enablePoweredByContainer={false}
      placeholder={placeholder}
      minLength={2}
      query={{
        key: GOOGLE_MAPS_API_KEY,
        language: 'es',
        components: 'country:cr',
        type: '(regions)',
      }}
      renderDescription={(data) => {
        const name = data.structured_formatting.main_text
        return name
      }}
      onPress={(data, detail) => {
        const location: Location = {
          id: data.place_id,
          name: {
            primary: data.structured_formatting.main_text,
            secondary: data.structured_formatting.secondary_text,
          },
          location: {
            lat: detail?.geometry.location.lat,
            lng: detail?.geometry.location.lng,
          },
        }
        onPress(location)
      }}
      onFail={onFail}
      styles={{
        textInput: {
          backgroundColor: '#1F2937',
          color: 'white',
          fontSize: 18,
        },
        row: {
          backgroundColor: '#111827',
        },
      }}
      textInputProps={{
        placeholderTextColor: '#6C768A',
      }}
      listUnderlayColor={'#1F2937'}
      renderRow={(data) => <PlaceRow data={data} key={data.place_id} />}
    />
  )
}
