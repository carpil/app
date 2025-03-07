import { Ride } from '../../types/ride'

export const rides: Ride[] = [
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
        lat: 10.0162,
        lng: -84.2116,
      },
    },
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
    origin: {
      id: 'origin5',
      name: {
        primary: 'Heredia',
        secondary: 'Heredia',
      },
      location: {
        lat: 9.9987,
        lng: -84.1165,
      },
    },
    destination: {
      id: 'destination5',
      name: {
        primary: 'Puerto Viejo de Talamanca',
        secondary: 'Puerto Viejo de Talamanca',
      },
      location: {
        lat: 9.656,
        lng: -82.754,
      },
    },
    meetingPoint: {
      id: 'meetingPoint5',
      name: {
        primary: 'Parque Central de Heredia',
        secondary: 'Parque Central de Heredia',
      },
      location: {
        lat: 9.9987,
        lng: -84.1165,
      },
    },
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
