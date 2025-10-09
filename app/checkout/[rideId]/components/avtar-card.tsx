import Avatar from '@components/avatar'
import { COLORS } from '@utils/constansts/colors'
import { View, Text } from 'react-native'
import { User } from '~types/user'

interface AvatarCardProps {
  user: User
  role: 'driver' | 'passenger'
}
export default function AvatarCard({ user, role }: AvatarCardProps) {
  const roleText = role === 'driver' ? 'Conductor' : 'Pasajero'
  return (
    <View
      key={user.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.gray_600,
        borderRadius: 8,
        padding: 8,
        backgroundColor: COLORS.inactive_gray,
      }}
    >
      <Avatar user={user} size={42} />
      <View
        style={{
          gap: 4,
        }}
      >
        <View>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              color: COLORS.gray_400,
              fontSize: 12,
            }}
          >
            {roleText}
          </Text>
        </View>
      </View>
    </View>
  )
}
