import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persist } from 'zustand/middleware'
import { User } from '~types/user'

type AuthState = {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  setToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name)
        },
      },
    },
  ),
)
