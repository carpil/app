import { View, Text, StyleSheet } from 'react-native'
import { KebabIcon, LocationIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { Location } from '~types/location'

interface LocationCardProps {
  origin: Location
  destination: Location
}
export default function LocationCard({
  origin,
  destination,
}: LocationCardProps) {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <LocationIcon color={COLORS.primary} />
        <View>
          <Text style={styles.title}>{origin.name.primary}</Text>
          <Text style={styles.subtitle}>{origin.name.secondary}</Text>
        </View>
      </View>
      <View style={{ marginVertical: 3, marginLeft: 3 }}>
        <KebabIcon color={COLORS.white} size={16} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <LocationIcon color={COLORS.secondary} />
        <View>
          <Text style={styles.title}>{destination.name.primary}</Text>
          <Text style={styles.subtitle}>{destination.name.secondary}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark_gray,
    padding: 15,
    borderRadius: 10,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
})
