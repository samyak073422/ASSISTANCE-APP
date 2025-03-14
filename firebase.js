// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8lwE6lM3N16mCBZNFVsasUYvilqINZcc",
  authDomain: "assistance-app-64d87.firebaseapp.com",
  projectId: "assistance-app-64d87",
  storageBucket: "assistance-app-64d87.appspot.com",
  messagingSenderId: "745314533275",
  appId: "1:745314533275:web:22d65bcef5d90e1b732b3e",
  measurementId: "G-CMV2ZV0JWZ"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export authentication functions
export { 
  auth, 
  db, 
  storage, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
};
