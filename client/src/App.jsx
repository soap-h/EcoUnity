import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import http from './http';


// pages
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import Learning from './pages/Learning.jsx';
import Merchandise from './pages/Merchandise.jsx';
import AdminPage from './pages/AdminPage.jsx';
import Reviews from './pages/ReviewPage.jsx'

import Navbar from './components/Navbar';


function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/events"} element={<Events />} />
                    {/* <Route path={"/forums"} element={<Forums />} /> */}
                    <Route path={"/learning"} element={<Learning />} />
                    <Route path={"/merchandise"} element={<Merchandise />} />
                    <Route path={"/adminpage"} element={<AdminPage />} />
                    <Route path={"/reviews"} element={<Reviews />} />
                    {/* <Route path={"/locations"} element={<Locations />} /> */}
                </Routes>
            </Router>
            {/* Other components */}
        </>
    );
}

export default App;
