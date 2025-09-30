import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { BootstrapResponse } from '~types/responses/bootstrap'
import { UserResponse } from '~types/responses/user'

export const getUser = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as UserResponse

  return data
}

export const bootstrapMe = async () => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${API_URL}/users/me/bootstrap`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.log({ status: response.status })
    return null
  }

  const data = (await response.json()) as BootstrapResponse

  return data
}
