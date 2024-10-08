import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import http from "./http";
import ProtectedRoute from "./components/ProtectedRoute";

// pages
import Home from "./pages/Home.jsx";
import Locations from "./pages/Locations.jsx"
import Events from "./pages/Events.jsx";
import EventRegistration from './pages/EventRegistration';
import EventPayment from './pages/EventPayment';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import ProposeEvent from './pages/ProposeEvent';
import UserContext from "./contexts/UserContext";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminEvents from "./pages/AdminEvents.jsx";
import DebugAdminCheck from "./components/DebugAdminCheck.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { Dialog } from "@mui/material";
// import { Chatbot } from './components/Chatbot';

import Learning from "./pages/Learning.jsx";
import Lesson from "./pages/Lesson.jsx"
import Slides from "./pages/Slides.jsx";
import Quiz from "./pages/Quiz.jsx";
import CorrectAnswers from "./pages/CorrectAnswers.jsx"
import QuizResults from "./pages/QuizResults.jsx";

import Merchandise from "./pages/Merchandise.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import TrackerDashboard from "./pages/TrackerDashboard.jsx";
import Reviews from "./pages/ReviewPage.jsx";

import Navbar from "./components/Navbar";

import { CartProvider } from './contexts/CartContext'; // Ensure correct import path
import Cart from './pages/Cart.jsx'
import Payment from './pages/Payment.jsx'
import CartLayout from './components/CartLayout.jsx'; // Import the CartLayout component
import ProductPage from './pages/ProductPage.jsx';
import OrderConfirm from './pages/OrderConfirm.jsx'

import AddLesson from './pages/AddLesson.jsx';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


import Trackers from "./pages/Tracker";
import CreateActivity from "./pages/CreateActivity";
import EditActivity from "./pages/EditActivity";
import Activities from "./pages/AllActivites";
import AddActivity from "./pages/AddActivity";
import Profile from "./pages/Profile.jsx";


import AddInboxMessage from "./pages/AddInboxMessage.jsx";
import Inbox from "./pages/Inbox.jsx"
import FixedButton from "./components/IncidentReportLink.jsx";

// Forum/Thread Pages
import Forum from './pages/Forum/Forum';
import AddThread from './pages/Forum/AddThread';
import ForumByCategory from './pages/Forum/ForumByCategory';
import EditThread from './pages/Forum/EditThread';
import SavedThreads from './pages/Forum/SavedThreads';
import UserThreads from './pages/Forum/UserThreads';
import ForumTrending from './pages/Forum/ForumTrending';
import ReportThreadAdmin from "./pages/Forum/ReportThreadAdmin.jsx";
// End of Forum/Thread Pages


// context
import GuestProfile from "./pages/GuestProfile.jsx"

const stripePromise = loadStripe('pk_test_51PibywRwqbBNo0bk0Y04vn93VZZoeNxfBZzlbLy8KVwfvEAi0OnxZPtCfhbbjCG2rjVuJ0Wcg4cznTAE22QPP4Zo00WRmChZjd');


