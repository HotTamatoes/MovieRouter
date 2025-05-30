import { useEffect, useState } from 'react'
import './Home.css'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard from '../components/MovieCard';
import { Movie } from '../components/MovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';

const movieList: string[] = ['tt11655566', 'tt9603208', 'tt1674782', 'tt32246771', 'tt9619824',
    'tt26743210', 'tt30840798', 'tt30253514', 'tt31193180', 'tt20969586', 'tt32299316', 'tt8115900']

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [movies, setMovies] = useState<Movie[]>([])
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    useEffect(() => {
        const getData = async () => {
            let out: Movie[] = []
            for (let movie of movieList) {
            const res = await fetch(`${import.meta.env.VITE_GOSERVER}/api/omdb?id=${movie}`)
            const singleMovie = await res.json()
            out.push({
                title: singleMovie.Title,
                year: singleMovie.Year,
                rated: singleMovie.Rated,
                released: singleMovie.Released,
                genre: singleMovie.Genre,
                director: singleMovie.Director,
                plot: singleMovie.Plot,
                poster: singleMovie.Poster,
                id: singleMovie.ImdbID
            })
            }
            setMovies(out)
        }
        getData()
        setLoading(false)
    }, []);

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

    if(loading){
        return <LoadingSpinner />
    }
    
    return (
    <>
    <h1 className="welcome">Welcome to Movie-Router.com!</h1>
    <div className="homeWarning">
        This Website is Under Construction, Estimated to be Complete In July 2025
    </div>
    <ul className="movieList" id="movieList">
        {movies.map((movie: Movie, index: number) => (
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
