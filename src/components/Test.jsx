import React from "react";
import "../styles/Test.css";

function Test() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">App name</h1>
        <h2 className="headline">Elevate Your Job Search Mindset</h2>
        <p className="subtext">
          Transform your job search journey with positive affirmations, mindful
          breathing, and powerful visualizations.
        </p>
      </header>
      <div className="buttonss">
        <button className="btn sign-up">Sign Up <span className="icon">➕</span></button>
        <button className="btn login">Login <span className="icon">➡️</span></button>
        <button className="btn explore-guest">Explore as Guest <span className="icon">🚪</span></button>
      </div>
    </div>
  );
}

export default Test;