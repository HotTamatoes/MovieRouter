import logo from '../assets/Logo.png'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'
import Searchbar from './Searchbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faBook, faMapLocationDot, faCircleCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function Navbar() {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768)
    const { postalCode } = useParams<{ postalCode: string }>()

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            <div className="headbar">
                <div className="logobox">
                    <NavLink to={postalCode? `/${postalCode}`: "/"} end>
                        <img src={logo} className="logo" alt="MovieRouterLogo" />
                    </NavLink>
                    <NavLink to={postalCode? `/${postalCode}`: "/"} end style={{ color: 'var(--text-color)' }}>
                        <h1 className="caveat">Movie Router</h1>
                    </NavLink>
                </div>
                <div className="navbarText">
                    <NavLink to={postalCode? `/${postalCode}`: "/"} end>Home</NavLink>
                    <NavLink to={postalCode? `/${postalCode}/genres` : "/genres"}>Genres</NavLink>
                    <NavLink to={postalCode? `/${postalCode}/theaters` : "/theaters"}>Theaters</NavLink>
                    <NavLink to={postalCode? `/${postalCode}/recommended` : "/recommended"}>Recommended</NavLink>
                    <NavLink to={postalCode? `/${postalCode}/about` : "/about"}>About</NavLink>
                </div>
                <div className="navbarIcon">
                    <NavLink to={postalCode? `/${postalCode}` : "/"} end><FontAwesomeIcon icon={faHouse}/></NavLink>
                    <NavLink to={postalCode? `/${postalCode}/genres`: "/genres"}><FontAwesomeIcon icon={faBook}/></NavLink>
                    <NavLink to={postalCode? `/${postalCode}/theaters` : "/theaters"}><FontAwesomeIcon icon={faMapLocationDot}/></NavLink>
                    <NavLink to={postalCode? `/${postalCode}/recommended` : "recommended"}><FontAwesomeIcon icon={faCircleCheck}/></NavLink>
                    <NavLink to={postalCode? `/${postalCode}/search` : "search"}><FontAwesomeIcon icon={faMagnifyingGlass}/></NavLink>
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