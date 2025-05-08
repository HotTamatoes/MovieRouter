import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Searchbar() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    function queryHandler(){
        if (query.trim() == '') {
            navigate('/')
        } else {
            navigate(`/Search?${new URLSearchParams({ q: query.trim() }).toString()}`)
        }
    }
    function changeHandler(e: React.ChangeEvent<HTMLInputElement>){setQuery(e.target.value)}
    function submitHandler(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        queryHandler();
    }

    return (
        <form className="searchbox" onSubmit={submitHandler}>
        <input id='search' type='text' value={query} placeholder='Search' onChange={changeHandler} aria-label="Search input"/>
            <i onClick={queryHandler} style={{marginLeft: '0.3em'}} aria-label="Submit search">
                <svg xmlns="http://www.w3.org/2000/svg" width = '1.8em' height = '1.8em' viewBox="0 0 512 512">
                    <path fill='#e4e4e4' d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                </svg>
            </i>
        </form>
    )
}
