import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MinusIcon, PlusIcon, UsersIcon } from '../icons'

export default function PassengersPill() {
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
          3 Pasajeros
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
