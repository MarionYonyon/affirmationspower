import React from 'react';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to the login page after logging out
    } catch (error) {
      console.error("Logout error:", error.message); // Log error for debugging
    }
  };

  return (
    <button onClick={handleLogout} aria-label="Log Out">
      Log Out
    </button>
  );
};

export default Logout;
