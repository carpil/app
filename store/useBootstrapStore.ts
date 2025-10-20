import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BootstrapResponse } from '~types/responses/bootstrap'

interface BootstrapState {
  rideId: string | null
  inRide: boolean
  pendingReviews: BootstrapResponse['pendingReviews']
  pendingPayment: BootstrapResponse['pendingPayment']
  isDriver: boolean
  isLoading: boolean
  lastFetched: number | null
  setBootstrap: (bootstrap: BootstrapResponse) => void
  clearBootstrap: () => void
  updateBootstrap: (updates: Partial<BootstrapResponse>) => void
  setLoading: (loading: boolean) => void
  setLastFetched: (timestamp: number) => void
}

export const useBootstrapStore = create<BootstrapState>()(
  persist(
    (set) => ({
      rideId: null,
      inRide: false,
      pendingReviews: null,
      pendingPayment: null,
      isDriver: false,
      isLoading: false,
      lastFetched: null,
      setBootstrap: (bootstrap) =>
        set({
          rideId: bootstrap.rideId,
          inRide: bootstrap.inRide,
          pendingReviews: bootstrap.pendingReviews,
          pendingPayment: bootstrap.pendingPayment,
          isDriver: bootstrap.isDriver,
          lastFetched: Date.now(),
        }),
      clearBootstrap: () =>
        set({
          rideId: null,
          inRide: false,
          pendingReviews: null,
          pendingPayment: null,
          isDriver: false,
          lastFetched: null,
        }),
      updateBootstrap: (updates) =>
        set((state) => ({
          ...state,
          ...updates,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setLastFetched: (timestamp) => set({ lastFetched: timestamp }),
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
