import { ChatResponse } from '~types/responses/chat'
import { User } from '~types/user'
import { Ride } from '~types/ride'
import { Message } from '~types/message'

// Mock users for chats
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Leonardo DiCaprio',
    profilePicture:
      'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_FMjpg_UX1000_.jpg',
  },
  {
    id: 'user2',
    name: 'Emma Watson',
    profilePicture:
      'https://m.media-amazon.com/images/M/MV5BMTQ3ODE2NTMxMV5BMl5BanBnXkFtZTgwOTIzOTQzMjE@._V1_.jpg',
  },
  {
    id: 'user3',
    name: 'Robert Downey Jr.',
    profilePicture:
      'https://media.gq.com.mx/photos/5ffa22129274cd36fe35681a/master/pass/robert-downey-jr-star-wars.jpg',
  },
  {
    id: 'user4',
    name: 'Scarlett Johansson',
    profilePicture:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Scarlett_Johansson_by_Gage_Skidmore_2019.jpg/1200px-Scarlett_Johansson_by_Gage_Skidmore_2019.jpg',
  },
  {
    id: 'user5',
    name: 'Morgan Freeman',
    profilePicture:
      'https://m.media-amazon.com/images/M/MV5BMTc0MDMyMzI2OF5BMl5BanBnXkFtZTcwMzM2OTk1MQ@@._V1_.jpg',
  },
  {
    id: 'user6',
    name: 'Chris Hemsworth',
    profilePicture:
      'https://cdn.britannica.com/92/215392-050-96A4BC1D/Australian-actor-Chris-Hemsworth-2019.jpg',
  },
]

// Mock rides for chats
const mockRides: Ride[] = [
  {
    id: 'ride1',
    origin: {
      id: 'origin1',
      name: {
        primary: 'San José',
        secondary: 'San José',
      },
      location: {
        lat: 9.9281,
        lng: -84.0907,
      },
    },
    destination: {
      id: 'destination1',
      name: {
        primary: 'Tamarindo',
        secondary: 'Tamarindo',
      },
      location: {
        lat: 10.2993,
        lng: -85.8371,
      },
    },
    meetingPoint: {
      id: 'meetingPoint1',
      name: {
        primary: 'Parque Central de San José',
        secondary: 'Parque Central de San José',
      },
      location: {
        lat: 9.9333,
        lng: -84.0833,
      },
    },
    availableSeats: 4,
    price: 2500,
    departureDate: new Date('2024-12-20T09:00:00Z'),
    passengers: [mockUsers[1], mockUsers[2], mockUsers[3]],
    driver: mockUsers[0],
    deletedAt: null,
    status: 'active',
    chatId: 'chat1',
  },
  {
    id: 'ride2',
    origin: {
      id: 'origin2',
      name: {
        primary: 'Liberia',
        secondary: 'Liberia',
      },
      location: {
        lat: 10.6346,
        lng: -85.44,
      },
    },
    destination: {
      id: 'destination2',
      name: {
        primary: 'Monteverde',
        secondary: 'Monteverde',
      },
      location: {
        lat: 10.2725,
        lng: -84.8255,
      },
    },
    meetingPoint: {
      id: 'meetingPoint2',
      name: {
        primary: 'Parque Central de Liberia',
        secondary: 'Parque Central de Liberia',
      },
      location: {
        lat: 10.6331,
        lng: -85.433,
      },
    },
    availableSeats: 2,
    price: 3000,
    departureDate: new Date('2024-12-21T08:00:00Z'),
    passengers: [mockUsers[3]],
    driver: mockUsers[4],
    deletedAt: null,
    status: 'active',
    chatId: 'chat2',
  },
  {
    id: 'ride3',
    origin: {
      id: 'origin3',
      name: {
        primary: 'Quepos',
        secondary: 'Quepos',
      },
      location: {
        lat: 9.4311,
        lng: -84.1617,
      },
    },
    destination: {
      id: 'destination3',
      name: {
        primary: 'Jacó',
        secondary: 'Jacó',
      },
      location: {
        lat: 9.6145,
        lng: -84.633,
      },
    },
    meetingPoint: {
      id: 'meetingPoint3',
      name: {
        primary: 'Parque Central de Quepos',
        secondary: 'Parque Central de Quepos',
      },
      location: {
        lat: 9.431,
        lng: -84.1615,
      },
    },
    availableSeats: 4,
    price: 5000,
    departureDate: new Date('2024-12-22T10:00:00Z'),
    passengers: [],
    driver: mockUsers[5],
    deletedAt: null,
    status: 'active',
    chatId: 'chat3',
  },
  {
    id: 'ride4',
    origin: {
      id: 'origin4',
      name: {
        primary: 'Alajuela',
        secondary: 'Alajuela',
      },
      location: {
        lat: 10.0162,
        lng: -84.2116,
      },
    },
    destination: {
      id: 'destination4',
      name: {
        primary: 'La Fortuna',
        secondary: 'La Fortuna',
      },
      location: {
        lat: 10.471,
        lng: -84.6453,
      },
    },
    meetingPoint: {
      id: 'meetingPoint4',
      name: {
        primary: 'Parque Central de Alajuela',
        secondary: 'Parque Central de Alajuela',
      },
      location: {
        lat: 10.0161,
        lng: -84.2115,
      },
    },
    availableSeats: 3,
    price: 4000,
    departureDate: new Date('2024-12-23T07:00:00Z'),
    passengers: [mockUsers[1], mockUsers[2]],
    driver: mockUsers[0],
    deletedAt: null,
    status: 'active',
    chatId: 'chat4',
  },
]

