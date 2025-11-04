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

const DEFAULT_LOCATION: Location = {
  id: 'ChIJISmvIRDfoI8RUpyjWIVU5bU',
  location: { lat: 9.864797699999999, lng: -83.9210959 },
  name: { primary: 'Cartago', secondary: 'Provincia de Cartago, Costa Rica' },
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
  const [origin, setOrigin] = useState<Location | null>(DEFAULT_LOCATION)
  const [destination, setDestination] = useState<Location | null>(
    DEFAULT_LOCATION,
  )
  const [meetingPoint, setMeetingPoint] = useState<Location | null>(
    DEFAULT_LOCATION,
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
