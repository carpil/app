import { View, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Home from './app/pages/home'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Home />
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F52EA',
  },
})
