import { API_URL } from '@utils/constansts/api'
import { SignUpResponse } from '~types/responses/auth'
import { User } from '~types/user'

export const signUp = async ({
  user,
  token,
}: {
  user: User
  token: string
}) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    console.log({ status: response.status, error })
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { message, user: userResponse } = data

  console.log({ message, userResponse })

  return userResponse
}

export const login = async ({ user, token }: { user: User; token: string }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...user,
      name: 'Test',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.log('Login error:', { status: response.status, error })
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { message, user: userResponse } = data

  console.log('Login success:', { message, userResponse })
  return userResponse
}
