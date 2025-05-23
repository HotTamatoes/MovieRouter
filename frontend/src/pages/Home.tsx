import { useEffect, useState } from 'react'
import './Home.css'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieCard from '../components/MovieCard';
import { Movie } from '../components/MovieCard';

const movieList: string[] = ['tt20969586', 'tt31193180', 'tt3566834', 'tt7068946', 'tt11092020',
  'tt13652286', 'tt23060698', 'tt30955489', 'tt26597666', 'tt7967302', 'tt0899043', 'tt31434639']

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState<Movie[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
            plot: singleMovie.Plot,
            poster: singleMovie.Poster,
            id: singleMovie.id
        })
      }
      setMovies(out)
    }
    getData()
    setLoading(false)
  }, []);

  function movieBoxisActive(index: number) {
    const movieBoxes = document.querySelectorAll('#movieList li');
    movieBoxes[index].classList.add('selected')
    setActiveIndex(index)
  }
  function setInactive() {
    const movieBoxes = document.querySelectorAll(".selected")
    movieBoxes.forEach((movie) => {
      movie.classList.remove('selected')
    })
    setActiveIndex(null)
  }

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
        <li key={index} onClick={() => movieBoxisActive(index)}>
          <MovieCard movie={movie} text={activeIndex === index ? 'text' : 'hidden'} />
        </li>
        ))}
      <div id="overlay" onClick={setInactive}></div>
    </ul>
    </>
  )
}