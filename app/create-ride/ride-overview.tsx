import { useContext } from 'react'
import { View, Text } from 'react-native'
import { SelectLocationContext } from '../context/select-location'

export default function RideOverview() {
  const { origin, destination } = useContext(SelectLocationContext)
  return (
    <View>
      <Text>Ride Overview</Text>
      <Text>Origin: {origin?.name.primary}</Text>
      <Text>Destination: {destination?.name.primary}</Text>
    </View>
  )
}
