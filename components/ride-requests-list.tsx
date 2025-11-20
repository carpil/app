import { useState, useCallback } from 'react'
import { FlatList, RefreshControl, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import RideRequestCard from '@components/ride-request-card'
import RideCardSkeleton from '@components/skeletons/ride-card'
import { getRideRequests } from 'services/api/ride-request'
import { useEffect } from 'react'
import { RideRequest } from '~types/ride-request'
import { COLORS } from '@utils/constansts/colors'

export default function RideRequestsList() {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRideRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const data = await getRideRequests()
      const requests = Array.isArray(data) ? [] : data.rideRequests || []
      setRideRequests(requests)
    } catch (error) {
      console.error('Error fetching ride requests:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchRideRequests()
  }, [])

  // Focus-based refresh - refetch when returning to this tab
  useFocusEffect(
    useCallback(() => {
      // Only refetch if we already have data (not on initial load)
      if (rideRequests.length > 0) {
        fetchRideRequests(true)
      }
    }, [rideRequests.length]),
  )

  const onRefresh = () => {
    fetchRideRequests(true)
  }

  const renderItem = ({ item }: { item: RideRequest }) => (
    <RideRequestCard rideRequest={item} />
  )

  const renderEmpty = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: COLORS.gray_400,
          textAlign: 'center',
        }}
      >
        No hay solicitudes de ride
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: COLORS.gray_400,
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        Las solicitudes aparecerán aquí
      </Text>
    </View>
  )

  if (loading) {
    return (
      <FlatList
        data={Array.from({ length: 5 })}
        renderItem={() => <RideCardSkeleton />}
        keyExtractor={(_, index) => `skeleton-${index}`}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  return (
    <FlatList
      data={rideRequests}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}
    />
  )
}
