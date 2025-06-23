import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import { fetcher, Result } from './Home'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import './Recommended.css'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard from '../components/MovieCard';
import { useLocation, Location } from '../components/LocationContext'

export default function Recommended() {
    const [index, setIndex] = useState(0)
    const { userLocation, setUserLocation } = useLocation()
    const { postalCode } = useParams<{ postalCode: string }>()

    
    useEffect(() => {
        if (!postalCode || !userLocation) {
            return
        }
        if (postalCode != userLocation.PostalCode) {
            fetch(`${import.meta.env.VITE_GOSERVER}/latlng?postalCode=${postalCode}}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch location");
                    return res.json();
                })
                .then((loc: Location) => {
                    setUserLocation({
                        PostalCode: postalCode,
                        Lat: loc ? loc.Lat: 100,
                        Lng: loc ? loc.Lng: 200,
                    })
                })
        }
    }, [postalCode, userLocation])
    
    const { data, error, isLoading } = useSWR<Result>(() => {
        if(userLocation.Lat == 100) return null
        return `${import.meta.env.VITE_GOSERVER}/movieinfo?lat=${userLocation.Lat}&lng=${userLocation.Lng}`
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
