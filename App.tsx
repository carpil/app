import { View, StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Index from './app/(tabs)'

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Index />
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
