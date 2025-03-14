import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged Out Successfully!");
      navigate("/login");
    } catch (error) {
      alert("Logout Error: " + error.message);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>MyWebsite</Link>
      </div>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/profile" style={styles.link}>Profile</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
        <li><button style={styles.logoutBtn} onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    padding: "0px 10px",
    height: "40px",
  },
  logo: {
    fontSize: "12px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "5px",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  link: {
    color: "blue",
    textDecoration: "none",
    fontSize: "15px",
    padding: "2px 5px",
  },
  logoutBtn: {
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    padding: "2px 6px",
    cursor: "pointer",
    fontSize: "10px",
    height: "18px",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Navbar;
