import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard, { Movie } from '../components/MovieCard';
import './Recommended.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { fetcher } from './Home'
import useSWR from 'swr'

export default function Recommended() {
    const [index, setIndex] = useState(0)
    const { data, error, isLoading } = useSWR<Movie[]>(`${import.meta.env.VITE_GOSERVER}/api/omdb`, fetcher)

    function goLeft() {
        if(index > 0) {
            setIndex(index-1)
        }
    }
    function goRight() {
        if(data && index < data.length-1) {
            setIndex(index+1)
        }
    }

    if(error) return (<div>Error loading movies: {error.message}</div>)
    if(isLoading) return (<LoadingSpinner />)
    if(!data || data.length === 0) return (<div>No Movies Found</div>)
    
    return (
        <>
        <div className="recContainer">
            <div className="button" onClick={() => goLeft()}><FontAwesomeIcon icon={faArrowLeft}/></div>
            <div className="card">
                <MovieCard movie={data[index]} text="text" />
            </div>
            <div className="button" onClick={() => goRight()}><FontAwesomeIcon icon={faArrowRight}/></div>
        </div>
        </>
    )
}
