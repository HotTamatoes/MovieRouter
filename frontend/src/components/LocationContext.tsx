import { createContext, useContext, useState } from "react"

export interface Location {
    Lat: number
    Lng: number
    PostalCode?: string
    Error?: string
}

const LocationContext = createContext<{
    userLocation: Location
    setUserLocation: (loc: Location) => void
}>({
    userLocation: { Lat: 100, Lng: 200 },
    setUserLocation: () => {},
})

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [userLocation, setUserLocation] = useState<Location>({ Lat: 100, Lng: 200 })
    return (
        <LocationContext.Provider value={{ userLocation, setUserLocation }}>
            {children}
        </LocationContext.Provider>
    )
}

export function useLocation() {
    return useContext(LocationContext)
}
