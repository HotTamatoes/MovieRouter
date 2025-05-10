    import { useEffect, useState } from 'react'
    import LoadingSpinner from '../components/LoadingSpinner'
    import MovieCard from '../components/MovieCard'
    import { Movie } from '../components/MovieCard'
    import "./Recommended.css"

    const movieList: string[] = ['tt20969586', 'tt31193180', 'tt3566834', 'tt7068946', 'tt11092020',
    'tt13652286', 'tt23060698', 'tt30955489', 'tt26597666', 'tt7967302', 'tt0899043', 'tt31434639']

    export default function Recommended() {
    const [index, setIndex] = useState(0)
    const [movie, setMovie] = useState<Movie>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            const res = await fetch(`${import.meta.env.VITE_GOSERVER}/api/omdb?id=${movieList[index]}`)
            const singleMovie = await res.json()
            setMovie({
                title: singleMovie.Title,
                year: singleMovie.Year,
                rated: singleMovie.Rated,
                released: singleMovie.Released,
                genre: singleMovie.Genre,
                director: singleMovie.Director,
                plot: singleMovie.Plot,
                poster: singleMovie.Poster,
                id: singleMovie.id
            })
        }
        getData()
        setLoading(false)
    }, [index]);

    function goLeft() {
        if(index > 0) {
            setIndex(index-1)
        }
    }
    function goRight() {
        if(index < movieList.length-1) {
            setIndex(index+1)
        }
    }

    if(loading){
        return <LoadingSpinner />
    }

    if (!movie) {
        return
    }
    
    return (
        <>
        <div className="recContainer">
            <div className="button" onClick={() => goLeft()}>◀️</div>
            <div className="card">
                <MovieCard movie={movie} text="text" />
            </div>
            <div className="button" onClick={() => goRight()}>▶️</div>
        </div>
        </>
    )
}