import AddFeedback from './pages/AddFeedbackPage';
import AddIncidentReport from './pages/AddIncidentReport';
import IncidentReportingUsers from './pages/IncidentReportingAdmin';
import IndividualReport from "./pages/IndividualReport";
import FeedbackAdmin from "./pages/FeedbackAdmin";
import IndividualFeedback from "./pages/IndividualFeedback";
import PurchaseHistory from "./pages/PurchaseHistory.jsx";
import PrivateThreads from "./pages/Forum/PrivateThreads.jsx";
function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
          
        }).catch(() => {
          localStorage.clear();
        }).finally(() => {
          setIsLoading(false); // Set loading to false after the request completes
        });
    } else {
      setIsLoading(false); // Set loading to false if no token is found
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator while fetching user data
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>

      <Router>
        <Navbar setOpenLogin={setOpenLogin} setOpenRegister={setOpenRegister} />
        <Routes>
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />

          <Route path={"/"} element={<Home />} />

          <Route path={"/locations"} element={<Locations />} />

          <Route path={"/events"} element={<Events />} />
          <Route path="/event/:id" element={<EventRegistration />} />
          <Route path="/propose-event" element={<ProposeEvent />} />
          <Route path="/event-payment/:id" element={<EventPayment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={<ProtectedRoute element={AdminDashboard} />} />
          <Route path="/admin/events" element={<ProtectedRoute element={AdminEvents} />} />
          <Route path="/debug-admin-check" element={<DebugAdminCheck />} />

          
          {/* <Route path={"/forums"} element={<Forums />} /> */}
          <Route path={"/learning"} element={<Learning />} />
          <Route path={"/learning/:id/*"} element={<Lesson/>} />
          {/* <Route path={"/learning/:id/slides/*"} element={<Slides/>}/>
          <Route path={"/learning/:id/quiz/*"} element={<Quiz/>}/> */}
          {/* <Route path={"/learning/:id/correctanswers/*"} element={<CorrectAnswers/>}/> */}


          <Route path={"/adminpage"} element={<AdminPage />} />
          <Route path={"/reviews/:productId"} element={<Reviews />} />
          
          <Route element={<CartLayout />}>
            <Route path={"/merchandise"} element={<Merchandise />} />
            <Route path={"/products/:id"} element={<ProductPage />} />
            <Route path={"/cart"} element={<Cart />} />
            <Route path={"/payment"} element={<Payment />} />
            <Route path={"/orderconfirm"} element={<OrderConfirm />} />
          </Route>

          <Route path={"/purchasehistory"} element={<PurchaseHistory/>}/>
          

          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          
          {/* <Route path={"/locations"} element={<Locations />} /> */}
          <Route path={"/tracker"} element={<Trackers />} />
          <Route path={"/addactivity"} element={<AddActivity />} />
          <Route path={"/editactivity/:id"} element={<EditActivity />} />
          <Route path={"/activities"} element={<Activities />} />
          <Route path={"/createactivity"} element={<CreateActivity />} />
          <Route path={"/profile/:id"} element={user ? <Profile /> : <Navigate to="/" />} />
          <Route path={"/guestprofile/:id"} element={<GuestProfile />} />
          <Route path={"/inbox"} element={<Inbox />} />
          <Route path={"/addinbox"} element={<AddInboxMessage />} />
          <Route path="/admin/manageusers" element={<ManageUsers />} />
          <Route path="/admin/trackerdashboard" element={<TrackerDashboard />} />
          <Route path={"/AddincidentReporting"} element={<AddIncidentReport />} />
          <Route path={"/addfeedback/:id"} element={<AddFeedback />} />
          <Route path={"/admin/IncidentReportAdmin"} element={<IncidentReportingUsers />} />
          <Route path={"/admin/IncidentReportAdmin/:id"} element={<IndividualReport />} />
          <Route path={"/admin/FeedbackAdmin"} element={<FeedbackAdmin />} />
          <Route path={"/admin/FeedbackAdmin/:id"} element={<IndividualFeedback />} />
          <Route path={"/admin/AddLesson"} element={<AddLesson />} />


          {/* Forum/Thread Routes */}
          <Route path={"/forum"} element={<Forum />} />
          <Route path={"/addthread"} element={<AddThread />} />
          <Route path={"/thread/:category"} element={<ForumByCategory />} />
          <Route path={"/editthread/:id"} element={<EditThread />} />
          <Route path={"/bookmarks"} element={<SavedThreads />} />
          <Route path={"/thread/user/:userId"} element={<UserThreads />} />
          <Route path={"/trending"} element={<ForumTrending />} />
          <Route path={"/privatethread"} element={<PrivateThreads/>}/>
          <Route path={"/admin/reportthread"} element={<ReportThreadAdmin />} />

        </Routes>
        <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
          <Login onClose={() => setOpenLogin(false)} />
        </Dialog>
        <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
          <Register onClose={() => setOpenRegister(false)} setOpenLogin={setOpenLogin} />
        </Dialog>
        <FixedButton />
        {/* <Chatbot /> */}
      </Router>


    </UserContext.Provider>
  );
}

export default App;
