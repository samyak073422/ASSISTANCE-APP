import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp, onSnapshot, doc, getDoc, deleteDoc } from "firebase/firestore";


function UserDashboard() {
  
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState("Daily Assistance");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      checkProfileCompletion(user.uid);
      fetchUserBookings(user.uid);
    } else {
      navigate("/login");
    }
  }, []);

  const checkProfileCompletion = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists() || !userSnap.data().name) {
      navigate("/profile");
    }
  };

  const fetchUserBookings = (userId) => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const userBookings = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((booking) => booking.userId === userId);

      setBookings(userBookings);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return;
  
      // Fetch user profile details
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        alert("User profile not found. Please complete your profile.");
        navigate("/profile");
        return;
      }
  
      const userData = userSnap.data();
  
      // Add booking with user profile details
      await addDoc(collection(db, "bookings"), {
        serviceType,
        date,
        time,
        status: "Pending",
        createdAt: Timestamp.now(),
        userId: user.uid,
        userName: userData.name, // Attach user's name
        userPhone: userData.phone, // Attach user's phone (if available)
        userDetails: userData.details || "", // Any additional user info
      });
  
      alert("Booking Request Sent!");
      setDate("");
      setTime("");
    } catch (error) {
      alert("Error booking service: " + error.message);
    }
  };
  
 
  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await deleteDoc(doc(db, "bookings", id));
        alert("Booking Cancelled Successfully!");
      } catch (error) {
        alert("Error cancelling booking: " + error.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Dashboard</h2>
      
      <button style={styles.profileButton} onClick={() => navigate("/profile")}>
        Go to Profile
      </button>

      <h3 style={styles.subHeader}>Book Assistance</h3>
      <form onSubmit={handleBooking} style={styles.form}>
  <label htmlFor="serviceType" style={styles.label}>Select Service:</label>
  <select
    id="serviceType"
    value={serviceType}
    onChange={(e) => setServiceType(e.target.value)}
    style={styles.select}
    required
  >
    <option value="" disabled>Select a Service</option>
    <option value="Daily Assistance">Daily Assistance</option>
    <option value="Medical Support">Medical Support</option>
    <option value="Physiotherapy">Physiotherapy</option>
    <option value="Mobility Assistance">Mobility Assistance</option>
    <option value="Personal Care">Personal Care</option>
    <option value="Meal Preparation">Meal Preparation</option>
    <option value="Companionship">Companionship</option>
    <option value="Household Chores">Household Chores</option>
    <option value="Cognitive Support">Cognitive Support</option>
  </select>

  <label htmlFor="date" style={styles.label}>Select Date:</label>
  <input
    id="date"
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // Prevent past dates
    required
    style={styles.input}
  />

  <label htmlFor="time" style={styles.label}>Select Time:</label>
  <input
    id="time"
    type="time"
    value={time}
    onChange={(e) => setTime(e.target.value)}
    required
    style={styles.input}
  />

  <button 
    type="submit" 
    style={styles.bookButton} 
    disabled={!serviceType || !date || !time} // Prevent empty submissions
  >
    Book Assistance
  </button>
</form>


      <h3 style={styles.subHeader}>Your Live Bookings</h3>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul style={styles.list}>
          {bookings.map((booking) => (
  <li key={booking.id} style={styles.bookingCard}>
    <p><strong>Service:</strong> {booking.serviceType}</p>
    <p><strong>Date:</strong> {booking.date} <strong>Time:</strong> {booking.time}</p>
    <p style={{ ...styles.status, ...statusColors[booking.status] }}>
      <strong>Status:</strong> {booking.status}
    </p>

    {/* Show Caretaker Details When Accepted */}
    {booking.status === "Accepted" && (
  <>
    <p><strong>Assigned Caretaker:</strong> {booking.caretakerName}</p>
    <button
      style={styles.chatButton}
      onClick={() => navigate(`/chat/${booking.id}`)}
    >
      Chat with {booking.caretakerName}
    </button>
  </>
)}


    {booking.status === "Pending" && (
      <button style={styles.cancelButton} onClick={() => handleDeleteBooking(booking.id)}>
        Cancel Booking
      </button>
    )}
  </li>
))}

            
        </ul>
      )}
    </div>
  );
}

// Updated Colors & Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
    backgroundColor: "#1E293B", // Dark Blue Gray
    color: "#E2E8F0", // Light Gray
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  header: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#38BDF8", // Light Blue
  },
  subHeader: {
    fontSize: "18px",
    marginTop: "10px",
    color: "#93C5FD", // Sky Blue
  },
  profileButton: {
    backgroundColor: "#3B82F6", // Blue
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "15px",
    transition: "0.3s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  select: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #93C5FD",
    backgroundColor: "#1E293B",
    color: "#E2E8F0",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #93C5FD",
    backgroundColor: "#1E293B",
    color: "#E2E8F0",
  },
  bookButton: {
    backgroundColor: "#22D3EE", // Teal
    color: "#1E293B",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  bookingCard: {
    background: "#334155", // Dark Gray Blue
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
    textAlign: "left",
  },
  status: {
    fontSize: "14px",
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: "5px",
    display: "inline-block",
    marginTop: "5px",
  },
  cancelButton: {
    backgroundColor: "#F87171", // Red
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },
  chatButton: {
    backgroundColor: "#22C55E", // Green
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.3s",
  },
  
};
// Status Colors
const statusColors = {
  Pending: { backgroundColor: "#FBBF24", color: "#1E293B" }, // Yellow
  Accepted: { backgroundColor: "#34D399", color: "#1E293B" }, // Green
  Completed: { backgroundColor: "#6366F1", color: "white" }, // Purple
};
export default UserDashboard;
