import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { BootstrapResponse } from '~types/responses/bootstrap'
import { UserResponse } from '~types/responses/user'
import { UserInfoResponse } from '~types/user'
import { logger } from '@utils/logs'

export const getUser = async (id: string, token: string) => {
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  const response = await fetch(`${API_URL}/users/${id}`, requestOptions)

  if (!response.ok) {
    logger.error('Failed to fetch user', {
      action: 'get_user_failed',
      metadata: {
        status: response.status,
        userId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as UserResponse

  logger.info('User fetched successfully', {
    action: 'get_user_success',
    metadata: {
      userId: id,
    },
  })

  return data
}

export const bootstrapMe = async () => {
  const token = useAuthStore.getState().token

  const requestOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(`${API_URL}/users/me/bootstrap`, requestOptions)

  const data = await response.json()
  if (!response.ok) {
    logger.error('Failed to bootstrap user', {
      action: 'bootstrap_me_failed',
      metadata: {
        status: response.status,
      },
    })
    return null
  }

  logger.info('User bootstrapped successfully', {
    action: 'bootstrap_me_success',
    metadata: {
      userId: data.user?.id,
    },
  })

  return data as BootstrapResponse
}

export const getUserInfo = async (id: string) => {
  const token = useAuthStore.getState().token

  const requestOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(`${API_URL}/users/${id}/info`, requestOptions)

  if (!response.ok) {
    logger.error('Failed to fetch user info', {
      action: 'get_user_info_failed',
      metadata: {
        status: response.status,
        userId: id,
      },
    })
    return null
  }

  const data = (await response.json()) as UserInfoResponse

  logger.info('User info fetched successfully', {
    action: 'get_user_info_success',
    metadata: {
      userId: id,
    },
  })

  return data
}
