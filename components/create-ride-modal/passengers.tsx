import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MinusIcon, PlusIcon, UsersIcon } from '../icons'

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
          backgroundColor: '#23252F',
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
            color: 'white',
            fontSize: 16,
            marginRight: 4,
          }}
        >
          {`${passengers} ${passengerText}`}
        </Text>
        <UsersIcon color="#A0ABC0" />
      </View>
      <Pressable
        style={{
          backgroundColor: '#23252F',
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
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
