import { Text, View } from 'react-native'
import {
  AutocompleteRequestType,
  GooglePlaceData,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete'
import { Location } from '~types/location'
import { COLORS } from '@utils/constansts/colors'

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
          color: COLORS.white,
          fontSize: 22,
        }}
      >
        {data.structured_formatting.main_text}
      </Text>
      <Text
        style={{
          color: COLORS.secondary_gray,
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
  queryType?: AutocompleteRequestType
  onPress: (location: Location) => void
  onFail?: (error: any) => void
}

export default function PlacesAutocomplete({
  placeholder,
  queryType = '(regions)',
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
        type: queryType,
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
          backgroundColor: COLORS.inactive_gray,
          color: 'white',
          fontSize: 18,
        },
        row: {
          backgroundColor: COLORS.dark_gray,
        },
      }}
      textInputProps={{
        placeholderTextColor: COLORS.secondary_gray_dark,
      }}
      listUnderlayColor={COLORS.inactive_gray}
      renderRow={(data) => <PlaceRow data={data} key={data.place_id} />}
    />
  )
}
