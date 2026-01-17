import { Location } from '~types/location'

export const DEFAULT_ORIGIN: Location | null = {
  id: 'ChIJgaUlZPJloI8RlSvdeTe4a-M',
  location: { lat: 10.3271511, lng: -84.430677 },
  name: {
    primary: 'Ciudad Quesada',
    secondary: 'Provincia de Alajuela, Costa Rica',
  },
}

export const DEFAULT_DESTINATION: Location | null = {
  id: 'ChIJtaETTfHjoI8RLdb72F3z3lU',
  location: { lat: 9.9330574, lng: -84.0557369 },
  name: {
    primary: 'San Pedro',
    secondary: 'San José, Costa Rica',
  },
}

export const DEFAULT_MEETING_POINT: Location | null = {
  id: 'ChIJMUFoI_NloI8RxzvoZVbsF2c',
  location: { lat: 10.3232161, lng: -84.4309961 },
  name: {
    primary: 'Parque Central',
    secondary: 'Provincia de Alajuela, Ciudad Quesada, Costa Rica',
  },
}
