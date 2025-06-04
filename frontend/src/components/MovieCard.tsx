import './MovieCard.css'
import { useState, useEffect } from 'react'

export interface Movie {
    Title:    string
    Year:     string
    Rated:    string
    Released: string
    Genre:    string
    Director: string
    Plot:     string
    Poster:   string
    ImdbID:   string
}

type MovieCardProp = {
    movie: Movie,
    text: string
}


export default function MovieCard({ movie, text }: MovieCardProp) {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div id="movieCard"
            className="movieCard"
            style={isSmallScreen ?
            {
                backgroundImage: `url(${movie.Poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                aspectRatio: '2 / 3'
            } : {}}>
            {!isSmallScreen && <div className="image">
                <img src={movie.Poster} alt={movie.Title} className="poster"/>
            </div>}
            <div className={`${text}`}>
                <div className="yearByTitle">
                    <span className="title">{movie.Title}</span>
                    <span className="year">({movie.Year})</span>
                </div>
                <div className="info-row">
                    <span className="label">Rated:</span>
                    <span className="value">{movie.Rated}</span>
                </div>
                <div className="info-row">
                    <span className="label">Released:</span>
                    <span className="value">{movie.Released}</span>
                </div>
                <div className="info-row">
                    <span className="label">Genre:</span>
                    <span className="value">{movie.Genre}</span>
                </div>
                <div className="info-row">
                    <span className="label">Director:</span>
                    <span className="value">{movie.Director}</span>
                </div>
                <div className="info-row">
                    <span className="label">IMDB ID:</span>
                    <span className="value">{movie.ImdbID}</span>
                </div>
                <div className={"info-row plot-row"}>
                    <span className="label">Plot:</span>
                    <span className="value">{movie.Plot}</span>
                </div>
            </div>
            <div id="overlay"></div>
        </div>
    )
}
