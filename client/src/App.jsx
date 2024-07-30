import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate  } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import http from "./http";

// pages
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Learning from "./pages/Learning.jsx";
import Merchandise from "./pages/Merchandise.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import Reviews from "./pages/ReviewPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Trackers from "./pages/Tracker";
import CreateActivity from "./pages/CreateActivity";
import EditActivity from "./pages/EditActivity";
import Activities from "./pages/AllActivites";
import AddActivity from "./pages/AddActivity";
import Profile from "./pages/Profile.jsx";
import Inbox from "./pages/Inbox.jsx"

// context

import UserContext from "./contexts/UserContext";

// components

import Navbar from "./components/Navbar";


function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      http.get("/user/auth", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        // Handle error, possibly by clearing token or redirecting to login
        localStorage.removeItem("accessToken");
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  return (
    <UserContext.Provider value={{ user, setUser }}>
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
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            {/* <Route path={"/locations"} element={<Locations />} /> */}
            <Route path={"/tracker"} element={<Trackers />} />
            <Route path={"/addactivity"} element={<AddActivity />} />
            <Route path={"/editactivity/:id"} element={<EditActivity />} />
            <Route path={"/activities"} element={<Activities />} />
            <Route path={"/createactivity"} element={<CreateActivity />} />
            <Route path={"/profile/:id"} element={user ? <Profile /> : <Navigate to="/login" />}/>
            <Route path={"/inbox"} element={<Inbox />} />
            
          </Routes>
        </Router>
        {/* Other components */}
      </>
    </UserContext.Provider>
  );
}

export default App;
