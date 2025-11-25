import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { SignUpResponse } from '~types/responses/auth'
import { User } from '~types/user'
import { logger } from '@utils/logs'

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
    logger.error('Sign up failed', {
      action: 'signup_failed',
      metadata: {
        status: response.status,
        error,
        email: user.email,
      },
    })
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { user: userResponse } = data

  logger.info('User signed up successfully', {
    action: 'signup_success',
    metadata: {
      userId: userResponse.id,
      email: userResponse.email,
    },
  })

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
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    logger.error('Login failed', {
      action: 'login_failed',
      metadata: {
        status: response.status,
        error,
        email: user.email,
      },
    })
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { user: userResponse } = data

  logger.info('User logged in successfully', {
    action: 'login_success',
    metadata: {
      userId: userResponse.id,
      email: userResponse.email,
    },
  })
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
    logger.error('No token provided for social login', {
      action: 'social_login_no_token',
      metadata: {
        email: user.email,
      },
    })
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

  const response = await fetch(`${usersUrl}/login/social`, requestOptions)

  if (!response.ok) {
    const error = await response.json()
    logger.error('Social login failed', {
      action: 'social_login_failed',
      metadata: {
        status: response.status,
        error,
        email: user.email,
      },
    })
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { user: userResponse } = data

  logger.info('Social login successful', {
    action: 'social_login_success',
    metadata: {
      userId: userResponse.id,
      email: userResponse.email,
    },
  })
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
    logger.error('Email signup failed', {
      action: 'signup_email_failed',
      metadata: {
        status: response.status,
        error,
        email: user.email,
      },
    })
    return null
  }

  const data = (await response.json()) as SignUpResponse
  const { user: userResponse } = data

  logger.info('Email signup successful', {
    action: 'signup_email_success',
    metadata: {
      userId: userResponse.id,
      email: userResponse.email,
    },
  })

  return userResponse
}
