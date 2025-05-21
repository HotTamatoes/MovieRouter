import logo from '../assets/Logo.png'
import { NavLink, Outlet } from 'react-router-dom'
import './Navbar.css'
import Searchbar from './Searchbar'

export default function Navbar() {

    return (
        <>
            <div className="headbar">
                <div className="logobox">
                    <NavLink to="/">
                        <img src={logo} className="logo" alt="MovieRouterLogo" />
                    </NavLink>
                    <NavLink to="/" style={{ color: 'var(--text-color)' }}>
                        <h1 className="caveat">Movie Router</h1>
                    </NavLink>
                </div>
                <div className="navbar">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="genres">Genres</NavLink>
                    <NavLink to="theaters">Theatres</NavLink>
                    <NavLink to="recommended">Recommended</NavLink>
                </div>
                <div className="warning">
                    This Website is Under Construction, Estimated to be Complete In July 2025
                </div>
                <Searchbar />
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}