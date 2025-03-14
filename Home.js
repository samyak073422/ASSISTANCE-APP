import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="background-animation"></div>
      <div className="content">
        <h1>Welcome to Assistance App</h1>
        <h3>Your personal assistant for daily needs.</h3>
        <div className="buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="login-btn" onClick={() => navigate("/login")}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
