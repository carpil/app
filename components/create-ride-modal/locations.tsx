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
