import { Stack } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import LocationProvider from './context/select-location'

export default function Layout() {
  const insets = useSafeAreaInsets()
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <View
          style={{
            ...styles.container,
            paddingTop: insets.top,
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>
      </LocationProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F52EA',
  },
})
