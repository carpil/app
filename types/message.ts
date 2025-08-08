import { User } from './user'

export interface Message {
  id: string
  content: string
  userId: string
  senderId?: string
  timestamp?: Date
  createdAt: Date
  seenBy?: string[]
}

export interface MessageBubble {
  id: string
  content: string
  createdAt: Date
  user: User
  isMe: boolean
}
