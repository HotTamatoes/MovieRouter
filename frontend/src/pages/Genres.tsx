import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import './Genres.css'
import MovieCard from '../components/MovieCard';
import { Movie } from '../components/MovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const movieList: string[] = ['tt11655566', 'tt9603208', 'tt1674782', 'tt32246771', 'tt9619824',
    'tt26743210', 'tt30840798', 'tt30253514', 'tt31193180', 'tt20969586', 'tt32299316', 'tt8115900']

function addUniqueSections(input: string, existingGenres: string[]): string[] {
    const genres = input.split(',').map(s => s.trim())
    for (const genre of genres) {
        if (genre && !existingGenres.includes(genre)) {
            existingGenres.push(genre)
        }
    }
    return existingGenres
}

function goToTarget(id: string){
    const target = document.getElementById(id)
    target?.scrollIntoView({behavior:"instant", block:"center"})
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

export default function Genres() {
    const [loading, setLoading] = useState(true)
    const [movies, setMovies] = useState<Movie[]>([])
    const [genres, setGenres] = useState<string[]>([])
    const [activeIndexGenrePair, setActiveIndexGenrePair] = useState<{idx: number, gnr: string} | null>(null)
    const [navbarShow, setNavbarShow] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


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
                setGenres(addUniqueSections(singleMovie.Genre, genres))
            }
            setMovies(out)
        }
        getData()
        setLoading(false)
    }, []);

    function toggleGenreNav() {
        setNavbarShow(!navbarShow)
    }

    function movieBoxisActive(genre: string, index: number) {
        const list = document.querySelector(`.${genre} .movieList`)
        const movieBoxes = list?.querySelectorAll('li');
        if (movieBoxes && movieBoxes[index]) {
            movieBoxes[index].classList.add('selected')
            setActiveIndexGenrePair({ idx: index, gnr: genre})
        }
    }
    function setInactive() {
        setActiveIndexGenrePair(null)
    }

    useEffect(() => {
        const scrollContainers = document.querySelectorAll(".movieList") as NodeListOf<HTMLElement>;
        scrollContainers.forEach((scrollContainer) => {
            if(scrollContainer.scrollWidth > scrollContainer.clientWidth) {
                scrollContainer.addEventListener("wheel", (evt) => {
                    evt.preventDefault();
                    scrollContainer.scrollLeft += (evt.deltaY/2)
                ;})
            }
        ;})
    }, [movies])

    if(loading){
        return <LoadingSpinner />
    }

    return (
        <>
        {isSmallScreen && !navbarShow && 
            <div className="burger" onClick={toggleGenreNav}><FontAwesomeIcon icon={faBars}/></div>
        }
        {(!isSmallScreen || (isSmallScreen && navbarShow)) &&
            <div className="genrenavbar">
                {isSmallScreen &&
                    <div className="genrebutton stower"><FontAwesomeIcon icon={faChevronRight} onClick={toggleGenreNav}/></div>
                }
                <div className="genrebutton" onClick={goToTop}>Top</div>
                {genres.map((genre) => (
                    <div className="genrebutton" onClick={() => goToTarget(genre)}>
                        {genre}
                    </div>
                ))}
            </div>
        }
        {genres.map((genre) => {
            const genreMovies = movies.filter((movie) =>
                movie.genre.split(',').map(s => s.trim()).includes(genre)
            );

            if (genreMovies.length === 0) return null;

            return (
                <div className={`genrebox ${genre}`} key={genre}>
                    <div className="genreTitle">{genre}</div>
                    <ul className="movieList" id={genre}>
                        {genreMovies.map((movie, index) => (
                            <li key={index}
                                onClick={() => {
                                    if (!activeIndexGenrePair || (activeIndexGenrePair.gnr !== genre && activeIndexGenrePair.idx !== index)) {
                                        movieBoxisActive(genre, index);
                                    }
                                }}
                                className={(activeIndexGenrePair && activeIndexGenrePair.gnr === genre && activeIndexGenrePair.idx === index) ? 'selected' : ''}>
                                <MovieCard
                                    movie={movie}
                                    text={(activeIndexGenrePair && activeIndexGenrePair.gnr == genre && activeIndexGenrePair.idx == index) ? 'text' : 'hidden'}
                                />
                                {activeIndexGenrePair && activeIndexGenrePair.gnr == genre && activeIndexGenrePair.idx == index && (
                                    <div className="xBtn" onClick={setInactive}>
                                        <FontAwesomeIcon icon={faX} />
                                    </div>
                                )}
                            </li>
                        ))}
                        <div id="overlay" onClick={setInactive}></div>
                    </ul>
                </div>
            );
        })}
        </>
    )
}
