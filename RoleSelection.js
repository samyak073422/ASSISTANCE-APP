import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoleSelection.css"; 

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-container">
      <h2>Choose Your Role</h2>
      <p>Select whether you are a user or a caregiver.</p>
      <div className="buttons">
        <button onClick={() => navigate("/user-dashboard")}>I am a User</button>
        <button onClick={() => navigate("/assistant-dashboard")}>I am a Caregiver</button>
      </div>
    </div>
  );
};

export default RoleSelection; 
