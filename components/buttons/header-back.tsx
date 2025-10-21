import { TouchableOpacity } from 'react-native'
import { BackIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { useRouter } from 'expo-router'

export default function HeaderBack() {
  const router = useRouter()

  return (
    <TouchableOpacity
      onPress={() => router.back()}
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
