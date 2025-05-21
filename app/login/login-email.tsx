import { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, TextInput, View } from 'react-native'
import SafeScreen from '@components/safe-screen'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth'
import { LoginForm } from '~types/form/login'
import React from 'react'
import { EyeOffIcon, EyeOnIcon } from '@components/icons'
import PrimaryButton from '@components/buttons/primary'
import { User } from '~types/user'
import { login, signUp } from 'services/api/auth'
import { useAuthStore } from 'store/useAuthStore'

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Correo electrónico inválido')
    .required('Correo electrónico requerido'),
  password: yup
    .string()
    .required('Contraseña requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export default function LoginEmail() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginStore = useAuthStore((state) => state.login)

  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (data: LoginForm) => {
    const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      // get user token
      const currentUser = getAuth().currentUser
      const userToken = await currentUser?.getIdToken()

      if (!userToken) {
        throw new Error('No user token found')
      }
      const user: User = {
        id: currentUser?.uid || '',
        name: currentUser?.displayName || '',
        profilePicture: currentUser?.photoURL || '',
        email: currentUser?.email || '',
      }

      const userResponse = await login({ user, token: userToken })
      if (userResponse != null) {
        loginStore(userResponse, userToken)
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        try {
          const createUserResponse = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password,
          )
          console.log('User created successfully:', createUserResponse)

          // get user token
          const currentUser = getAuth().currentUser
          const userToken = await currentUser?.getIdToken()
          console.log('User token:', userToken)

          const user: User = {
            id: currentUser?.uid || '',
            name: currentUser?.displayName || '',
            profilePicture: currentUser?.photoURL || '',
            email: currentUser?.email || '',
          }

          if (!userToken) {
            throw new Error('No user token found')
          }

          const userResponse = await signUp({ user, token: userToken })

          console.log({ userResponse })
        } catch (createError: any) {
          console.error('Error creating user:', createError)
          if (createError.code === 'auth/email-already-in-use') {
            console.log(
              'Email is already in use, please try logging in with the correct password',
            )
          } else if (createError.code === 'auth/invalid-email') {
            console.log('Invalid email format')
          } else if (createError.code === 'auth/weak-password') {
            console.log('Password is too weak')
          }
        }
      } else if (error.code === 'auth/user-not-found') {
        console.log('User not found, creating new account...')
        try {
          const createUserResponse = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password,
          )
          console.log('User created successfully:', createUserResponse)
        } catch (createError: any) {
          console.error('Error creating user:', createError)
        }
      } else if (error.code === 'auth/wrong-password') {
        console.log('Incorrect password')
      } else if (error.code === 'auth/invalid-email') {
        console.log('Invalid email format')
      }
    } finally {
      reset()
    }
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <Text style={styles.title}>Hola de nuevo! 👋🏼</Text>
      <Text style={styles.subtitle}>
        Completa el formulario para iniciar sesión con tu cuenta.
      </Text>
      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                style={{
                  ...styles.input,
                  ...(errors.email && styles.errorInput),
                }}
                placeholderTextColor={COLORS.border_gray}
                placeholder="Correo electrónico"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                style={{
                  ...styles.input,
                  ...(errors.password && styles.errorInput),
                }}
                placeholderTextColor={COLORS.border_gray}
                placeholder="Contraseña"
                autoCapitalize="none"
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                textContentType="password"
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOnIcon color={COLORS.border_gray} />
                ) : (
                  <EyeOffIcon color={COLORS.border_gray} />
                )}
              </Pressable>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />
        <PrimaryButton
          text="Iniciar sesión"
          onPress={handleSubmit(handleLogin)}
        />
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 10,
  },
  form: {
    marginTop: 20,
    gap: 20,
  },
  input: {
    backgroundColor: COLORS.black,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderColor: COLORS.secondary_gray_dark,
    borderWidth: 1,
    color: COLORS.white,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 40,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 15,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
    color: 'red',
  },
  eyeIcon: {
    position: 'absolute',
    alignContent: 'center',
    justifyContent: 'center',
    right: 15,
    top: 15,
  },
})
