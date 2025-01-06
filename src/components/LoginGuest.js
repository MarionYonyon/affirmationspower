import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebaseConfig";
import { signInAnonymously } from "firebase/auth";
import { initializeUserData } from "../utils/newUserCreation";
import LoginGuestIcon from "../images/LoginGuest.svg";

const LoginGuest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      await initializeUserData(user);
      navigate("/affirmationspower/parameters");
    } catch (err) {
      setError("Failed to log in anonymously. Please try again.");
      console.error("Anonymous login error: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button
        onClick={handleAnonymousLogin}
        disabled={loading}
        className="login-guest-button"
      >
        {loading ? "Entering..." : "Explore as Guest"}
        <img src={LoginGuestIcon} alt="login-guest-icon" />
      </button>
    </div>
  );
};

export default LoginGuest;