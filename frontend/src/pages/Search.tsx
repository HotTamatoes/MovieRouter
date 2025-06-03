import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import Searchbar from '../components/Searchbar'
import MovieCard, { Movie } from '../components/MovieCard';
import { fetcher } from './Home'
import useSWR from 'swr'

export default function Search() {
    const location = useLocation();
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768)
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const queryParams = new URLSearchParams(location.search)
    const query = queryParams.get('q'); // The 'q' is the name of the query parameter
    let url: string | null = null
    if(query && query.length > 5 && query.length <= 10 &&
        query.substring(0,2) == 'tt' && !Number.isNaN(Number(query.substring(2)))){
        url = `${import.meta.env.VITE_GOSERVER}/api/omdb?id=${query}`
    } else if (query) {
        url = `${import.meta.env.VITE_GOSERVER}/api/omdb?title=${query}`
    }
    const { data, error, isLoading } = useSWR<Movie>(
        url,
        fetcher
    )

    if(!query) return (<Searchbar showSearch={true}/>)
    if(error) return (<div>Error loading movies: {error.message}</div>)
    if(isLoading) return (<LoadingSpinner />)
    if (!data) {
    return (
        <>
            <Searchbar showSearch={true}/>
            <div>No Movie Found</div>
        </>)
    }

    if(data.Poster == '') {
        return (
        <>
            <Searchbar showSearch={true}/>
            <p>No movie was found with the title: {query}</p>
            <p>You can try searching for the imdb id instead</p>
        </>)
    }

    return (
        <>
            <Searchbar showSearch={isSmallScreen}/>
            <div className="card">
                <MovieCard movie={data} text="text" />
            </div>
        </>
    )
}