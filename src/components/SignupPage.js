import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase/firebaseConfig";
import { initializeUserData } from "../utils/firebase/initializationUtils";
import GoogleIcon from "../images/GoogleIcon.svg";
import MicrosoftIcon from "../images/MicrosoftIcon.svg";
import "../styles/SignupPage.css";
import "../styles/Buttons.css";
import SignupWhite from "../images/SignupWhite.svg";
import LoginIconBlack from "../images/LoginBlack.svg";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // Initialize additional user data
      await initializeUserData(user);

      // Automatically log the user in
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to the home page
      navigate("/affirmationspower/onboarding");
    } catch (error) {
      setErrorMessage("Failed to sign up. Please try again.");
      console.error("SignUp error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        Create an <span className="accent">Account</span>
      </h1>
      <p className="subtitle">You are few moments away from getting started!</p>

      {/*
        <div className="social-signup-container">
        <button className="login-access-button social-button">
          <img src={GoogleIcon} alt="google-icon" />
          Sign Up with Google
        </button>
        <button className="login-access-button social-button">
          <img src={MicrosoftIcon} alt="microsoft-icon" />
          Sign Up with Microsoft
        </button>
      </div>*/}

      <div className="divider-container">
        <hr className="divider" />
        <span className="or-text">or continue with Email</span>
        <hr className="divider" />
      </div>
      <div className="input-container">
        <div className="password-wrapper">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="password-wrapper">
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordPopup(true)}
            onBlur={() => setShowPasswordPopup(false)}
          />
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button
        className="signup-access-button"
        onClick={handleSignUp}
        disabled={loading}
      >
        {loading ? "Loading..." : "SIGN UP"}
        <img src={SignupWhite} alt="signup-access-icon" />
      </button>
      <button
        className="login-subtle-button"
        onClick={() => navigate("/affirmationspower/login/sign-in")}
      >
        LOG IN
        <img src={LoginIconBlack} alt="login-access-icon" />
      </button>
    </div>
  );
};

export default SignUpPage;