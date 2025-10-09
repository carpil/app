import { Text, View, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import SafeScreen from '@components/safe-screen'
import { COLORS } from '@utils/constansts/colors'

export default function SinpeMovilPayment() {
  const { rideId } = useLocalSearchParams<{ rideId: string }>()

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        <Text style={styles.title}>SINPE Móvil</Text>
        <Text style={styles.subtitle}>Ride ID: {rideId}</Text>
        {/* Add your SINPE Móvil payment form here */}
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
})
