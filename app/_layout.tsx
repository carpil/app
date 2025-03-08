import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import AppProviders from '../components/providers/app-providers'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProviders>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
