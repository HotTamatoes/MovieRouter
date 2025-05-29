import './MovieCard.css'
import { useState, useEffect } from 'react'

export interface Movie {
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
                backgroundImage: `url(${movie.poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                aspectRatio: '2 / 3'
            } : {}}>
            {!isSmallScreen && <div className="image">
                <img src={movie.poster} alt={movie.title} className="poster"/>
            </div>}
            <div className={`${text}`}>
                <div className="yearByTitle">
                    <span className="title">{movie.title}</span>
                    <span className="year">({movie.year})</span>
                </div>
                <div className="info-row">
                    <span className="label">Rated:</span>
                    <span className="value">{movie.rated}</span>
                </div>
                <div className="info-row">
                    <span className="label">Released:</span>
                    <span className="value">{movie.released}</span>
                </div>
                <div className="info-row">
                    <span className="label">Genre:</span>
                    <span className="value">{movie.genre}</span>
                </div>
                <div className="info-row">
                    <span className="label">Director:</span>
                    <span className="value">{movie.director}</span>
                </div>
                <div className="info-row">
                    <span className="label">ID:</span>
                    <span className="value">{movie.id}</span>
                </div>
                <div className={"info-row plot-row"}>
                    <span className="label">Plot:</span>
                    <span className="value">{movie.plot}</span>
                </div>
            </div>
            <div id="overlay"></div>
        </div>
    )
}
