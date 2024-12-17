import { RideRequest } from '../../types/ride-request'

export const rideRequests: RideRequest[] = [
  {
    id: 'request1',
    origin: 'San José',
    destination: 'Puntarenas',
    departureDate: new Date('2024-12-25T09:00:00Z'),
    spaces: 2,
    creator: {
      id: 'user1',
      name: 'Leonardo DiCaprio',
      profilePicture:
        'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_FMjpg_UX1000_.jpg',
    },
    deletedAt: null,
    status: 'active',
  },
  {
    id: 'request2',
    origin: 'Alajuela',
    destination: 'La Fortuna',
    departureDate: new Date('2024-12-26T08:00:00Z'),
    spaces: 1,
    creator: {
      id: 'user2',
      name: 'Emma Watson',
      profilePicture:
        'https://m.media-amazon.com/images/M/MV5BMTQ3ODE2NTMxMV5BMl5BanBnXkFtZTgwOTIzOTQzMjE@._V1_.jpg',
    },
    deletedAt: null,
    status: 'active',
  },
  {
    id: 'request3',
    origin: 'Cartago',
    destination: 'Turrialba',
    departureDate: new Date('2024-12-27T10:30:00Z'),
    spaces: 3,
    creator: {
      id: 'user3',
      name: 'Dwayne Johnson',
      profilePicture:
        'https://cdn.britannica.com/36/147936-050-8E84B614/Dwayne-Johnson.jpg',
    },
    deletedAt: null,
    status: 'active',
  },
  {
    id: 'request4',
    origin: 'Santa Teresa',
    destination: 'Montezuma',
    departureDate: new Date('2024-12-28T15:00:00Z'),
    spaces: 2,
    creator: {
      id: 'user4',
      name: 'Keanu Reeves',
      profilePicture:
        'https://m.media-amazon.com/images/M/MV5BNDEzOTdhNDUtY2EyMy00YTNmLWE5MjItZmRjMmQzYTRlMGRkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    },
    deletedAt: null,
    status: 'active',
  },
  {
    id: 'request5',
    origin: 'San Isidro de El General',
    destination: 'Dominical',
    departureDate: new Date('2024-12-29T12:00:00Z'),
    spaces: 1,
    creator: {
      id: 'user5',
      name: 'Scarlett Johansson',
      profilePicture:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Scarlett_Johansson_by_Gage_Skidmore_2019.jpg/1200px-Scarlett_Johansson_by_Gage_Skidmore_2019.jpg',
    },
    deletedAt: null,
    status: 'active',
  },
]
