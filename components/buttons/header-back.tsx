import { TouchableOpacity } from 'react-native'
import { BackIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { useRouter } from 'expo-router'

export default function HeaderBack() {
  const router = useRouter()

  const handleBack = () => {
    // Check if we can navigate back in the stack
    if (router.canGoBack()) {
      router.back()
    } else {
      // Fallback to home tab when coming from notifications on iOS
      router.replace('/(tabs)/')
    }
  }

  return (
    <TouchableOpacity
      onPress={handleBack}
      style={{
        marginLeft: 2,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <BackIcon color={COLORS.white} />
    </TouchableOpacity>
  )
}
