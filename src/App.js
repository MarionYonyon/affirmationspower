import "./styles/App.css";
import SettingsPage from "./components/pages/SettingsPage";
import ParametersPage from "./components/pages/ParametersPage";
import CredentialsPage from "./components/pages/CredentialsPage"; // Import CredentialsPage component
import SignupPage from "./components/pages/SignupPage.js";
import LoginPage from "./components/pages/LoginPage";
import TestingComponent from "./components/pages/TestingComponentPage.jsx";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./utils/firebaseConfig.js"; // Import initialized auth from firebaseConfig
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged from Firebase auth
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute component
import QuoteArea from "./components/QuoteArea";
import GoalBar from "./components/GoalBar";
import useGoalAndProgress from "./hooks/useGoalAndProgress";
import BreathworkAnchor from "./components/BreathworkAnchor";
import SoundAnchor from "./components/SoundAnchor";
import TimeTracker from "./utils/TimeTracker.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null to wait for auth check

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return <p>Loading...</p>; // Display a loading state while checking auth status
  }

  return (
    <Router basename="/affirmationspower">
      <div className="app-container">
        {isLoggedIn && <TimeTracker />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/credentials" element={<CredentialsPage />} />
          <Route path="/login/sign-up" element={<SignupPage />} />
          <Route path="/login/testing" element={<TestingComponent />} />
          <Route
            path="/"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/parameters"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ParametersPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const { dailyGoal, progress, setProgress } = useGoalAndProgress(); // Use the custom hook

  return (
    <div className="App">
        <div className="progress-bar-wrapper">
          <GoalBar progress={progress} dailyGoal={dailyGoal} />
        </div>
      <div className="border-wrapper">
        {/* <video
          src={`${process.env.PUBLIC_URL}/background2.mp4`}
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video> */}
        <div className="quote-area-wrapper">
          <QuoteArea progress={progress} setProgress={setProgress} />
          <div className="toggle-onoff-wrapper">
            <BreathworkAnchor/>
            <SoundAnchor/>
          </div>
        </div>
      </div>
      <div className="nav-bar-wrapper">
        <NavBar />
      </div>
    </div>
  );
}

export default App;
