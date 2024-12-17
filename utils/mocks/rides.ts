import { Ride } from '../../types/ride'

export const rides: Ride[] = [
  {
    id: 'ride1',
    origin: 'San Pedro Montes de Oca',
    destination: 'Cartago',
    meetingPoint: 'Parque Central de San José',
    availableSeats: 4,
    price: 2500,
    departureDate: new Date('2024-12-20T09:00:00Z'),
    passengers: [
      {
        id: 'passenger1',
        name: 'Emma Watson',
        profilePicture:
          'https://m.media-amazon.com/images/M/MV5BMTQ3ODE2NTMxMV5BMl5BanBnXkFtZTgwOTIzOTQzMjE@._V1_.jpg',
      },
      {
        id: 'passenger2',
        name: 'Robert Downey Jr.',
        profilePicture:
          'https://media.gq.com.mx/photos/5ffa22129274cd36fe35681a/master/pass/robert-downey-jr-star-wars.jpg',
      },
      {
        id: 'passenger3',
        name: 'Scarlett Johansson',
        profilePicture:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Scarlett_Johansson_by_Gage_Skidmore_2019.jpg/1200px-Scarlett_Johansson_by_Gage_Skidmore_2019.jpg',
      },
    ],
    driver: {
      id: 'driver1',
      name: 'Leonardo DiCaprio',
      profilePicture:
        'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_FMjpg_UX1000_.jpg',
    },
    deletedAt: null,
    status: 'active',
    chatId: 'chat1',
  },
  {
    id: 'ride2',
    origin: 'Liberia',
    destination: 'Santa Cruz',
    meetingPoint: 'Parque Mario Cañas Ruiz',
    availableSeats: 2,
    price: 3000,
    departureDate: new Date('2024-12-21T08:00:00Z'),
    passengers: [
      {
        id: 'passenger3',
        name: 'Scarlett Johansson',
        profilePicture:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Scarlett_Johansson_by_Gage_Skidmore_2019.jpg/1200px-Scarlett_Johansson_by_Gage_Skidmore_2019.jpg',
      },
    ],
    driver: {
      id: 'driver2',
      name: 'Morgan Freeman',
      profilePicture:
        'https://m.media-amazon.com/images/M/MV5BMTc0MDMyMzI2OF5BMl5BanBnXkFtZTcwMzM2OTk1MQ@@._V1_.jpg',
    },
    deletedAt: null,
    status: 'active',
    chatId: 'chat2',
  },
  {
    id: 'ride3',
    origin: 'Quepos',
    destination: 'Jacó',
    meetingPoint: 'Parque Nacional Manuel Antonio',
    availableSeats: 4,
    price: 5000,
    departureDate: new Date('2024-12-22T10:00:00Z'),
    passengers: [],
    driver: {
      id: 'driver3',
      name: 'Chris Hemsworth',
      profilePicture:
        'https://cdn.britannica.com/92/215392-050-96A4BC1D/Australian-actor-Chris-Hemsworth-2019.jpg',
    },
    deletedAt: null,
    status: 'active',
    chatId: 'chat3',
  },
  {
    id: 'ride4',
    origin: 'Heredia',
    destination: 'Alajuela',
    meetingPoint: 'Parque Central de Heredia',
    availableSeats: 1,
    price: 1500,
    departureDate: new Date('2024-12-23T11:00:00Z'),
    passengers: [
      {
        id: 'passenger4',
        name: 'Natalie Portman',
        profilePicture:
          'https://media.allure.com/photos/6480d6ea4ba1258bcf29d2e2/1:1/w_3270,h_3270,c_limit/natalie%20portman%20summer%20hair%20hat%20hero.jpg',
      },
    ],
    driver: {
      id: 'driver4',
      name: 'Dwayne Johnson',
      profilePicture:
        'https://cdn.britannica.com/36/147936-050-8E84B614/Dwayne-Johnson.jpg',
    },
    deletedAt: null,
    status: 'active',
    chatId: 'chat4',
  },
  {
    id: 'ride5',
    origin: 'Tamarindo',
    destination: 'Playa Hermosa',
    meetingPoint: 'Plaza Tamarindo',
    availableSeats: 2,
    price: 7000,
    departureDate: new Date('2024-12-24T07:30:00Z'),
    passengers: [
      {
        id: 'passenger5',
        name: 'Gal Gadot',
        profilePicture:
          'https://cdn.britannica.com/61/217461-050-93A0E3CB/Israeli-Gal-Gadot-2019.jpg',
      },
    ],
    driver: {
      id: 'driver5',
      name: 'Keanu Reeves',
      profilePicture:
        'https://m.media-amazon.com/images/M/MV5BNDEzOTdhNDUtY2EyMy00YTNmLWE5MjItZmRjMmQzYTRlMGRkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    },
    deletedAt: null,
    status: 'active',
    chatId: 'chat5',
  },
]
