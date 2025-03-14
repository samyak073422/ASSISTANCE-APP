import { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "../styles/Profile.css"

function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    disabilityDetails: "",
    age: "",
    gender: "",
    profilePic: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  // Fetch user profile data
  const fetchUserData = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Save profile data
  const saveProfile = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    let imageUrl = userData.profilePic;

    if (selectedFile) {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await uploadBytes(storageRef, selectedFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    try {
      await setDoc(userRef, {
        ...userData,
        profilePic: imageUrl,
      }, { merge: true }); 
      alert("Profile Updated Successfully! ✅");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-pic-container">
        <input type="file" id="file-upload" onChange={handleFileChange} />
        <label htmlFor="file-upload" className="file-upload-btn">Upload Profile Picture</label>
        {userData.profilePic && <img src={userData.profilePic} alt="Profile" className="profile-pic" />}
      </div>

      <input type="text" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} placeholder="Full Name" />
      <input type="text" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} placeholder="Phone Number" />
      <input type="text" value={userData.address} onChange={(e) => setUserData({ ...userData, address: e.target.value })} placeholder="Address" />
      <input type="text" value={userData.age} onChange={(e) => setUserData({ ...userData, age: e.target.value })} placeholder="Age" />
      <select value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <textarea value={userData.disabilityDetails} onChange={(e) => setUserData({ ...userData, disabilityDetails: e.target.value })} placeholder="Disability Details (if any)" />

      <input type="email" value={userData.email} disabled placeholder="Email (cannot be changed)" />

      <button className="save-btn" onClick={saveProfile}>Save Profile</button>
    </div>
  );
}

export default Profile;
