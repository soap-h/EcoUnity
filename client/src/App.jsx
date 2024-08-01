import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import http from "./http";
// import ProtectedRoute from "./ProtectedRoute";

// pages
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Learning from "./pages/Learning.jsx";
import Merchandise from "./pages/Merchandise.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import Reviews from "./pages/ReviewPage.jsx";

import Navbar from "./components/Navbar";

import Trackers from "./pages/Tracker";
import CreateActivity from "./pages/CreateActivity";
import EditActivity from "./pages/EditActivity";
import Activities from "./pages/AllActivites";
import AddActivity from "./pages/AddActivity";
import Profile from "./pages/Profile.jsx";
import Inbox from "./pages/Inbox.jsx"

// Forum/Thread Pages
import Forum from './pages/Forum/Forum';
import AddThread from './pages/Forum/AddThread';
import ForumByCategory from './pages/Forum/ForumByCategory';
import EditThread from './pages/Forum/EditThread';
import SavedThreads from './pages/Forum/SavedThreads';
import UserThreads from './pages/Forum/UserThreads';
import ForumTrending from './pages/Forum/ForumTrending';
// End of Forum/Thread Pages

// context

import UserContext from "./contexts/UserContext";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Dialog } from "@mui/material";




function App() {
  const [user, setUser] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      http.get("/user/auth", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          setUser(res.data.user);

          if (res.data.user.isAdmin) {
            window.location = "/admin";
          }

        });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>

      <Router>
        <Navbar setOpenLogin={setOpenLogin} setOpenRegister={setOpenRegister} />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/events"} element={<Events />} />
          <Route path={"/learning"} element={<Learning />} />
          <Route path={"/adminpage"} element={<AdminPage />} />
          <Route path={"/merchandise"} element={<Merchandise />} />
          <Route path={"/reviews"} element={<Reviews />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          {/* <Route path={"/locations"} element={<Locations />} /> */}
          <Route path={"/tracker"} element={<Trackers />} />
          <Route path={"/addactivity"} element={<AddActivity />} />
          <Route path={"/editactivity/:id"} element={<EditActivity />} />
          <Route path={"/activities"} element={<Activities />} />
          <Route path={"/createactivity"} element={<CreateActivity />} />
          <Route path={"/profile/:id"} element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path={"/inbox"} element={<Inbox />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Forum/Thread Routes */}
          <Route path={"/forum"} element={<Forum />} />
          <Route path={"/addthread"} element={<AddThread />} />
          <Route path={"/thread/:category"} element={<ForumByCategory />} />
          <Route path={"/editthread/:id"} element={<EditThread />} />
          <Route path={"/bookmarks"} element={<SavedThreads />} />
          <Route path={"/thread/user/:userId"} element={<UserThreads />} />
          <Route path={"/trending"} element={<ForumTrending />} />

        </Routes>
        <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
          <Login onClose={() => setOpenLogin(false)} />
        </Dialog>
        <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
          <Register onClose={() => setOpenRegister(false)} setOpenLogin={setOpenLogin} />
        </Dialog>
      </Router>

    </UserContext.Provider>
  );
}

export default App;
