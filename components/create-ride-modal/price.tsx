import { View, StyleSheet, TextInput, Text } from 'react-native'
import { COLORS } from '../../utils/constansts/colors'

interface PriceProps {
  price: string
  handleChangePrice: (price: string) => void
  isValid: boolean
}
export default function PricePill({
  price,
  isValid,
  handleChangePrice,
}: PriceProps) {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'white',
          fontSize: 14,
        }}
      >
        Precio por pasajero (₡)
      </Text>
      <TextInput
        style={isValid ? styles.input : styles.inputInvalid}
        onChangeText={handleChangePrice}
        value={price}
        placeholder="5000"
        keyboardType="numeric"
        placeholderTextColor={COLORS.secondary_gray_dark}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark_gray,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: COLORS.raisin_black,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    minWidth: 150,
  },
  inputInvalid: {
    backgroundColor: COLORS.raisin_black,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    minWidth: 150,
    borderColor: 'red',
    borderWidth: 1,
  },
})
