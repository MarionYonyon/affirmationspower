import "../styles/NavBar.css";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import navHomeGrey from "../images/navHomeGrey.svg";
import navLanguageGrey from "../images/navLanguageGrey.svg";
import navProGrey from "../images/navProGrey.svg";
import navMetricsGrey from "../images/navMetricsGrey.svg";
import navSettingsGrey from "../images/navSettingsGrey.svg";

const NavBar = () => {
  const location = useLocation(); // Get the current route path

  return (
    <nav className="nav-bar">
      <Link to="/" className={`nav-button ${location.pathname === "/" ? "active" : ""}`}>
        <img src={navHomeGrey} alt="Home" />
        <span className="nav-home-text">Home</span>
      </Link>
      <button className="nav-button">
        <img src={navLanguageGrey} alt="Language" />
        <span className="nav-language-text">Language</span>
      </button>
      <button className="nav-button">
        <img src={navProGrey} alt="Get Pro" />
        <span className="nav-pro-text">Get Pro</span>
      </button>
      <button className="nav-button">
        <img src={navMetricsGrey} alt="Metrics" />
        <span className="nav-metrics-text">Metrics</span>
      </button>
      <Link to="/settings" className={`nav-button ${location.pathname === "/settings" ? "active" : ""}`}>
        <img src={navSettingsGrey} alt="Settings" />
        <span className="nav-settings-text">Settings</span>
      </Link>
    </nav>
  );
};

export default NavBar;