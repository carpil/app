import { createContext, useState } from 'react'
import { Location } from '../../types/location'

interface SelectLocation {
  origin: Location | null
  destination: Location | null
  setOrigin: (location: Location) => void
  setDestination: (location: Location) => void
}

export const SelectLocationContext = createContext<SelectLocation>({
  origin: null,
  destination: null,
  setOrigin: () => {},
  setDestination: () => {},
})

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [origin, setOrigin] = useState<Location | null>(null)
  const [destination, setDestination] = useState<Location | null>(null)

  return (
    <SelectLocationContext.Provider
      value={{ origin, destination, setOrigin, setDestination }}
    >
      {children}
    </SelectLocationContext.Provider>
  )
}

export default LocationProvider
