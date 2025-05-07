import rawAPIKey from "../../../api-key.txt"
import './Theaters.css'
import { useEffect, useState } from "react"
import { APIProvider, latLngEquals, Map } from "@vis.gl/react-google-maps"
interface Theater {
    name: string
    address: string
    rating: string
    rating_count: string
    lat: string
    long: string
}

let map: google.maps.Map
let markers: google.maps.marker.AdvancedMarkerElement[]
let lastMarker: google.maps.marker.AdvancedMarkerElement | null

export default function Theaters() {
    const [APIKey, setAPIKey] = useState<string>('')
    const [theaterCount, setTheaterCount] = useState('Max')
    const [theaters, setTheaters] = useState<Theater[]>([])
    const [loaded, setloaded] = useState(false);
    const [userLocation, setUserLocation] = useState({
        lat: 100,
        long: 200,
        error: ""
    })
    
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
        if(APIKey == '') return;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=marker&v=weekly`;
        script.async = true;
        script.onload = () => setloaded(true);
        document.head.appendChild(script);
    }, [APIKey]);

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
    
    function theaterClick(name: string) {
        markers.forEach((marker) => {
            const viewedPin = new google.maps.marker.PinElement({
                background: 'orange',
                scale: 1.25,
                glyph: '📽️',
            })
            const defaultPin = new google.maps.marker.PinElement({glyph: '📽️'})
            if (marker.title == name) {
                if (lastMarker) {
                    lastMarker.content = defaultPin.element
                }
                marker.content = viewedPin.element
                lastMarker = marker
            }
        });
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
                    rating_count: '' + theater.user_ratings_total,
                    lat: '' + theater.geometry.location.lat,
                    long: '' + theater.geometry.location.lng
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

    useEffect(() => {
        if (!loaded) return;
        if (userLocation.lat == 100) return;
        const element = document.getElementById('map')
        if (element == null) return;
        if (theaters.length == 0) return;

        map = new google.maps.Map(element, {
            center: { lat: userLocation.lat, lng: userLocation.long },
            zoom: 11,
            mapId: 'map'
        });
        markers = []
        lastMarker = null
        const herePin = new google.maps.marker.PinElement({
            glyph: '😎'
        })
        markers.push(new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: userLocation.lat, lng: userLocation.long },
            title: "You are here",
            content: herePin.element
        }));
        [...theaterData].reverse().forEach((theater: Theater) => {
            markers.push(new google.maps.marker.AdvancedMarkerElement({
                map,
                position: { lat: Number(theater.lat), lng: Number(theater.long) },
                title: theater.name,
                content: new google.maps.marker.PinElement({
                    glyph: '📽️',
                }).element
            }));
        });
    }, [loaded, userLocation, theaters]);

    return (
    <>
        <div className="theaterPage">
            <div className="googleMap" id='map'>
            {!loaded && <p>Loading map</p>}
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
                                <li key={index} onClick={() => theaterClick(theater.name)}>
                                    <div className="box">
                                        <div className="title">{theater.name}</div>
                                        <div className="address">{theater.address}</div>
                                        <div className="rating">{theater.rating}⭐ with {theater.rating_count} Ratings</div>
                                    </div>
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
