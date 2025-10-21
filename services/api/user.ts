import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { BootstrapResponse } from '~types/responses/bootstrap'
import { UserResponse } from '~types/responses/user'
import { UserInfoResponse } from '~types/user'

export const getUser = async (id: string, token: string) => {
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  const response = await fetch(`${API_URL}/users/${id}`, requestOptions)

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as UserResponse

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
    return null
  }

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
    return null
  }

  const data = (await response.json()) as UserInfoResponse

  return data
}
