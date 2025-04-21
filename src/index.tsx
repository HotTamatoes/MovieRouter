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
import Theatres from './pages/Theatres';
import Recommended from './pages/Recommended';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        <Route path="Genres" element={<Genres />} />
        <Route path="Theatres" element={<Theatres />} />
        <Route path="Recommended" element={<Recommended />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
