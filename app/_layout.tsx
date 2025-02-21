import { Stack } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import AppProviders from '../components/providers/app-providers'

export default function Layout() {
  return (
    <AppProviders>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </AppProviders>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
