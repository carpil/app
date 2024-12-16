import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carpil</Text>
      <Text style={styles.slogan}>Viajamos juntos. Ahorramos juntos.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F52EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'white',
  },
  slogan: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  }
})
