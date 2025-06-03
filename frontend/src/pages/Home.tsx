import { useState } from 'react'
import './Home.css'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard, { Movie } from '../components/MovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr'
    
export const fetcher = (url: string) =>
    fetch(url).then((res) => {
    if (!res.ok) {
        throw new Error('Failed to fetch');
    }
    return res.json();
});

export default function Home() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const { data, error, isLoading } = useSWR<Movie[]>(`${import.meta.env.VITE_GOSERVER}/api/omdb`, fetcher)


    function movieBoxisActive(index: number) {
        setActiveIndex(index)
    }
    function setInactive() {
        setActiveIndex(null)
    }

    const scrollContainer = document.getElementById("movieList");
    if(scrollContainer) {
        scrollContainer.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += (evt.deltaY/2)
        ;})
    ;}

    if(error) return (<div>Error loading movies: {error.message}</div>)
    if(isLoading) return (<LoadingSpinner />)
    if(!data || data.length === 0) return (<div>No Movies Found</div>)
    
    return (
    <>
    <h1 className="welcome">Welcome to Movie-Router.com!</h1>
    <div className="homeWarning">
        This Website is Under Construction, Estimated to be Complete In July 2025
    </div>
    <ul className="movieList" id="movieList">
        {data.map((movie: Movie, index: number) => (
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
