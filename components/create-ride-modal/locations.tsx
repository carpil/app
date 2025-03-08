import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Location } from '../../types/location'
import { EditIcon, LocationIcon, MoreIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { Link } from 'expo-router'

interface RideLocationsPillProps {
  origin: Location
  destination: Location
}
export default function RideLocationsPill({
  origin,
  destination,
}: RideLocationsPillProps) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <LocationIcon color={COLORS.secondary} />
            <MoreIcon color={COLORS.secondary} />
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {origin.name.primary}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.secondary_gray,
              }}
            >
              {origin.name.secondary}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <LocationIcon color={COLORS.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {destination.name.primary}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.secondary_gray,
              }}
            >
              {destination.name.secondary}
            </Text>
          </View>
        </View>
      </View>
      <Link href={'/create-ride/select-origin'} asChild>
        <Pressable>
          <EditIcon color={COLORS.secondary_gray} />
        </Pressable>
      </Link>
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
