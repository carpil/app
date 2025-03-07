import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MinusIcon, PlusIcon, UsersIcon } from '../icons'
import { COLORS } from '../../utils/constansts/colors'

interface PassengersProps {
  passengers: number
  handleMinus: () => void
  handlePlus: () => void
}

export default function PassengersPill({
  passengers,
  handleMinus,
  handlePlus,
}: PassengersProps) {
  const passengerText = passengers === 1 ? 'pasajero' : 'pasajeros'

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          backgroundColor: COLORS.raisin_black,
          padding: 12,
          borderRadius: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleMinus}
      >
        <MinusIcon color="white" />
      </Pressable>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 16,
            marginRight: 4,
          }}
        >
          {`${passengers} ${passengerText}`}
        </Text>
        <UsersIcon color={COLORS.secondary_gray} />
      </View>
      <Pressable
        style={{
          backgroundColor: COLORS.raisin_black,
          padding: 12,
          borderRadius: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handlePlus}
      >
        <PlusIcon color="white" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark_gray,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
