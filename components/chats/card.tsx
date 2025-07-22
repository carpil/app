import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Avatar from '@components/avatar'
import { ChatResponse } from '~types/responses/chat'
import { User } from '~types/user'
import { Link } from 'expo-router'

interface ChatCardProps {
  chat: ChatResponse
  user: User
  onPress?: () => void
}

export default function ChatCard({ chat, user, onPress }: ChatCardProps) {
  const isGroup = chat.participants.length > 2
  const currentUserId = user.id
  const participantsWithoutOwner = chat.participants.filter(
    (p) => p.id !== chat.owner?.id,
  )
  const otherParticipants = chat.participants.filter(
    (p) => p.id !== currentUserId,
  )

  const maxVisibleAvatars = 3
  const visibleParticipants = participantsWithoutOwner.slice(
    0,
    maxVisibleAvatars,
  )
  const remainingCount = participantsWithoutOwner.length - maxVisibleAvatars

  const lastMessage = chat.lastMessage
  const lastMessageSender = chat.participants.find(
    (p) => p.id === lastMessage?.userId,
  ) ?? {
    id: lastMessage?.userId ?? '',
    name: 'Usuario desconocido',
    profilePicture: 'unknow_user',
  }

  const unSeenMessages = 0
  const date = chat.createdAt

  return (
    <Link href={`/chats/messages?chatId=${chat.id}`} asChild>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        {date && (
          <Text style={styles.date}>
            {/* puedes formatear aquí si quieres */}
          </Text>
        )}

        <View style={styles.row}>
          <View style={styles.avatarContainer}>
            {isGroup && chat.owner && <Avatar user={chat.owner} size={40} />}
            {isGroup && participantsWithoutOwner.length > 0 && (
              <View style={styles.groupAvatars}>
                {visibleParticipants.map((p, index) => (
                  <View
                    key={p.id}
                    style={[
                      styles.avatarWrapper,
                      index > 0 && { marginLeft: -8 },
                    ]}
                  >
                    <Avatar user={p} size={24} />
                  </View>
                ))}
                {remainingCount > 0 && (
                  <View style={[styles.avatarWrapper, { marginLeft: -8 }]}>
                    <View style={styles.remainingCount}>
                      <Text style={styles.remainingCountText}>
                        +{remainingCount}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
            {!isGroup && otherParticipants[0] && (
              <Avatar user={otherParticipants[0]} size={48} />
            )}
          </View>

          <View style={styles.textContainer}>
            {chat.ride && (
              <Text style={styles.rideText}>
                {chat.ride.origin?.name.primary} ➡️{' '}
                {chat.ride.destination?.name.primary}
              </Text>
            )}
            {lastMessage ? (
              <Text style={styles.messageText}>
                <Text style={styles.senderName}>
                  {lastMessageSender.name}:{' '}
                </Text>
                {lastMessage.content}
              </Text>
            ) : (
              <Text style={styles.messageText}>¡Iniciar conversación!</Text>
            )}
          </View>

          {unSeenMessages > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unSeenMessages}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  date: {
    position: 'absolute',
    top: 6,
    right: 10,
    fontSize: 10,
    color: '#9CA3AF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: 60,
    minWidth: 60,
    marginRight: 12,
  },
  groupAvatars: {
    flexDirection: 'row',
    marginTop: -8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  avatarWrapper: {
    // Contenedor para cada avatar individual
  },
  remainingCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  rideText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    color: '#D1D5DB',
  },
  senderName: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#374151',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
})
