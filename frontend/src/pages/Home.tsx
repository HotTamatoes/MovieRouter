import { useEffect, useState } from 'react'
import './Home.css'
import rawAPIKey from '../../../api-key.txt'

export default function Home() {
  const [APIKey, setAPIKey] = useState('')
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

  return (
      <>
      <h1>Welcome to MovieRouter.com</h1>
      <div className="card">
        <button onClick={() => getLocation()}>Click to get your location</button>
      </div>
      {(
        userLocation.lat != 100  && <p> You are at {userLocation.lat}, {userLocation.long}</p> &&
        <iframe
          width="450"
          height="250"
          referrerPolicy="no-referrer-when-downgrade"
          src={'https://www.google.com/maps/embed/v1/place?key='+APIKey+'&q='+userLocation.lat+', '+userLocation.long}
        >
        </iframe>
      )}
      {(userLocation.error != "" && <p> {userLocation.error}</p>)}
      <p>
        Welcome welcome
      </p>
    </>
  )
}