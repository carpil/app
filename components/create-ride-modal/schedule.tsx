import { useState } from 'react'
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatDate } from '@utils/format-date'
import { COLORS } from '@utils/constansts/colors'

interface ScheduleProps {
  date: Date
  isValid: boolean
  setDate: (date: Date) => void
  minDate?: Date
}

export default function SchedulePill({
  date,
  isValid,
  minDate = new Date(),
  setDate,
}: ScheduleProps) {
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState<'date' | 'time'>('date')

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setDate(currentDate)
    hidePicker()
  }

  const showPicker = (mode: 'date' | 'time') => {
    setShow(true)
    setMode(mode)
  }

  const hidePicker = () => {
    setShow(false)
  }

  const { hour, dateText } = formatDate(date)

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'datetime'}
          onChange={onChange}
          locale="es-cr"
          themeVariant="dark"
          minimumDate={minDate}
        />
      )}
      {Platform.OS === 'android' && (
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Pressable
            style={isValid ? styles.input : styles.inputInvalid}
            onPress={() => showPicker('date')}
          >
            <Text style={isValid ? styles.text : styles.textInvalid}>
              {dateText}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => showPicker('time')}
            style={isValid ? styles.input : styles.inputInvalid}
          >
            <Text style={isValid ? styles.text : styles.textInvalid}>
              {hour}
            </Text>
          </Pressable>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              onChange={onChange}
              locale="es-cr"
              themeVariant="dark"
              minimumDate={minDate}
            />
          )}
        </View>
      )}
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
    justifyContent: 'center',
  },
  input: {
    backgroundColor: COLORS.raisin_black,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputInvalid: {
    backgroundColor: COLORS.raisin_black,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderColor: 'red',
    borderWidth: 1,
  },
  text: {
    color: COLORS.white,
    fontSize: 18,
  },
  textInvalid: {
    color: COLORS.secondary_gray_dark,
    fontSize: 18,
  },
})
