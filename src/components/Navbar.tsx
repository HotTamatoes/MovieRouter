import logo from '../assets/Logo.png'
import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    function queryHandler(){ navigate(`/Search/${query}`)}
    function changeHandler(e: React.ChangeEvent<HTMLInputElement>){setQuery(e.target.value)}
    function submitHandler(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        queryHandler();
    }


    return (
        <>
            <div className="headbar">
                <div className="logobox">
                    <Link to="/">
                        <img src={logo} className="logo" alt="MovieRouterLogo" />
                    </Link>
                    <Link to="/" style={{ color: 'var(--color)' }}>
                        <h1 className="caveat">Movie Router</h1>
                    </Link>
                </div>
                <div className="navbar">
                    <Link to="/">Home</Link>
                    <Link to="genres">Genres</Link>
                    <Link to="theatres">Theatres</Link>
                    <Link to="recommended">Recommended</Link>
                </div>
                <form className="searchbox" onSubmit={submitHandler}>
                    <input id='search' type='text' value={query} placeholder='Search' onChange={changeHandler} />
                    <i onClick={queryHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" width = '1.8em' height = '1.8em' viewBox="0 0 512 512">
                            <path fill='#ffffff' d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                        </svg>
                    </i>
                </form>
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}