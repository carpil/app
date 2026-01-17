import { useState } from 'react'
import { Platform, View, StyleSheet, Pressable, Text } from 'react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { COLORS } from '@utils/constansts/colors'
import { formatDate } from '@utils/format-date'

interface ScheduleProps {
  date: Date
  isValid: boolean
  setDate: (date: Date) => void
  minDate?: Date
}

type PickerMode = 'date' | 'time'

export default function SchedulePill({
  date,
  minDate = new Date(),
  setDate,
}: ScheduleProps) {
  const [showAndroidPicker, setShowAndroidPicker] = useState(false)
  const [androidPickerMode, setAndroidPickerMode] = useState<PickerMode>('date')

  const { dateText, hour } = formatDate(date)

  const handleAndroidPress = () => {
    setAndroidPickerMode('date')
    setShowAndroidPicker(true)
  }

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    if (Platform.OS === 'android') {
      setShowAndroidPicker(false)

      if (event.type === 'set' && selectedDate) {
        if (androidPickerMode === 'date') {
          setDate(selectedDate)
          setAndroidPickerMode('time')
          setShowAndroidPicker(true)
        } else {
          setDate(selectedDate)
        }
      }
    } else {
      if (selectedDate) {
        setDate(selectedDate)
      }
    }
  }

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <DateTimePicker
          value={date}
          mode="datetime"
          display="spinner"
          onChange={handleChange}
          minimumDate={minDate}
          locale="es-CR"
          themeVariant="dark"
          style={styles.iosPicker}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleAndroidPress}
        style={({ pressed }) => [
          styles.androidButton,
          pressed && styles.androidButtonPressed,
        ]}
      >
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{dateText}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.timeText}>{hour}</Text>
        </View>
        <Text style={styles.editText}>Cambiar</Text>
      </Pressable>

      {showAndroidPicker && (
        <DateTimePicker
          value={date}
          mode={androidPickerMode}
          display="default"
          onChange={handleChange}
          minimumDate={minDate}
          locale="es-CR"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark_gray,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  iosPicker: {
    width: '100%',
    height: 200,
  },
  androidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 8,
  },
  androidButtonPressed: {
    opacity: 0.8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    color: COLORS.gray_400,
    fontSize: 16,
  },
  timeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  editText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
})
