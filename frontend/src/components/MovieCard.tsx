import React from 'react'
import './MovieCard.css'

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
    return (
    <>
    <div id="movieCard">
        <div className="image">
            <img src={movie.poster} alt={movie.poster} className='poster'></img>
        </div>
        <div className={text}>
            <div className="yearByTitle">
                <div className="title">{movie.title}</div>
                <div>({movie.year})</div>
            </div>
            <div className="rated">{movie.rated}</div>
            <div className="released">{movie.released}</div>
            <div className="genre">{movie.genre}</div>
            <div className="director">{movie.director}</div>
        </div>
    </div>
    </>
    )
}