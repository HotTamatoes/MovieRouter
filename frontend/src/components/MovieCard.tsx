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
        <div id="movieCard" className="movie-card">
            <div className="image">
                <img src={movie.poster} alt={movie.title} className="poster" />
            </div>
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
                <div className="info-row plot-row">
                    <span className="label">Plot:</span>
                    <span className="value">{movie.plot}</span>
                </div>
                <div className="info-row">
                    <span className="label">ID:</span>
                    <span className="value">{movie.id}</span>
                </div>
            </div>
        </div>
    )
}
