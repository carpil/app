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

export const SelectLocationContext = createContext<SelectLocation>({
  origin: null,
  destination: null,
  meetingPoint: null,
  setOrigin: () => {},
  setDestination: () => {},
  setMeetingPoint: () => {},
})

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [origin, setOrigin] = useState<Location | null>(null)
  const [destination, setDestination] = useState<Location | null>(null)
  const [meetingPoint, setMeetingPoint] = useState<Location | null>(null)
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
