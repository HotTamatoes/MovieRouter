import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

import './Home.css'
import MovieCard, { Movie } from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useLocation, Location } from '../components/LocationContext'


export interface Result {
    Movies:     Movie[]
    Theaters:   Theater[]
    Links:      TheaterMovie[]
}
export interface Theater {
    Name: string
}
export interface TheaterMovie {
    Theater:        string
    Theater_movies: string[]
}

export const fetcher = (url: string) =>
    fetch(url).then((res) => {
    if (!res.ok) {
        throw new Error('Failed to fetch')
    }
    return res.json();
});

export default function Home() {
    const listRef = useRef<HTMLUListElement | null>(null)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
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

    function movieBoxisActive(index: number) {
        setActiveIndex(index)
    }
    function setInactive() {
        setActiveIndex(null)
    }

    useEffect(() => {
        const scrollContainer = listRef.current
        if(!scrollContainer) return
        const action = (evt: WheelEvent) => {
            evt.preventDefault()
            scrollContainer.scrollLeft += 1.5*evt.deltaY
        }
        scrollContainer.addEventListener("wheel", action, { passive: false })
        return () => {
            scrollContainer.removeEventListener("wheel", action)
        }
    }, [isLoading])

    if(error) return (<div>Error loading movies: {error.message}</div>)
    if(isLoading) return (<LoadingSpinner />)
    if(!data || data.Movies.length === 0) return (<div>No Movies Found</div>)
    
    return (
    <>
    <h1 className="welcome">Welcome to Movie-Router.com!</h1>
    <div className="homeWarning">
        This Website is Under Construction, Estimated to be Complete In July 2025
    </div>
    <ul className="movieList" ref={listRef}>
        {data.Movies.map((movie: Movie, index: number) => (
        <li key={index}
            onClick={() => {if (activeIndex !== index){movieBoxisActive(index)}}}
            className={activeIndex === index ? 'selected' : ''}>
            <MovieCard movie={movie} text={ activeIndex === index ? 'text' : 'hidden'} />
            {activeIndex === index && (
                <div className="xBtn" onClick={setInactive}>
                    <FontAwesomeIcon icon={faX} />
                </div>
            )}
        </li>
        ))}
        <div id="overlay" onClick={setInactive}></div>
    </ul>
    </>
    )
}
