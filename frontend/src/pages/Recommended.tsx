import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard from '../components/MovieCard';
import './Recommended.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { fetcher, Result } from './Home'
import useSWR from 'swr'

export default function Recommended() {
    const [index, setIndex] = useState(0)
    const [userLocation, setUserLocation] = useState({
        lat: 100,
        lng: 200,
        error: ""
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((loc) => {
            const {latitude, longitude} = loc.coords;
            setUserLocation({
            lat: latitude,
            lng: longitude,
            error: ""
            })
        }), () => {
            setUserLocation({
            lat: 100,
            lng: 200,
            error: "Unable to retrieve your location"
            })
        }
    }, [])
    
    const { data, error, isLoading } = useSWR<Result>(() => {
        if(userLocation.lat == 100) return null
        return `${import.meta.env.VITE_GOSERVER}/movieinfo?lat=${userLocation.lat}&lng=${userLocation.lng}`
    }, fetcher)

    function goLeft() {
        if(index > 0) {
            setIndex(index-1)
        }
    }
    function goRight() {
        if(data && index < data.Movies.length-1) {
            setIndex(index+1)
        }
    }

    if(error) return (<div>Error loading movies: {error.message}</div>)
    if(isLoading) return (<LoadingSpinner />)
    if(!data || data.Movies.length === 0) return (<div>No Movies Found</div>)
    
    return (
        <>
        <div className="recContainer">
            <div className="button" onClick={() => goLeft()}><FontAwesomeIcon icon={faArrowLeft}/></div>
            <div className="card">
                <MovieCard movie={data.Movies[index]} text="text" />
            </div>
            <div className="button" onClick={() => goRight()}><FontAwesomeIcon icon={faArrowRight}/></div>
        </div>
        </>
    )
}
