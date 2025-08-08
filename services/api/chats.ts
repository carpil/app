import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { ChatResponse } from '~types/responses/chat'

export const getChats = async () => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return []
  }
  const data = (await response.json()) as ChatResponse[]

  return data
}

export const getChat = async (id: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/chats/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as ChatResponse

  return data
}

export const sendMessage = async (chatId: string, message: string) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: message }),
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as ChatResponse

  return data
}
