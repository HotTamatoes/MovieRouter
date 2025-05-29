import logo from '../assets/Logo.png'
import { NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'
import Searchbar from './Searchbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBook, faMapLocationDot, faCircleCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function Navbar() {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                <div className="navbarText">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="genres">Genres</NavLink>
                    <NavLink to="theaters">Theatres</NavLink>
                    <NavLink to="recommended">Recommended</NavLink>
                    <NavLink to="about">About</NavLink>
                </div>
                <div className="navbarIcon">
                    <NavLink to="/"><FontAwesomeIcon icon={faHouse}/></NavLink>
                    <NavLink to="genres"><FontAwesomeIcon icon={faBook}/></NavLink>
                    <NavLink to="theaters"><FontAwesomeIcon icon={faMapLocationDot}/></NavLink>
                    <NavLink to="recommended"><FontAwesomeIcon icon={faCircleCheck}/></NavLink>
                    <NavLink to="search"><FontAwesomeIcon icon={faMagnifyingGlass}/></NavLink>
                </div>
                <div className="warning">
                    This Website is Under Construction, Estimated to be Complete In July 2025
                </div>
                <Searchbar showSearch={!isSmallScreen}/>
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}