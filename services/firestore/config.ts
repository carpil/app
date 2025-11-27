import { getApp } from '@react-native-firebase/app'
import { getFirestore } from '@react-native-firebase/firestore'

class FirestoreConfig {
  private static instance: ReturnType<typeof getFirestore> | null = null
  private static databaseName: string =
    process.env.EXPO_PUBLIC_FIRESTORE_DATABASE ?? '(default)'

  static getDb() {
    if (!this.instance) {
      console.log('🔥 Initializing Firestore with database:', this.databaseName)
      this.instance = getFirestore(getApp(), this.databaseName)
    }
    return this.instance
  }

  static getDatabaseName() {
    return this.databaseName
  }

  static reset() {
    this.instance = null
  }
}

export default FirestoreConfig
