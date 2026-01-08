import { useState, useCallback, useEffect } from 'react'
import { FlatList, RefreshControl, View, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import RideCard from '@components/ride-card'
import RideCardSkeleton from '@components/skeletons/ride-card'
import { getRides } from 'services/api/rides'
import { Ride } from '~types/ride'
import { COLORS } from '@utils/constansts/colors'
import { logger } from '@utils/logs'

export default function RidesList() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchRides = async (isRefresh = false, page = 1) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const rides = await getRides()

      logger.info('Rides fetched for list', {
        action: 'rides_list_fetched',
        metadata: {
          count: rides.length,
          isRefresh,
          page,
        },
      })

      if (isRefresh || page === 1) {
        setRides(rides)
      } else {
        setRides((prev) => [...prev, ...rides])
      }

      setHasMore(rides.length > 0)
    } catch (error) {
      logger.exception(error as Error, {
        action: 'rides_list_fetch_error',
        metadata: { isRefresh, page },
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLoadingMore(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchRides()
  }, [])

  // Focus-based refresh - refetch when returning to this tab
  useFocusEffect(
    useCallback(() => {
      // Only refetch if we already have data (not on initial load)
      if (rides.length > 0) {
        fetchRides(true)
      }
    }, [rides.length]),
  )

  const onRefresh = () => {
    fetchRides(true)
  }

  const onEndReached = () => {
    if (!loadingMore && hasMore) {
      // Implement pagination logic here
      // fetchRides(false, currentPage + 1)
    }
  }

  const renderItem = ({ item }: { item: Ride }) => <RideCard ride={item} />

  const renderFooter = () => {
    if (!loadingMore) return null
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: COLORS.gray_400 }}>Cargando más rides...</Text>
      </View>
    )
  }

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
        No hay rides disponibles
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: COLORS.gray_400,
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        Crea un nuevo ride para comenzar
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
      data={rides}
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
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}
    />
  )
}
