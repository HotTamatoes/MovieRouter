import logo from '../assets/Logo.png'
import { Link, Outlet } from 'react-router-dom'
import './Navbar.css'
import Searchbar from './Searchbar'

export default function Navbar() {

    return (
        <>
            <div className="headbar">
                <div className="logobox">
                    <Link to="/">
                        <img src={logo} className="logo" alt="MovieRouterLogo" />
                    </Link>
                    <Link to="/" style={{ color: 'var(--text-color)' }}>
                        <h1 className="caveat">Movie Router</h1>
                    </Link>
                </div>
                <div className="navbar">
                    <Link to="/">Home</Link>
                    <Link to="genres">Genres</Link>
                    <Link to="theaters">Theatres</Link>
                    <Link to="recommended">Recommended</Link>
                </div>
                <Searchbar />
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}