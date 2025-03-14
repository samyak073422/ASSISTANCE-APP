import React, { useState } from "react";
import BookingConfirmation from "./BookingConfirmation"; // Import component

const ConfirmBooking = () => {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [serviceType, setServiceType] = useState("");

  const handleConfirmBooking = () => {
    if (!bookingDate || !bookingTime || !serviceType) {
      alert("Please fill all details.");
      return;
    }
    alert("Booking Confirmed! ✅ Sending WhatsApp confirmation...");
  };

  return (
    <div>
      <h2>Confirm Your Booking</h2>
      
      <label>Select Date:</label>
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
      />

      <label>Select Time:</label>
      <input
        type="time"
        value={bookingTime}
        onChange={(e) => setBookingTime(e.target.value)}
      />

      <label>Select Service Type:</label>
      <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
        <option value="">Choose Service</option>
        <option value="Personal Assistance">Personal Assistance</option>
        <option value="Medical Support">Medical Support</option>
        <option value="Daily Task Help">Daily Task Help</option>
      </select>

      <button onClick={handleConfirmBooking}>Confirm Booking</button>

      {/* WhatsApp Confirmation Button */}
      {bookingDate && bookingTime && serviceType && (
        <BookingConfirmation
          bookingDate={bookingDate}
          bookingTime={bookingTime}
          serviceType={serviceType}
        />
      )}
    </div>
  );
};

export default ConfirmBooking;
