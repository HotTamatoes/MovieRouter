import { useEffect, useRef, useState } from "react"
import { useParams } from 'react-router-dom'

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Theaters.css'
import LoadingSpinner from "../components/LoadingSpinner"
import { useLocation, Location } from '../components/LocationContext'
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
    const [theaters, setTheaters] = useState<Theater[]>([])
    const [loaded, setLoaded] = useState(false)
    const [clickedTheater, setClickedTheater] = useState<string | null>(null)
    const [expanded, setExpanded] = useState(window.innerWidth > 768)
    const [dragOffset, setDragOffset] = useState(0)
    const freshExpanded = useRef(expanded)
    const freshOffset = useRef(dragOffset)
    const startX = useRef<number | null>(null)
    const isDragging = useRef(false)
    const listingRef = useRef<HTMLDivElement | null>(null)
    const didFlip = useRef(false)
    const { userLocation, setUserLocation } = useLocation()
    const { postalCode } = useParams<{ postalCode: string }>()
    
        
    useEffect(() => {
        if (!postalCode || !userLocation) {
            return
        }
        if (postalCode != userLocation.PostalCode) {
            fetch(`${import.meta.env.VITE_GOSERVER}/latlng?postalCode=${postalCode}}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch location");
                    return res.json();
                })
                .then((loc: Location) => {
                    setUserLocation({
                        PostalCode: postalCode,
                        Lat: loc ? loc.Lat: 100,
                        Lng: loc ? loc.Lng: 200,
                    })
                })
        }
    }, [postalCode, userLocation])

    useEffect(() => {
        freshExpanded.current = expanded
    }, [expanded])

    useEffect(() => {
        freshOffset.current = dragOffset
    }, [dragOffset])

    function toggleExpanded(){
        setExpanded(!expanded)
    }

    useEffect(() => {
        window.addEventListener('mousemove', onDragMove)
        window.addEventListener('mouseup', onDragEnd)
        window.addEventListener('touchmove', onDragMove)
        window.addEventListener('touchend', onDragEnd)
    }, [])
    
    const getClientX = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            return e.touches[0].clientX
        }
        return e.clientX
    }

    function onDragStart(e: React.MouseEvent | React.TouchEvent) {
        startX.current = getClientX(e.nativeEvent)
        isDragging.current = true
        setDragOffset(0)
    }
    function onDragMove(e: MouseEvent | TouchEvent) {
        if (!isDragging.current || startX.current === null) return
        const x = getClientX(e)
        setDragOffset(x - startX.current)
    }
    function onDragEnd() {
        if(!isDragging.current) return
        const panelWidth = listingRef.current?.offsetWidth
        const offset = freshOffset.current
        const exp = freshExpanded.current
        if (!panelWidth) return
        if (exp && offset > panelWidth / 4){
            setExpanded(false)
            freshExpanded.current = false
            didFlip.current = true
        } else if (!exp && offset < -panelWidth / 4){
            setExpanded(true)
            freshExpanded.current = true
            didFlip.current = true
        }
        isDragging.current = false
        startX.current = null
        if (didFlip.current) {
            const flippedOffset = freshExpanded.current ? -panelWidth+freshOffset.current : panelWidth-freshOffset.current
            setDragOffset(flippedOffset)
            freshOffset.current = flippedOffset
        } else {
            setDragOffset(0)
            freshOffset.current = 0
        }
    }
    useEffect(() => {
        if (didFlip.current) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setDragOffset(0)
                    freshOffset.current = 0
                    didFlip.current = false
                })
            })
        }
    }, [expanded])

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=marker&v=weekly`;
        script.async = true;
        script.onload = () => setLoaded(true)
        document.head.appendChild(script)
    }, []);
    
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
            const res = await fetch(`${import.meta.env.VITE_GOSERVER}/theaterlist?lat=${userLocation.Lat}&lng=${userLocation.Lng}`)
            const resJson = await res.json()
            let out: Theater[] = []
            for (const theater of resJson.places) {
                out.push({
                    name: theater.displayName.text,
                    address: theater.formattedAddress,
                    rating: '' + theater.rating,
                    rating_count: '' + theater.userRatingCount,
                    lat: '' + theater.location.latitude,
                    lng: '' + theater.location.longitude
                })
            }
            setTheaters(out)
        }
        if(userLocation.Lat != 100){
            getData()
        }
    }, [userLocation])

    useEffect(() => {
        if (!loaded) return
        if (userLocation.Lat == 100) return
        const element = document.getElementById('map')
        if (element == null) return
        if (theaters.length == 0) return

        map = new google.maps.Map(element, {
            center: { lat: userLocation.Lat, lng: userLocation.Lng },
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
            position: { lat: userLocation.Lat, lng: userLocation.Lng },
            title: "You are here",
            content: herePin.element
        }));
        [...theaters].reverse().forEach((theater: Theater) => {
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

    if(theaters.length == 0 && userLocation.Error == "") {
        return (<>
            <LoadingSpinner />
        </>)
    }
    if(userLocation.Error){
        return (<p>Error: {userLocation.Error}</p>)
    }

    return (
    <>
        <div className="theaterPage">
            <div className={expanded ? "googleMap" : "googleMap mapExpanded"} id='map'>
            {!loaded && <p>Loading map</p>}
            </div>
            <div
                className={expanded ? "listing listingExpanded" : "listing"}
                ref={listingRef}
                onMouseDown={onDragStart}
                onTouchStart={onDragStart}
                style={
                    !isDragging.current? undefined : expanded? {
                        transform : `translateX(min(max(0px, ${dragOffset}px), calc(${listingRef.current?.offsetWidth}px - 2.5em)))`,
                        transition: 'none'
                    } : {
                        transform: `translateX(calc(${listingRef.current?.offsetWidth}px - 2.5em + max(min(0px, ${dragOffset}px), calc(-${listingRef.current?.offsetWidth}px + 2.5em))))`,
                        transition: 'none'
                    }
                }
            >
                {userLocation.Lat != 100 &&
                    <div>
                        <div className="theaterSearch">
                            <div className="chevron" onClick={toggleExpanded}>
                                {!expanded && <FontAwesomeIcon icon={faChevronLeft}/>}
                                {expanded && <FontAwesomeIcon icon={faChevronRight}/>}
                            </div>
                        </div>
                        <ul className="theaterList" >
                            {theaters.map((theater: Theater, index: number) => (
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
                {userLocation.Error && <p>Error: {userLocation.Error}</p>}
            </div>
        </div>
    </>
    )
}
