import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const BookingConfirmation = ({ date, time, serviceType }) => {
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    fetchUserPhone();
  }, []);

  // Fetch user's phone number from Firestore
  const fetchUserPhone = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.phone) {
          setUserPhone(userData.phone);
        } else {
          console.warn("No phone number found for this user.");
        }
      }
    } catch (error) {
      console.error("Error fetching phone number:", error);
    }
  };

  // Generate WhatsApp message link
  const sendWhatsAppConfirmation = () => {
    if (!userPhone) {
      alert("Phone number not found. Please update your profile.");
      return;
    }

    const message = `📢 *Booking Confirmation* 📢
    
✅ *Service:* ${serviceType}  
📅 *Date:* ${date}  
⏰ *Time:* ${time}  

Your booking has been confirmed. Thank you for choosing our service! 🚀`;

    const whatsappLink = `https://wa.me/${userPhone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappLink, "_blank");
  };

  return (
    <div>
      <h2>Confirm Your Booking</h2>
      <button onClick={sendWhatsAppConfirmation}>Send WhatsApp Confirmation</button>
    </div>
  );
};

export default BookingConfirmation;
