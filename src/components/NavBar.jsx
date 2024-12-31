import "../styles/NavBar.css";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import navPlayBlack from "../images/navPlayBlack.svg";
import navSettingsGrey from "../images/navSettingsGrey.svg";
import navHeartBlack from "../images/navHeartBlack.svg";

const NavBar = () => {
  const location = useLocation(); // Get the current route path

  return (
    <nav className="nav-bar">
      {/*<button className="nav-button">
        <img src={navHomeGrey} alt="Home" />
        <span className="nav-home-text">Home</span>
      </button>*/}
      <Link
        to="/parameters"
        className={`nav-button ${
          location.pathname === "/parameters" ? "active" : ""
        }`}
      >
        <img src={navHeartBlack} alt="Topics" />
        <span className="nav-affirmation-text">Topics</span>
      </Link>
      <Link
        to="/"
        className={`nav-button ${location.pathname === "/" ? "active" : ""}`}
      >
        <img src={navPlayBlack} alt="Practice" />
        <span className="nav-practice-text">Practice</span>
      </Link>
       {/*<button className="nav-button">
        <img src={navMetricsGrey} alt="Metrics" />
        <span className="nav-metrics-text">Metrics</span>
      </button>*/}
      <Link
        to="/settings"
        className={`nav-button ${
          location.pathname === "/settings" ? "active" : ""
        }`}
      >
        <img src={navSettingsGrey} alt="Settings" />
        <span className="nav-settings-text">Settings</span>
      </Link>
    </nav>
  );
};

export default NavBar;
