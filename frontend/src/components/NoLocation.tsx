import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { fetcher } from '../pages/Home'
import { useLocation } from './LocationContext'
import LoadingSpinner from './LoadingSpinner'

export default function NoLocation({ target }: { target: string}) {
    const navigate = useNavigate()
    const { userLocation, setUserLocation } = useLocation()

    useEffect(() => {
        setUserLocation({ Lat: 100, Lng: 200, PostalCode: "" })
    }, [setUserLocation])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                PostalCode: "",
                Lat: position.coords.latitude,
                Lng: position.coords.longitude,
            })
        },
        (err) => {
            console.error('Geolocation error:', err)
        })
    }, [setUserLocation])

    const { data, error, isLoading } = useSWR<string>(() => {
        if (userLocation.Lat === 100) return null;
        return `${import.meta.env.VITE_GOSERVER}/postalCode?lat=${userLocation.Lat}&lng=${userLocation.Lng}`
    }, fetcher)

    useEffect(() => {
        if (data && userLocation.PostalCode !== data) {
            setUserLocation({
                PostalCode: data,
                Lat: userLocation.Lat,
                Lng: userLocation.Lng,
            });
            navigate(`/${data}${target ? `/${target}` : ''}`, { replace: true })
        }
    }, [data, navigate, target, setUserLocation, userLocation])

    if (error) return (<p>Could not determine your location.</p>)
    if (userLocation.Lat === 100) return (<LoadingSpinner />)
    if (isLoading) return (<p>Finding you</p>)

    return (<p>Redirecting ...</p>)
}
