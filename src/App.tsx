import { useState } from 'react'
import logo from './assets/Logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
      <div className="headbar">
        <div className="logobox">
          <a href="#">
            <img src={logo} className="logo" alt="MovieRouterLogo" />
          </a>
          <h1 className="caveat">Movie Router</h1>
        </div>
        <div className="navbar">
          <a href="#home">Home</a>
          <a href="#genres">Genres</a>
          <a href="#theatres">Theatres</a>
          <a href="#rec">Recommended</a>
        </div>
        <input type="text" placeholder="Search.."/>
      </div>
      <h1>Welcome to MovieRouter.com</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p>
        Welcome welcome
      </p>
    </>
  )
}

export default App