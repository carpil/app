import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { SignUpResponse } from '~types/responses/auth'
import { User } from '~types/user'
import { debugApiRequest, debugApiResponse } from '@utils/debug-api'

const usersUrl = `${API_URL}/users`
export const signUp = async ({ user }: { user: User }) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${usersUrl}/signup`, {
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

export const login = async ({ user }: { user: User }) => {
  const token = useAuthStore.getState().token
  const response = await fetch(`${usersUrl}/login`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...user,
      name: 'Test', // TODO: Remove this
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

export const socialLogin = async ({
  user,
  token,
}: {
  user: User
  token: string
}) => {
  if (!token) {
    console.error('No token provided for social login')
    return null
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...user }),
  }

  debugApiRequest(`${usersUrl}/login/social`, requestOptions, 'Social Login')

  const response = await fetch(`${usersUrl}/login/social`, requestOptions)

  await debugApiResponse(response, 'Social Login')

  if (!response.ok) {
    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const htmlError = await response.text()
      console.error(
        'Received HTML response instead of JSON:',
        htmlError.substring(0, 200),
      )
      return null
    }

    try {
      const error = await response.json()
      console.log('Social login error:', { status: response.status, error })
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError)
    }
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { message, user: userResponse } = data

  console.log('Social login success:', { message, userResponse })
  return userResponse
}

export const signUpEmail = async ({
  user,
  token,
}: {
  user: User
  token: string
}) => {
  const signupData = {
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    email: user.email,
  }

  const response = await fetch(`${usersUrl}/signup/email`, {
    method: 'POST',
    body: JSON.stringify(signupData),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    console.log({ status: response.status, error })
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { user: userResponse } = data
  return userResponse
}
