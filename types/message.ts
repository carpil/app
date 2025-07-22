export interface Message {
  id: string
  content: string
  userId: string
  senderId?: string
  timestamp?: Date
  createdAt: Date
  seenBy?: string[]
}
