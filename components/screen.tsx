import { View } from 'react-native'

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: '#6F52EA',
        paddingTop: 12,
      }}
    >
      {children}
    </View>
  )
}