// Mock messages
const mockMessages: Message[] = [
  {
    id: 'msg1',
    content: '¡Perfecto! Nos vemos en el parque central a las 9:00 AM',
    userId: 'user1',
    timestamp: new Date('2024-12-19T15:30:00Z'),
    createdAt: new Date('2024-12-19T15:30:00Z'),
    seenBy: ['user2', 'user3', 'user4'],
  },
  {
    id: 'msg2',
    content: '¿Cuánto tiempo dura el viaje aproximadamente?',
    userId: 'user2',
    timestamp: new Date('2024-12-19T16:45:00Z'),
    createdAt: new Date('2024-12-19T16:45:00Z'),
    seenBy: ['user1'],
  },
  {
    id: 'msg3',
    content: 'Hola, ¿aún tienes espacio disponible?',
    userId: 'user3',
    timestamp: new Date('2024-12-19T14:20:00Z'),
    createdAt: new Date('2024-12-19T14:20:00Z'),
    seenBy: ['user4'],
  },
  {
    id: 'msg4',
    content: '¡Excelente viaje! Gracias por todo',
    userId: 'user1',
    timestamp: new Date('2024-12-18T20:15:00Z'),
    createdAt: new Date('2024-12-18T20:15:00Z'),
    seenBy: ['user4'],
  },
]

export const chats: ChatResponse[] = [
  {
    id: 'chat1',
    participants: [
      mockUsers[0],
      mockUsers[1],
      mockUsers[2],
      mockUsers[3],
      mockUsers[4],
      mockUsers[5],
    ],
    owner: mockUsers[0],
    rideId: 'ride1',
    ride: mockRides[0],
    lastMessage: mockMessages[0],
    createdAt: new Date('2024-12-19T10:00:00Z'),
    updatedAt: new Date('2024-12-19T15:30:00Z'),
  },
  {
    id: 'chat2',
    participants: [mockUsers[4], mockUsers[3]],
    owner: mockUsers[4],
    rideId: 'ride2',
    ride: mockRides[1],
    lastMessage: mockMessages[1],
    createdAt: new Date('2024-12-19T11:00:00Z'),
    updatedAt: new Date('2024-12-19T16:45:00Z'),
  },
  {
    id: 'chat3',
    participants: [mockUsers[5], mockUsers[1], mockUsers[2]],
    owner: mockUsers[5],
    rideId: 'ride3',
    ride: mockRides[2],
    lastMessage: mockMessages[2],
    createdAt: new Date('2024-12-19T12:00:00Z'),
    updatedAt: new Date('2024-12-19T14:20:00Z'),
  },
  {
    id: 'chat4',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    owner: mockUsers[0],
    rideId: 'ride4',
    ride: mockRides[3],
    lastMessage: mockMessages[3],
    createdAt: new Date('2024-12-18T09:00:00Z'),
    updatedAt: new Date('2024-12-18T20:15:00Z'),
  },
]
