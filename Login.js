import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth, db } from "../firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Navbar";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("user"); // Default role is "user"
  const navigate = useNavigate();

  // 🔹 Handle User Sign Up
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in the correct Firestore collection based on role
      const userRef = doc(db, role === "caretaker" ? "caretakers" : "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email,
        role,
        createdAt: new Date(),
      });

      alert("Account Created Successfully!");
      navigate(role === "caretaker" ? "/Assistant-dashboard" : "/user-dashboard");
    } catch (error) {
      alert("Signup Error: " + error.message);
    }
  };

  // 🔹 Handle User Login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch user role from Firestore
      const userRef = doc(db, "users", user.uid);
      const caretakerRef = doc(db, "caretakers", user.uid);
  
      const userSnap = await getDoc(userRef);
      const caretakerSnap = await getDoc(caretakerRef);
  
      if (caretakerSnap.exists()) {
        navigate("/assistant-dashboard");
      } else if (userSnap.exists()) {
        navigate("/user-dashboard");
      } else {
        alert("User role not found. Please contact support.");
      }
    } catch (error) {
      alert("Login Error: " + error.message);
    }
  };
  

  // 🔹 Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged Out Successfully!");
    } catch (error) {
      alert("Logout Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Show Role Selection for Signup */}
      {isSignUp && (
        <div>
          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User (Book Assistance)</option>
            <option value="caretaker">Caretaker (Provide Assistance)</option>
          </select>
        </div>
      )}
      
      {isSignUp ? (
        <button onClick={handleSignUp}>Sign Up</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
      </button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Login;
