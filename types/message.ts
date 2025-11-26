import { User } from './user'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export interface Message {
  id: string
  content: string
  userId: string
  senderId?: string
  timestamp?: Date
  createdAt: Date
  seenBy?: string[]
}

export interface FirestoreMessage {
  id: string
  content: string
  userId: string
  senderId?: string
  timestamp?: FirebaseFirestoreTypes.Timestamp
  createdAt: FirebaseFirestoreTypes.Timestamp
  seenBy?: string[]
}

export interface MessageBubble {
  id: string
  content: string
  createdAt: Date
  user: User
  isMe: boolean
}
