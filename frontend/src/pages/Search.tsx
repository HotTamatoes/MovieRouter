import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieCard, { Movie } from "../components/MovieCard";
import Searchbar from "../components/Searchbar";

export default function Search() {
    const location = useLocation();
    const [movie, setMovie] = useState<Movie>()
    const [loading, setLoading] = useState(true)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q'); // The 'q' is the name of the query parameter


    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!query) {
            return
        }
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
    }, [query]);

    let url: string
    if(!query) {
        return (<Searchbar showSearch={true}/>)
    }
    if(query.length > 5 && query.length <= 10 &&
        query.substring(0,2) == "tt" && !Number.isNaN(Number(query.substring(2)))){
        url = `${import.meta.env.VITE_GOSERVER}/api/omdb?id=${query}`
    } else {
        url = `${import.meta.env.VITE_GOSERVER}/api/omdb?title=${query}`
    }
    
    if(loading) {
        return (<LoadingSpinner />)
    }

    if (!movie) {
        return (<></>)
    }

    if(movie.poster == "") {
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
                <MovieCard movie={movie} text="text" />
            </div>
        </>
    )
}