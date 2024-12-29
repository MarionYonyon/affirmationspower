import "../styles/Login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebaseConfig";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { initializeUserData } from "../utils/newUserCreation"; // Import the initialization function

const Login = () => {
  const [email, setEmail] = useState("example@example.com"); // Default email
  const [password, setPassword] = useState("password123"); // Default password
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Attempt to sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Call initialization for new user data setup
      const user = userCredential.user;
      await initializeUserData(user); // Ensure user has default parameters in Firestore

      // Redirect to main app page on success
      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Login error: ", err.message); // Log error for debugging
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Handle anonymous login logic
  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Sign in the user anonymously
      const userCredential = await signInAnonymously(auth);

      // Call initialization for new user data setup
      const user = userCredential.user;
      await initializeUserData(user); // Ensure user has default parameters in Firestore

      // Redirect to main app page on success
      navigate("/");
    } catch (err) {
      setError("Failed to log in anonymously. Please try again.");
      console.error("Anonymous login error: ", err.message); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Take a deep breath and dive into your career journey</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <hr />

      <button
        onClick={handleAnonymousLogin}
        disabled={loading}
        className="anonymous-login-btn"
      >
        {loading ? "Logging in anonymously..." : "Continue as Guest"}
      </button>
    </div>
  );
};

export default Login;
