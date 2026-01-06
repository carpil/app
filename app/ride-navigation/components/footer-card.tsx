import { View, Text, StyleSheet } from 'react-native'
import ActionButton from '@components/design-system/buttons/action-button'
import { COLORS } from '@utils/constansts/colors'
import { formatCRC } from '@utils/currency'

interface FooterCardProps {
  isDriver: boolean
  price: number
  onFinishRide: () => void
}
export default function FooterCard({
  isDriver,
  price,
  onFinishRide,
}: FooterCardProps) {
  if (isDriver) {
    return (
      <ActionButton
        onPress={onFinishRide}
        text="Completar viaje"
        type="primary"
      />
    )
  }
  return (
    <View style={styles.paymentInfoContainer}>
      <Text style={styles.paymentInfoLabel}>Total a pagar:</Text>
      <Text style={styles.paymentInfoAmount}>{formatCRC(price)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  paymentInfoContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    alignItems: 'center',
  },
  paymentInfoLabel: {
    color: COLORS.gray_400,
    fontSize: 14,
    marginBottom: 4,
  },
  paymentInfoAmount: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
})
