import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BootstrapResponse, PendingReview } from '~types/responses/bootstrap'

type BootstrapState = {
  rideId: string | null
  inRide: boolean
  pendingReviews: PendingReview[]
  isDriver: boolean
  setBootstrap: (bootstrap: BootstrapResponse) => void
  clearBootstrap: () => void
}

export const useBootstrapStore = create<BootstrapState>()(
  persist(
    (set) => ({
      rideId: null,
      inRide: false,
      pendingReviews: [],
      isDriver: false,
      setBootstrap: (bootstrap) =>
        set({
          rideId: bootstrap.rideId,
          inRide: bootstrap.inRide,
          pendingReviews: bootstrap.pendingReviews,
          isDriver: bootstrap.isDriver,
        }),
      clearBootstrap: () =>
        set({
          rideId: null,
          inRide: false,
          pendingReviews: [],
          isDriver: false,
        }),
    }),
    {
      name: 'bootstrap-storage',
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
