import './Theaters.css'
import { useEffect, useState } from "react"
import LoadingSpinner from "../components/LoadingSpinner"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
interface Theater {
    name: string
    address: string
    rating: string
    rating_count: string
    lat: string
    lng: string
}

let map: google.maps.Map
let markers: google.maps.marker.AdvancedMarkerElement[]
let lastMarker: google.maps.marker.AdvancedMarkerElement | null

export default function Theaters() {
    const [theaterCount, setTheaterCount] = useState('Max')
    const [theaters, setTheaters] = useState<Theater[]>([])
    const [loaded, setLoaded] = useState(false)
    const [userLocation, setUserLocation] = useState({
        lat: 100,
        lng: 200,
        error: ""
    })
    const [clickedTheater, setClickedTheater] = useState<string | null>(null)
    const [expanded, setExpanded] = useState(window.innerWidth > 768)

    function toggleExpanded(){
        setExpanded(!expanded)
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=marker&v=weekly`;
        script.async = true;
        script.onload = () => setLoaded(true)
        document.head.appendChild(script)
    }, []);

    useEffect(() => {
        function getLocation() {
            if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error)
            } else {
                setUserLocation({
                    lat: 100,
                    lng: 200,
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
        lng: longitude,
        error: ""
        })
    }
    function error() {
        setUserLocation({
        lat: 100,
        lng: 200,
        error: "Unable to retrieve your location"
        })
    }
    function theaterClick(name: string, fromMap: boolean) {
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
                if(!fromMap) {
                    if(marker.position) {
                        const lat = typeof marker.position.lat === 'function' ? marker.position.lat() : marker.position.lat;
                        const lng = typeof marker.position.lng === 'function' ? marker.position.lng() : marker.position.lng;
                        map.panTo(new google.maps.LatLng(lat, lng))
                    }
                }
            }
        })
        setClickedTheater(name)
        if (fromMap) {
            const target = document.getElementById(name)
            target?.scrollIntoView({behavior:"instant", block:"center"})
        }
    }
    useEffect(() => {
        const getData = async () => {
            const res = await fetch(`${import.meta.env.VITE_GOSERVER}/api/theaterlist?lat=${userLocation.lat}&lng=${userLocation.lng}`)
            const resJson = await res.json()
            let out: Theater[] = []
            for (const theater of resJson.places) {
                out.push({
                    name: theater.displayName,
                    address: theater.formattedAddress,
                    rating: '' + theater.rating,
                    rating_count: '' + theater.userRatingCount,
                    lat: '' + theater.location.latitude,
                    lng: '' + theater.location.longitude
                })
            }
            setTheaters(out)
        }
        if(userLocation.lat != 100){
            getData()
        }
    }, [userLocation])

    let theaterData: Theater[] = []

    if (theaterCount === 'Max') {
        theaterData = theaters
    } else {
        theaterData = theaters.slice(0, Number(theaterCount))
    }

    useEffect(() => {
        if (!loaded) return
        if (userLocation.lat == 100) return
        const element = document.getElementById('map')
        if (element == null) return
        if (theaters.length == 0) return

        map = new google.maps.Map(element, {
            center: { lat: userLocation.lat, lng: userLocation.lng },
            zoom: 11,
            mapId: 'map'
        });
        markers = []
        lastMarker = null
        const herePin = new google.maps.marker.PinElement({
            background: 'blue',
            borderColor: 'blue',
            glyph: '😎'
        })
        markers.push(new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: userLocation.lat, lng: userLocation.lng },
            title: "You are here",
            content: herePin.element
        }));
        [...theaterData].reverse().forEach((theater: Theater) => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                map,
                position: { lat: Number(theater.lat), lng: Number(theater.lng) },
                title: theater.name,
                content: new google.maps.marker.PinElement({
                    glyph: '📽️',
                }).element
            })
            marker.addListener('gmp-click', () => theaterClick(theater.name, true))
            markers.push(marker)
        })
    }, [loaded, userLocation, theaters])

    if(theaters.length == 0 && userLocation.error == "") {
        return (<>
            <h1>This page needs your location to load</h1>
            <LoadingSpinner />
        </>)
    }
    if(userLocation.error != ""){
        return (<p>Error: {userLocation.error}</p>)
    }

    return (
    <>
        <div className="theaterPage">
            <div className={expanded ? "googleMap" : "googleMap mapExpanded"} id='map'>
            {!loaded && <p>Loading map</p>}
            </div>
            <div className={expanded ? "listing listingExpanded" : "listing"}>
                {userLocation.lat != 100 &&
                    <div>
                        <div className="theaterDropdown">
                            <div className="chevron" onClick={toggleExpanded}>
                                {!expanded && <FontAwesomeIcon icon={faChevronLeft}/>}
                                {expanded && <FontAwesomeIcon icon={faChevronRight}/>}
                            </div>
                            <div className="rText">Number of Theaters:</div>
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
                                <li key={index} onClick={() => theaterClick(theater.name, false)} id={theater.name}>
                                    <div className={(theater.name === clickedTheater)? "box selected" : "box"}>
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
