import { API_URL } from '@utils/constansts/api'
import { UserResponse } from '~types/responses/user'

export const getUser = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as UserResponse

  return data
}
