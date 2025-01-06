import React from "react";
import SignupWhite from "../images/SignupWhite.svg";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import "../styles/Buttons.css";

const SignupAccessButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="signup-access-button"
      onClick={() => navigate("/affirmationspower/login/sign-up")}
    >
      Sign Up
      <img src={SignupWhite} alt="signup-access-icon" />
    </button>
  );
};

export default SignupAccessButton;