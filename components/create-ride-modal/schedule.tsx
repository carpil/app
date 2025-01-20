import { View, StyleSheet, Pressable, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'

export default function SchedulePill() {
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setDate(currentDate)
    hidePicker()
  }

  const showPicker = () => {
    setShow(true)
  }

  const hidePicker = () => {
    setShow(false)
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={showPicker}>
        <Text
          style={{
            fontSize: 18,
            color: 'white',
          }}
        >
          {date.toLocaleDateString('es-CR')}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          onChange={onChange}
          locale="cr"
          themeVariant="dark"
          minimumDate={new Date()}
        />
      )}
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
    justifyContent: 'center',
  },
})
