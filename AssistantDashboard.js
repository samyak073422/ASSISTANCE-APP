import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AssistantDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      checkProfileCompletion(user.uid);
    } else {
      navigate("/login"); // Redirect if not logged in
    }
  }, []);

  const checkProfileCompletion = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists() || !userSnap.data().name) {
      navigate("/profile"); // Redirect to profile if details are missing
    }
  };

  // Fetch live bookings
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(fetchedBookings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Accept Booking and send WhatsApp message
  const acceptBooking = async (id) => {
    if (window.confirm("Are you sure you want to accept this booking?")) {
      try {
        const user = auth.currentUser; // Get logged-in assistant
        const caretakerName = user.displayName || "Unnamed Caretaker";
        
        await updateDoc(doc(db, "bookings", id), { 
          status: "Accepted",
          caretakerId: user.uid,
          caretakerName: caretakerName
        });

        // Fetch updated booking details
        const bookingRef = doc(db, "bookings", id);
        const bookingSnap = await getDoc(bookingRef);
        if (bookingSnap.exists()) {
          sendWhatsAppConfirmation(bookingSnap.data(), caretakerName);
        }

        alert("Booking accepted successfully!");
      } catch (error) {
        alert("Error accepting booking: " + error.message);
      }
    }
  };

  // Generate WhatsApp message link
  const sendWhatsAppConfirmation = (booking, caretakerName) => {
    const { userPhone, date, time, serviceType } = booking;

    if (!userPhone) {
      alert("User's phone number is missing.");
      return;
    }

    const message = `📢 *Booking Confirmed by Caretaker* 📢
    
✅ *Service:* ${serviceType}  
📅 *Date:* ${date}  
⏰ *Time:* ${time}  
👨‍⚕️ *Caretaker:* ${caretakerName}  

Your booking has been confirmed by your assigned caretaker. Thank you for using our service! 🚀`;

    const whatsappLink = `https://wa.me/${userPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappLink, "_blank");
  };

  // Complete Booking
  const completeBooking = async (id) => {
    if (window.confirm("Are you sure you want to mark this booking as completed?")) {
      try {
        await updateDoc(doc(db, "bookings", id), { status: "Completed" });
        alert("Booking completed successfully!");
      } catch (error) {
        alert("Error completing booking: " + error.message);
      }
    }
  };

  // Delete Booking
  const deleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "bookings", id));
        alert("Booking deleted successfully!");
      } catch (error) {
        alert("Error deleting booking: " + error.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Assistant Dashboard</h2>
      
      <button style={styles.profileButton} onClick={() => navigate("/profile")}>
        Go to Profile
      </button>

      <h3 style={styles.subHeader}>Available Bookings</h3>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings available</p>
      ) : (
        <ul style={styles.list}>
          {bookings.map((booking) => (
            <li key={booking.id} style={styles.bookingCard}>
              <p><strong>Service:</strong> {booking.serviceType}</p>
              <p><strong>Date:</strong> {booking.date} <strong>Time:</strong> {booking.time}</p>
              <p><strong>User:</strong> {booking.userName || "N/A"}</p>
              <p><strong>Phone:</strong> {booking.userPhone || "N/A"}</p>
              <p><strong>Details:</strong> {booking.userDetails || "No additional details"}</p>
              

              <div style={styles.buttonContainer}>
                {booking.status === "Pending" && (
                  <button style={styles.acceptButton} onClick={() => acceptBooking(booking.id)}>
                    Accept
                  </button>
                )}
                {booking.status === "Accepted" && (
                  <button style={styles.completeButton} onClick={() => completeBooking(booking.id)}>
                    Complete
                  </button>
                )}
                <button style={styles.deleteButton} onClick={() => deleteBooking(booking.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    color: "#333",
  },
  subHeader: {
    fontSize: "18px",
    marginTop: "10px",
    color: "#555",
  },
  profileButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "15px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  bookingCard: {
    background: "#f9f9",
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
  buttonContainer: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  completeButton: {
    backgroundColor: "#ffc107",
    color: "black",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default AssistantDashboard;
