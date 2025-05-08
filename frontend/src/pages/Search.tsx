import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
interface Movie {
    title:    string
	year:     string
	rated:    string
	released: string
	genre:    string
	director: string
    plot:     string
	poster:   string
    id:       string
}

export default function Search() {
    const location = useLocation();
    const [movie, setMovie] = useState<Movie>()
    const [loading, setLoading] = useState(true)
    
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q'); // The 'q' is the name of the query parameter


    let url: string
    if(!query) {
        return
    }
    if(query.length > 5 && query.length <= 10 &&
        query.substring(0,2) == "tt" && Number.isNaN(Number(query.substring(2)))){
        url = `http://localhost:8080/api/omdb?id=${query}`
    } else {
        url = `http://localhost:8080/api/omdb?title=${query}`
    }

    useEffect(() => {
        const getData = async () => {
            const res = await fetch(url)
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
    }, []);
    
    if(loading) {
        return <LoadingSpinner />
    }

    if (!movie) {
        return
    }

    if(movie.poster == "") {
        return <><p>No movie was found with the title: {query}</p><p>You can try searching for the imdb id instead</p></>
    }

    return (
        <>
            <img src={movie.poster} alt="Loading..."></img>
        </>
    )
}