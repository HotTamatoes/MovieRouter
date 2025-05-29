import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './Searchbar.css';

type SearchbarProps = {
    showSearch: boolean;
}

export default function Searchbar({ showSearch }: SearchbarProps) {
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
        <form className="searchbox" onSubmit={submitHandler} style={showSearch ? {} : { display: 'none' }}>
            <input id='search' type='text' value={query} placeholder='Search' onChange={changeHandler} aria-label="Search input"/>
            <FontAwesomeIcon className="icon"
                icon={faMagnifyingGlass}
                onClick={queryHandler}
                aria-label="Submit search">
            </FontAwesomeIcon>
        </form>
    )
}
