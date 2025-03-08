import { StyleSheet, Pressable } from 'react-native'
import { AddIcon } from '@components/icons'
import { Link } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'

export default function CreateRideButton() {
  return (
    <Link href="/create-ride/select-origin" asChild>
      <Pressable style={styles.container}>
        <AddIcon color="white" />
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    right: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
