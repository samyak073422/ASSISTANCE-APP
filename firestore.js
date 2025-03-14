import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";

/**
 * Save user profile with role (User or Caretaker)
 * @param {string} userId
 * @param {object} userData
 */
export const saveUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), userData);
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile data
 * @param {string} userId
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new booking request
 * @param {object} bookingData
 */
export const createBooking = async (bookingData) => {
  try {
    const bookingRef = await addDoc(collection(db, "bookings"), bookingData);
    return bookingRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Update booking status (Accepted by Caretaker)
 * @param {string} bookingId
 * @param {string} caretakerId
 */
export const acceptBooking = async (bookingId, caretakerId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status: "Accepted", caretakerId });
  } catch (error) {
    throw error;
  }
};
