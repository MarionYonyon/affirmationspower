// LoginPage.js
import React from "react";
import "../styles/LoginPage.css";
import "../styles/Buttons.css";
import LoginAccessButton from "./LoginAccessButton";
import LoginGuest from "./LoginGuest";
import Signup from "./SignupAccessButton";
import useAuthState from "../hooks/useAuthState";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { isLoggedIn } = useAuthState();
  const navigate = useNavigate();
  if (isLoggedIn) {
    navigate("/practice");
  }
  return (
    <div className="login-container">
      <h2>
        Elevate Your <span className="accent">Career Mindset</span>
      </h2>
      <h3>
        Transform your career journey with positive affirmations and breathwork
      </h3>
      <div className="login-container2">
        <LoginAccessButton />
        <Signup />
        <LoginGuest />
      </div>
    </div>
  );
};

export default LoginPage;
