import { useAuthStore } from 'store/useAuthStore'

export const useDriver = () => {
  const currentUser = useAuthStore((state) => state.user)

  const calculateDriver = (userId: string) => {
    return currentUser?.id === userId
  }

  return { calculateDriver }
}
