import React from "react";
import { useNavigate } from "react-router-dom";
import LoginIconPurple from "../images/LoginPurple.svg";

const LoginAccessButton = () => {
  const navigate = useNavigate();

  return (
    <button className="login-access-button" onClick={() => navigate("/login/credentials")}>
      Login
      <img src={LoginIconPurple} alt="login-access-icon" />
    </button>
  );
};

export default LoginAccessButton;
