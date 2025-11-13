import { useRouter } from 'expo-router'
import { View } from 'react-native'
import 'react-native-get-random-values'
import { useContext } from 'react'
import { SelectLocationContext } from '@context/select-location'
import SafeScreen from '@components/safe-screen'
import PlacesAutocomplete from '@components/places-autocomplete'
import { COLORS } from '@utils/constansts/colors'

export default function SelectMeetingPoint() {
  const router = useRouter()
  const { setMeetingPoint } = useContext(SelectLocationContext)

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray} keyboardAware>
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <PlacesAutocomplete
          placeholder={'¿Dónde recogerás a tus pasajeros?'}
          queryType={'establishment'}
          onPress={(location) => {
            setMeetingPoint(location)
            router.push('/create-ride/ride-overview')
          }}
        />
      </View>
    </SafeScreen>
  )
}
