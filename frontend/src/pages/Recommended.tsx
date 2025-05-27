import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard from '../components/MovieCard'
import { Movie } from '../components/MovieCard'
import "./Recommended.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const movieList: string[] = ['tt11655566', 'tt9603208', 'tt1674782', 'tt32246771', 'tt9619824',
    'tt26743210', 'tt30840798', 'tt30253514', 'tt31193180', 'tt20969586', 'tt32299316', 'tt8115900']

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
                id: singleMovie.ImdbID
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
            <div className="button" onClick={() => goLeft()}><FontAwesomeIcon icon={faArrowLeft}/></div>
            <div className="card">
                <MovieCard movie={movie} text="text" />
            </div>
            <div className="button" onClick={() => goRight()}><FontAwesomeIcon icon={faArrowRight}/></div>
        </div>
        </>
    )
}
