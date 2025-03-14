import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import UserDashboard from "./pages/UserDashboard";
import AssistantDashboard from "./pages/AssistantDashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./pages/Navbar";
import BookingConfirmation from "./pages/BookingConfirmation";
import Chat from "../src/pages/Chat";
import "./App.css";


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* ✅ Navbar persists on all pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/assistant-dashboard" element={<AssistantDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/chat/:bookingId" element={<Chat />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
