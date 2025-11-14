import { useRouter } from 'expo-router'
import { View } from 'react-native'
import 'react-native-get-random-values'
import { useContext } from 'react'
import { SelectLocationContext } from '@context/select-location'
import SafeScreen from '@components/safe-screen'
import PlacesAutocomplete from '@components/places-autocomplete'
import { COLORS } from '@utils/constansts/colors'

export default function SelectDestination() {
  const { setDestination } = useContext(SelectLocationContext)
  const router = useRouter()

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray} applyTopInset={false}>
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <PlacesAutocomplete
          placeholder={'¿A dónde vas?'}
          onPress={(location) => {
            setDestination(location)
            router.push('/create-ride/select-meeting-point')
          }}
        />
      </View>
    </SafeScreen>
  )
}
