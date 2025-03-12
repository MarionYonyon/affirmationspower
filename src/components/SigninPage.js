import "../styles/SignupPage.css";
import "../styles/Buttons.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { initializeUserData } from "../utils/firebase/initializeUserData";
import LoginIconWhite from "../images/LoginWhite.svg";
import SignupBlack from "../images/SignupBlack.svg";
import useAuthState from "../hooks/useAuthState";

const SigninPage = () => {
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuthState();
  const navigate = useNavigate();
  if (isLoggedIn) {
    navigate("/read");
  }

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Set persistence to local by default
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await initializeUserData(user);
      localStorage.setItem("email", email);

      navigate("/read");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Login error: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        Welcome <span className="accent">back</span>
      </h1>
      <div className="divider-container">
        <hr className="divider" />
        <span className="or-text">Log in with your Email</span>
        <hr className="divider" />
      </div>
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <div className="password-wrapper">
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="password-wrapper">
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button
          type="submit"
          className="signup-access-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "LOGIN"}
          <img src={LoginIconWhite} alt="login-access-icon" />
        </button>
      </form>
      <button
        className="login-subtle-button"
        onClick={() => navigate("/login/sign-up")}
      >
        SIGN UP
        <img src={SignupBlack} alt="signup-access-icon" />
      </button>
    </div>
  );
};

export default SigninPage;
