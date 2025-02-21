import { Tabs, useRouter } from 'expo-router'
import { View } from 'react-native'
import 'react-native-get-random-values'
import { useContext } from 'react'
import { SelectLocationContext } from '../../context/select-location'
import SafeScreen from '../../components/safe-screen'
import PlacesAutocomplete from '../../components/places-autocomplete'

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
        <PlacesAutocomplete
          placeholder={'Busca tu destino'}
          onPress={(location) => {
            setDestination(location)
            router.push('/create-ride/ride-overview')
          }}
        />
      </View>
    </SafeScreen>
  )
}
