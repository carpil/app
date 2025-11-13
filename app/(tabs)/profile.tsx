import { Text, View, StyleSheet, Pressable, Linking } from 'react-native'
import Screen from '@components/screen'
import { useAuthStore } from 'store/useAuthStore'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { router } from 'expo-router'
import ActionButton from '@components/design-system/buttons/action-button'
import Avatar from '@components/avatar'
import { COLORS } from '@utils/constansts/colors'
import { ChevronRightIcon } from '@components/icons'

export default function Profile() {
  const user = useAuthStore((state) => state.user)

  const logout = useAuthStore((state) => state.logout)
  const onLogout = async () => {
    const auth = getAuth()
    await signOut(auth)
    logout()
    router.replace('/login')
  }

  const handleSupportPress = async () => {
    await Linking.openURL('https://wa.me/50684481439')
  }

  const handleReportErrorPress = async () => {
    await Linking.openURL('https://wa.me/50684481439')
  }

  if (!user) {
    return null
  }

  return (
    <Screen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        {/* User Info Section */}
        <View style={styles.card}>
          <Avatar
            user={{
              id: user.id,
              name: user.name,
              profilePicture: user.profilePicture,
            }}
            size={80}
          />
          <Text style={styles.userName}>{user.name}</Text>
          {user.email && <Text style={styles.userEmail}>{user.email}</Text>}
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={handleSupportPress}
          >
            <Text style={styles.menuItemText}>Soporte técnico</Text>
            <ChevronRightIcon color={COLORS.gray_400} size={20} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={handleReportErrorPress}
          >
            <Text style={styles.menuItemText}>Reportar un error</Text>
            <ChevronRightIcon color={COLORS.gray_400} size={20} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <ActionButton
            text="Cerrar sesión"
            onPress={onLogout}
            type="primary"
          />
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.inactive_gray,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_400,
  },
  userName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: COLORS.gray_400,
    fontSize: 14,
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inactive_gray,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray_400,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemText: {
    color: COLORS.white,
    fontSize: 16,
  },
  logoutContainer: {
    marginTop: 'auto',
  },
})
