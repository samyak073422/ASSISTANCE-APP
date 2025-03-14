import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);
    const navigate = useNavigate(); // Replace React Native navigation

    const handleSignUp = async () => {
        if (!role) {
            alert("Error: Please select a role before signing up.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, 'users', uid), { email, role });

            alert("Account created successfully!");
            navigate('/login'); // React Router navigation
        } catch (error) {
            alert("Signup Error: " + error.message);
        }
    };

    return (
        <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label>Select Role:</label>
            <button onClick={() => setRole('user')}>User</button>
            <button onClick={() => setRole('caretaker')}>Caretaker</button>

            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUp;
