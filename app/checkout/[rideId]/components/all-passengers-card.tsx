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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.gray_600,
        borderRadius: 8,
        padding: 8,
        backgroundColor: COLORS.inactive_gray,
        marginTop: 15,
        flexWrap: 'wrap',
      }}
    >
      {passengers.map((passenger) => (
        <Avatar user={passenger} size={42} key={passenger.id} />
      ))}
      <Text
        style={{
          color: COLORS.gray_400,
          fontSize: 12,
        }}
      >
        {'Pasajeros'}
      </Text>
    </View>
  )
}
