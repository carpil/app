import { Pressable, StyleSheet } from 'react-native'
import { Stack, router } from 'expo-router'
import { COLORS } from '@utils/constansts/colors'
import { Ionicons } from '@expo/vector-icons'

const CloseIconButton = () => (
  <Pressable
    onPress={() => router.replace('/(tabs)')}
    style={({ pressed }) => [
      styles.iconButton,
      { backgroundColor: pressed ? COLORS.dark_gray : COLORS.raisin_black },
    ]}
  >
    <Ionicons name="close" size={16} color={COLORS.white} />
  </Pressable>
)

const BackIconButton = () => (
  <Pressable
    onPress={() => router.back()}
    style={({ pressed }) => [
      styles.iconButton,
      { backgroundColor: pressed ? COLORS.dark_gray : COLORS.raisin_black },
    ]}
  >
    <Ionicons name="arrow-back" size={16} color={COLORS.white} />
  </Pressable>
)

export default function CreateRideLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.dark_gray,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-origin"
        options={{
          title: 'Selecciona tu origen',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="select-destination"
        options={{
          title: 'Selecciona tu destino',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="select-meeting-point"
        options={{
          title: 'Punto de encuentro',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="ride-overview"
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          headerLeft: () => <BackIconButton />,
          headerRight: () => <CloseIconButton />,
        }}
      />
    </Stack>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    backgroundColor: COLORS.raisin_black,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
