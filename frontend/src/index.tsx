import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import './index.css'

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Genres from './pages/Genres';
import Theaters from './pages/Theaters';
import Recommended from './pages/Recommended';
import Search from './pages/Search';
import About from './pages/About';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="Genres" element={<Genres />} />
        <Route path="Recommended" element={<Recommended />} />
        <Route path="Theaters" element={<Theaters />} />
        <Route path="Search" element={<Search />} />
        <Route path="About" element={<About />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
