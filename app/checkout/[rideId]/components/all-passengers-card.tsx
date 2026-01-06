import Avatar from '@components/avatar'
import { COLORS } from '@utils/constansts/colors'
import { View, Text } from 'react-native'
import { User } from '~types/user'

interface AllPassengersCardProps {
  passengers: User[]
}
export default function AllPassengersCard({
  passengers,
}: AllPassengersCardProps) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLORS.gray_600,
        borderRadius: 8,
        padding: 12,
        backgroundColor: COLORS.inactive_gray,
        marginTop: 15,
      }}
    >
      <Text
        style={{
          color: COLORS.white,
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: 12,
        }}
      >
        Pasajeros
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {passengers.map((passenger) => (
          <Avatar user={passenger} size={42} key={passenger.id} />
        ))}
      </View>
    </View>
  )
}
