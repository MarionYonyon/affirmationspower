import "./styles/App.css";
import Login from "./components/Login";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SettingsPage from "./components/SettingsPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./components/firebaseConfig"; // Import initialized auth from firebaseConfig
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged from Firebase auth
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute component
import QuoteArea from "./components/QuoteArea";
import GoalBar from "./components/GoalBar";
import useGoalAndProgress from "./hooks/useGoalAndProgress";
import BreathworkAnchor from "./components/BreathworkAnchor";
import SoundAnchor from "./components/SoundAnchor";

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
        <Routes>
          <Route path="/login" element={<Login />} />
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
      <div className="quote-area-wrapper">
        <QuoteArea progress={progress} setProgress={setProgress} />
        <div className="toggle-onoff-wrapper">
          <BreathworkAnchor></BreathworkAnchor>
          <SoundAnchor></SoundAnchor>
        </div>
      </div>
      <div className="nav-bar-wrapper">
        <NavBar />
      </div>
    </div>
  );
}

export default App;
