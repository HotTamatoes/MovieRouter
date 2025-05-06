import rawAPIKey from "../../../api-key.txt"
import { useEffect, useState } from "react"

interface Theater {
    name: string
    address: string
    rating: string
    rating_count: string
}

export default function test() {
    const [APIKey, setAPIKey] = useState('')
    const [theaterCount, setTheaterCount] = useState('Max')
    const [theaters, setTheaters] = useState<Theater[]>([])
    const [refresh, setRefresh] = useState(false)
    
    useEffect(() => {
        let ignore = false
        const getAPI = async () => {
            const result = await fetch(rawAPIKey)
            if (!ignore) {
                const text = await result.text()
                setAPIKey(text);
            }
        }
        getAPI()
        return () => {
            ignore = true;
        };
    }, [])

    

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("http://localhost:8080/api/theaterlist?location=39.97929,-105.25091")
            const resJson = await res.json()
            let out: Theater[] = []
            for (const theater of resJson.results) {
                out.push({
                    name: theater.name,
                    address: theater.vicinity,
                    rating: '' + theater.rating,
                    rating_count: '' + theater.user_ratings_total
                })
            }
            setTheaters(out)
        }
        getData()
        return
    }, [refresh])

    let theaterData: Theater[] = []

    if (theaterCount === 'Max') {
        theaterData = theaters
    } else {
        theaterData = theaters.slice(0, Number(theaterCount))
    }

    return (
    <>
        <button onClick={() => setRefresh(!refresh)}>Reload</button>
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
