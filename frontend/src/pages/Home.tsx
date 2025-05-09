import { useEffect, useState } from 'react'
import './Home.css'
import LoadingSpinner from '../components/LoadingSpinner'

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
export default function Home() {
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const getData = async () => {
      let out: Movie[] = []
      for (let movie of movieList) {
        const res = await fetch(`${import.meta.env.VITE_GOSERVER}/api/omdb?id=${movie}`)
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
      }
      setMovies(out)
    }
    getData()
    setLoading(false)
  }, []);

  const scrollContainer = document.getElementById("movieList");
  if(scrollContainer) {
    scrollContainer.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += (evt.deltaY/2)
    ;})
  ;}

  if(loading){
    return <LoadingSpinner />
  }
  
  return (
      <>
      <h1>Welcome to Movie-Router.com</h1>
      <ul className="movieList" id="movieList">
        {movies.map((movie: Movie, index: number) => (
          <li key={index}>
              <div className="box">
                  <div className="image">
                    <img src={movie.poster} alt={movie.poster} className='poster'></img>
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
    </>
  )
}