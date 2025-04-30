import { API_KEY } from "../api-key"
import { useLoaderData } from "react-router-dom"
import { useState } from "react"
import g from '../assets/g.json'


interface Theater {
    name: string
    address: string
    rating: string
    rating_count: string
}

export async function theaterLoader(): Promise<Theater[]> {
    let out: Theater[] = []
    for (const theater of g.results) {
        out.push({
            name: theater.name,
            address: theater.address.city,
            rating: '' + theater.id,
            rating_count: '' + theater.website
        })
    }
    return out
}

/*
export async function theaterLoader() {
    const webRequest = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='+API_KEY+'&location=39.9705652,-105.2012432&radius=25000&type=movie_theater'
    return fetch(webRequest).then(res => res.json()).catch(err => err.message + '\n' + webRequest)
}
*/

export default function Theaters() {
    const [theaterCount, setTheaterCount] = useState('Max')
    const theaters = useLoaderData()
    let theaterData: Theater[] = []

    if (theaterCount === 'Max') {
        theaterData = theaters
    } else {
        theaterData = theaters.slice(0, theaterCount)
    }

    return (
    <>
        <p >Number of Theaters: </p>
        <select id='theater-count' value={theaterCount} onChange={(e) => setTheaterCount(e.target.value)}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='Max'>Max</option>
        </select>
        <ul>
            {theaterData.map((theater: Theater, index: number) => (<li key={index}>{theater.name}, {theater.address}, {theater.rating}, {theater.rating_count}</li>))}
        </ul>
    </>
    )
}
