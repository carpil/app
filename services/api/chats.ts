import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { ChatResponse } from '~types/responses/chat'
import { logger } from '@utils/logs'

export const getChats = async () => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    logger.error('Failed to fetch chats', {
      action: 'get_chats_failed',
      metadata: {
        status: response.status,
      },
    })
    return []
  }
  const data = (await response.json()) as ChatResponse[]

  logger.info('Chats fetched successfully', {
    action: 'get_chats_success',
    metadata: {
      count: data.length,
    },
  })

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
    logger.error('Failed to fetch chat', {
      action: 'get_chat_failed',
      metadata: {
        status: response.status,
        chatId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as ChatResponse

  logger.info('Chat fetched successfully', {
    action: 'get_chat_success',
    metadata: {
      chatId: id,
    },
  })

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
    logger.error('Failed to send message', {
      action: 'send_message_failed',
      metadata: {
        status: response.status,
        chatId,
      },
    })
    return null
  }

  const data = (await response.json()) as ChatResponse

  logger.info('Message sent successfully', {
    action: 'send_message_success',
    metadata: {
      chatId,
    },
  })

  return data
}
