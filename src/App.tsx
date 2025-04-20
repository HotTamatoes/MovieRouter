import { useState } from 'react'
import logo from './assets/Logo.png'
import './App.css'
import { API_KEY } from './api-key'

export default function App() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 100,
    longitude: 200
  });
  const [userLocationError, setUserLocationError] = useState("");

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      setUserLocationError("Geolocation is not supported by this browser.");
    }
  }
  
  function success(position: GeolocationPosition) {
    const {latitude, longitude} = position.coords;
    setUserLocation({ latitude, longitude });
  }
  
  function error() {
    setUserLocationError("Unable to retrieve your location");
  }
  return (
      <>
      <div className="headbar">
        <div className="logobox">
          <a href="#">
            <img src={logo} className="logo" alt="MovieRouterLogo" />
          </a>
          <h1 className="caveat">Movie Router</h1>
        </div>
        <div className="navbar">
          <a href="#home">Home</a>
          <a href="#genres">Genres</a>
          <a href="#theatres">Theatres</a>
          <a href="#rec">Recommended</a>
        </div>
        <input type="text" placeholder="Search.."/>
      </div>
      <h1>Welcome to MovieRouter.com</h1>
      <div className="card">
        <button onClick={() => getUserLocation()}>Click to get your location</button>
      </div>
      {(
        userLocation.latitude != 100  && <p> You are at {userLocation.latitude}, {userLocation.longitude}</p> &&
        <iframe
          width="450"
          height="250"
          referrerPolicy="no-referrer-when-downgrade"
          src={'https://www.google.com/maps/embed/v1/place?key='+API_KEY+'&q='+userLocation.latitude+', '+userLocation.longitude}
          //</>src={'https://www.google.com/maps/embed/v1/place?key='+API_KEY+'&q=Eiffel+Tower,Paris+France'}>
        >
        </iframe>
      )}
      {(userLocationError != "" && <p> {userLocationError}</p>)}
      <p>
        Welcome welcome
      </p>
    </>
  )
}