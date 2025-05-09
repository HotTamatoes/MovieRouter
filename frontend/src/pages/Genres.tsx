import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import './Genres.css'

const movieList: string[] = ['tt20969586', 'tt31193180', 'tt3566834', 'tt7068946', 'tt11092020',
    'tt13652286', 'tt23060698', 'tt30955489', 'tt26597666', 'tt7967302', 'tt0899043', 'tt31434639']

interface Movie {
    title:    string
	year:     string
	rated:    string
	released: string
	genre:    string
	director: string
	poster:   string
}

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

export default function Genres() {
    const [loading, setLoading] = useState(true)
    const [movies, setMovies] = useState<Movie[]>([])
    const [genres, setGenres] = useState<string[]>([])

    useEffect(() => {
        const getData = async () => {
            let out: Movie[] = []
            for (let movie of movieList) {
                const res = await fetch(`http://${import.meta.env.VITE_GOSERVER_DOMAIN}:${import.meta.env.VITE_GOSERVER_PORT}/api/omdb?id=${movie}`)
                const singleMovie = await res.json()
                out.push({
                    title: singleMovie.Title,
                    year: singleMovie.Year,
                    rated: singleMovie.Rated,
                    released: singleMovie.Released,
                    genre: singleMovie.Genre,
                    director: singleMovie.Director,
                    poster: singleMovie.Poster
                })
                setGenres(addUniqueSections(singleMovie.Genre, genres))
            }
            setMovies(out)
        }
        getData()
        setLoading(false)
    }, []);

    const scrollContainers = document.querySelectorAll(".movieList") as NodeListOf<HTMLElement>;
    scrollContainers.forEach((scrollContainer) => {
        if(scrollContainer.scrollWidth > scrollContainer.clientWidth) {
            scrollContainer.addEventListener("wheel", (evt) => {
                evt.preventDefault();
                scrollContainer.scrollLeft += (evt.deltaY/2)
            ;})
        }
    ;})

    if(loading){
        return <LoadingSpinner />
    }

    return (
        <>
        <div className="genrenavbar">
        {genres.map((genre) => (
            <div className="genrebutton" onClick={() => goToTarget(genre)}>
                {genre}
            </div>
        ))}
        </div>
        {genres.map((genre) => {
            const genreMovies = movies.filter((movie) =>
                movie.genre.split(',').map(s => s.trim()).includes(genre)
            );

            if (genreMovies.length === 0) return null;

            return (
                <div className="genrebox" key={genre} id={genre}>
                    <p>{genre}</p>
                    <ul className="movieList" id="movieList">
                        {genreMovies.map((movie, index) => (
                            <li key={index}>
                                <div className="box">
                                    <div className="image">
                                        <img src={movie.poster} alt={movie.title} className="poster" />
                                    </div>
                                    <div className="title">{movie.title}</div>
                                    <div className="year">{movie.year}</div>
                                    <div className="rated">{movie.rated}</div>
                                    <div className="released">{movie.released}</div>
                                    <div className="genre">{movie.genre}</div>
                                    <div className="director">{movie.director}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        })}
        </>
    )
}
