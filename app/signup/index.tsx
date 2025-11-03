import { useRef, useState } from 'react'
import { StyleSheet, Text, Pressable, TextInput, View } from 'react-native'
import { COLORS } from '@utils/constansts/colors'
import { Controller, useForm } from 'react-hook-form'
import SafeScreen from '@components/safe-screen'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
} from '@react-native-firebase/auth'
import { SignUpForm } from '~types/form/signup'
import React from 'react'
import { EyeOffIcon, EyeOnIcon } from '@components/icons'
import PrimaryButton from '@components/buttons/primary'
import { User } from '~types/user'
import { signUpEmail } from 'services/api/auth'
import { useAuthStore } from 'store/useAuthStore'
import { router } from 'expo-router'

const signUpSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Nombre requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: yup
    .string()
    .required('Apellido requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  phoneNumber: yup
    .string()
    .required('Número de teléfono requerido')
    .matches(
      /^[0-9]{4}-?[0-9]{4}$/,
      'Número de teléfono inválido (formato: 8888-8888)',
    )
    .transform((value) => value.replace(/-/g, '')),
  email: yup
    .string()
    .email('Correo electrónico inválido')
    .required('Correo electrónico requerido'),
  password: yup
    .string()
    .required('Contraseña requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export default function SignUp() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
    },
  })

  const loginStore = useAuthStore((state) => state.login)

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const lastNameRef = useRef<TextInput>(null)
  const phoneRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '')

    // Limit to 8 digits
    const limited = cleaned.slice(0, 8)

    // Add hyphen after 4 digits
    if (limited.length > 4) {
      return `${limited.slice(0, 4)}-${limited.slice(4)}`
    }
    return limited
  }

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true)
    const auth = getAuth()
    let firebaseUser = null

    try {
      // Step 1: Create Firebase user
      await createUserWithEmailAndPassword(auth, data.email, data.password)

      // Get user token
      const currentUser = getAuth().currentUser
      firebaseUser = currentUser
      const userToken = await currentUser?.getIdToken()

      if (!userToken) {
        throw new Error('No user token found')
      }

      // Prepare user object for API
      const user: User = {
        id: currentUser?.uid || '',
        name: `${data.firstName} ${data.lastName}`,
        profilePicture: currentUser?.photoURL || '',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber.replace(/-/g, ''),
      }

      // Step 2: Create user in backend
      const userResponse = await signUpEmail({ user, token: userToken })

      if (userResponse == null) {
        console.error('Sign up failed: API returned null response')
        console.log('Rolling back: Deleting Firebase user...')

        // Rollback: Delete Firebase user since backend creation failed
        if (firebaseUser) {
          await deleteUser(firebaseUser)
          console.log('Firebase user deleted successfully')
        }

        // TODO: Show error message to user
        return
      }

      // Step 3: Only login if both Firebase and backend succeeded
      loginStore(userResponse, userToken)
      reset()
      router.replace('/')
    } catch (error: any) {
      console.error('Error creating user:', {
        error: error.message,
        code: error.code,
        stack: error.stack,
      })

      // If Firebase user was created but something failed after, delete it
      if (firebaseUser && error.code !== 'auth/email-already-in-use') {
        try {
          console.log('Rolling back: Deleting Firebase user due to error...')
          await deleteUser(firebaseUser)
          console.log('Firebase user deleted successfully')
        } catch (deleteError) {
          console.error('Failed to delete Firebase user:', deleteError)
        }
      }

      if (error.code === 'auth/email-already-in-use') {
        console.log('El correo electrónico ya está en uso')
        // TODO: Show error message to user
      } else if (error.code === 'auth/invalid-email') {
        console.log('Formato de correo electrónico inválido')
        // TODO: Show error message to user
      } else if (error.code === 'auth/weak-password') {
        console.log('La contraseña es demasiado débil')
        // TODO: Show error message to user
      } else {
        console.log('Unexpected error:', error.message)
        // TODO: Show generic error message to user
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <Text style={styles.title}>¡Crea tu cuenta! 🚗</Text>
      <Text style={styles.subtitle}>
        Completa el formulario para registrarte y comenzar a compartir viajes.
      </Text>
      <View style={styles.form}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                style={{
                  ...styles.input,
                  ...(errors.firstName && styles.errorInput),
                }}
                placeholderTextColor={COLORS.border_gray}
                placeholder="Nombre"
                autoCapitalize="words"
                autoComplete="name-given"
                value={value}
                onChangeText={onChange}
                onSubmitEditing={() => lastNameRef.current?.focus()}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName.message}</Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                style={{
                  ...styles.input,
                  ...(errors.lastName && styles.errorInput),
                }}
                placeholderTextColor={COLORS.border_gray}
                placeholder="Apellido"
                autoCapitalize="words"
                autoComplete="name-family"
                value={value}
                onChangeText={onChange}
                ref={lastNameRef}
                onSubmitEditing={() => phoneRef.current?.focus()}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName.message}</Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                style={{
                  ...styles.input,
                  ...(errors.phoneNumber && styles.errorInput),
                }}
                placeholderTextColor={COLORS.border_gray}
                placeholder="Teléfono (8888-8888)"
                autoComplete="tel"
                keyboardType="phone-pad"
                value={value}
                onChangeText={(text) => onChange(formatPhoneNumber(text))}
                ref={phoneRef}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
              {errors.phoneNumber && (
                <Text style={styles.errorText}>
                  {errors.phoneNumber.message}
                </Text>
              )}
            </View>
          )}
        />
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
                ref={emailRef}
                onSubmitEditing={() => passwordRef.current?.focus()}
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
                textContentType="newPassword"
                ref={passwordRef}
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
          text="Registrarse"
          onPress={handleSubmit(handleSignUp)}
          disabled={isLoading}
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
