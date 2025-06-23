import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom"
import './index.css'

import Navbar from "./components/Navbar"
import NoLocation from "./components/NoLocation"
import { LocationProvider } from './components/LocationContext'

import Home from "./pages/Home"
import Genres from './pages/Genres'
import Theaters from './pages/Theaters'
import Recommended from './pages/Recommended'
import Search from './pages/Search'
import About from './pages/About'
import ErrorPage from './pages/ErrorPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navbar />}>
        <Route index element={<NoLocation target=""/>} />
        <Route path="genres" element={<NoLocation target="genres" />} />
        <Route path="recommended" element={<NoLocation target="recommended" />} />
        <Route path="theaters" element={<NoLocation target="theaters" />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="/:postalCode" element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="genres" element={<Genres />} />
        <Route path="recommended" element={<Recommended />} />
        <Route path="theaters" element={<Theaters />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationProvider>
      <RouterProvider router={router} />
    </LocationProvider>
  </StrictMode>,
)
