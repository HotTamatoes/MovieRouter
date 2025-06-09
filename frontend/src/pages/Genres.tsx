import { useState, useEffect } from "react"
import LoadingSpinner from "../components/LoadingSpinner"
import './Genres.css'
import MovieCard, { Movie } from '../components/MovieCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { fetcher } from './Home'
import useSWR from 'swr'

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
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}

export default function Genres() {
    const [genres, setGenres] = useState<string[]>([])
    const [activeIndexGenrePair, setActiveIndexGenrePair] = useState<{idx: number, gnr: string} | null>(null)
    const [navbarShow, setNavbarShow] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const { data, error, isLoading } = useSWR<Movie[]>(`${import.meta.env.VITE_GOSERVER}/omdb`, fetcher)

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!data) return
        let out: string[] = []
        data.forEach((movie) => {
            addUniqueSections(movie.Genre, out)
        })
        setGenres(out)
    }, [data])

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
        const scrollContainers = document.querySelectorAll<HTMLElement>('.movieList')
        const handlers: { el: HTMLElement, fn: (evt: WheelEvent) => void }[] = []

        scrollContainers.forEach((scrollContainer) => {
            if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
                const action = (evt: WheelEvent) => {
                    evt.preventDefault()
                    scrollContainer.scrollLeft += 1.5 * evt.deltaY
                }
                scrollContainer.addEventListener('wheel', action, { passive: false })
                handlers.push({ el: scrollContainer, fn: action })
            }
        })

        return () => {
            handlers.forEach(({ el, fn }) => {
                el.removeEventListener('wheel', fn)
            })
        }
    }, [genres])

    if(error) return (<div>Error loading movies: {error.message}</div>)
    if(isLoading) return (<LoadingSpinner />)
    if(!data || data.length === 0) return (<div>No Movies Found</div>)

    return (
        <>
        {isSmallScreen && !navbarShow && 
            <div className="burger" onClick={toggleGenreNav}><FontAwesomeIcon icon={faBars}/></div>
        }
        {(!isSmallScreen || (isSmallScreen && navbarShow)) &&
            <div className="genrenavbar">
                {isSmallScreen &&
                    <div className="genrebutton stower" onClick={toggleGenreNav}><FontAwesomeIcon icon={faChevronRight}/></div>
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
            const genreMovies = data.filter((movie) =>
                movie.Genre.split(',').map(s => s.trim()).includes(genre)
            )

            if (genreMovies.length === 0) return null

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
            )
        })}
        </>
    )
}
