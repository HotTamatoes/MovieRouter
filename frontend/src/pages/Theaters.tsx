import { APIKey } from "../api-key.tsx"
import './Theaters.css'
import { useEffect, useState } from "react"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
interface Theater {
    name: string
    address: string
    rating: string
    rating_count: string
}

export default function Theaters() {
    const [theaterCount, setTheaterCount] = useState('Max')
    const [theaters, setTheaters] = useState<Theater[]>([])
    const [userLocation, setUserLocation] = useState({
        lat: 100,
        long: 200,
        error: ""
    })

    useEffect(() => {
        function getLocation() {
            if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
            } else {
            setUserLocation({
                lat: 100,
                long: 200,
                error: "Geolocation is not supported by this browser."
            })
            }
        }
        getLocation()
        return
    }, [])

    function success(position: GeolocationPosition) {
        const {latitude, longitude} = position.coords;
        setUserLocation({
        lat: latitude,
        long: longitude,
        error: ""
        })
    }
    function error() {
        setUserLocation({
        lat: 100,
        long: 200,
        error: "Unable to retrieve your location"
        })
    }

    useEffect(() => {
        const getData = async () => {
            const res = await fetch(`http://localhost:8080/api/theaterlist?location=${userLocation.lat},${userLocation.long}`)
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
    }, [userLocation])

    let theaterData: Theater[] = []

    if (theaterCount === 'Max') {
        theaterData = theaters
    } else {
        theaterData = theaters.slice(0, Number(theaterCount))
    }

    return (
    <>
        <div className="theaterPage">
            <div className="googleMap">
                <APIProvider apiKey={APIKey}>
                    <Map
                        defaultZoom={13}
                        defaultCenter={ {lat: -33.860664, lng: 151.208138 } }
                    >
                    </Map>
                </APIProvider>
            </div>
            <div className="listing">
                {userLocation.lat != 100 &&
                    <div>
                        <div className="results">
                            <p >Number of Theaters:</p>
                            <select id='theater-count' value={theaterCount} onChange={(e) => setTheaterCount(e.target.value)}>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                                <option value='5'>5</option>
                                <option value='Max'>Max</option>
                            </select>
                        </div>
                        <ul className="theaterList" >
                            {theaterData.map((theater: Theater, index: number) => (
                                <li key={index}>
                                    <div className="box">{theater.name}, {theater.address}, {theater.rating}, {theater.rating_count}</div>
                                </li>
                                ))}
                        </ul>
                    </div>
                }
                {userLocation.error != '' && <p>Error: {userLocation.error}</p>}
            </div>
        </div>
    </>
    )
}
