import { createContext, useState } from 'react'
import { Location } from '~types/location'

interface SelectLocation {
  origin: Location | null
  destination: Location | null
  meetingPoint: Location | null
  setOrigin: (location: Location) => void
  setDestination: (location: Location) => void
  setMeetingPoint: (location: Location) => void
}

const DEFAULT_ORIGIN: Location = {
  id: 'ChIJT4-Cgeh3oI8R_PJgZNICb-o',
  location: { lat: 10.6590277, lng: -84.3542049 },
  name: {
    primary: 'San Carlos',
    secondary: 'Provincia de Alajuela, Costa Rica',
  },
}

const DEFAULT_DESTINATION: Location = {
  id: 'ChIJtaETTfHjoI8RLdb72F3z3lU',
  location: { lat: 9.9330574, lng: -84.0557369 },
  name: { primary: 'San Pedro', secondary: 'San José, Costa Rica' },
}

const DEFAULT_MEETING_POINT: Location = {
  id: 'ChIJ9bDsHvNloI8RrpDkdr-KT44',
  location: { lat: 10.3224785, lng: -84.43077889999999 },
  name: {
    primary: 'Municipalidad San Carlos',
    secondary:
      'Ruta Nacional Secundaria 140, Provincia de Alajuela, Ciudad Quesada, Costa Rica',
  },
}

export const SelectLocationContext = createContext<SelectLocation>({
  origin: null,
  destination: null,
  meetingPoint: null,
  setOrigin: () => {},
  setDestination: () => {},
  setMeetingPoint: () => {},
})

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [origin, setOrigin] = useState<Location | null>(DEFAULT_ORIGIN)
  const [destination, setDestination] = useState<Location | null>(
    DEFAULT_DESTINATION,
  )
  const [meetingPoint, setMeetingPoint] = useState<Location | null>(
    DEFAULT_MEETING_POINT,
  )
  return (
    <SelectLocationContext.Provider
      value={{
        origin,
        destination,
        meetingPoint,
        setOrigin,
        setDestination,
        setMeetingPoint,
      }}
    >
      {children}
    </SelectLocationContext.Provider>
  )
}

export default LocationProvider
