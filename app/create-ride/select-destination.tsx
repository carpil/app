import { Tabs, useRouter } from 'expo-router'
import { View, Text } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import 'react-native-get-random-values'
import { Location } from '../../types/location'
import { useContext } from 'react'
import { SelectLocationContext } from '../../context/select-location'
import SafeScreen from '../../components/safe-screen'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

export default function SelectDestination() {
  const { setDestination } = useContext(SelectLocationContext)
  const router = useRouter()

  return (
    <SafeScreen backgroundColor={'#111827'}>
      <Tabs.Screen
        options={{
          tabBarActiveBackgroundColor: '#1F2937',
        }}
      />
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <GooglePlacesAutocomplete
          fetchDetails
          isRowScrollable={false}
          enablePoweredByContainer={false}
          placeholder={'Busca tu destino'}
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
            setDestination(location)
            router.push('/create-ride/ride-overview')
          }}
          onFail={(error) => console.error(error)}
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
          listUnderlayColor={'#1F2937'}
          renderRow={(data) => (
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
          )}
        />
      </View>
    </SafeScreen>
  )
}
