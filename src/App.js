import "./styles/App.css";
import Login from "./components/Login";
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SettingsPage from "./components/SettingsPage";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { auth } from "./components/firebaseConfig"; // Import initialized auth from firebaseConfig
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged from Firebase auth
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute component
import QuoteArea from "./components/QuoteArea";
import GoalBar from "./components/GoalBar";
import { getCurrentDate } from "./utils/dateUtils";
import { db } from "./components/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

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
    <Router>
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
  const [progress, setProgress] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(100); // Default to 100
  const location = useLocation();

  useEffect(() => {
    const fetchDailyGoalAndProgress = async () => {
      const user = auth.currentUser;
      if (user) {
        const currentDate = getCurrentDate();
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();

          // Update progress
          if (data.dailyProgress) {
            const dailyProgress = data.dailyProgress[currentDate];
            setProgress(dailyProgress || 0); // Use 0 if no entry for currentDate
          }

          // Update dailyGoal
          if (data.dailyGoal !== undefined) {
            setDailyGoal(data.dailyGoal); // Fetch and set dailyGoal
          }
        }
      }
    };

    fetchDailyGoalAndProgress();
  }, [location]); // Re-fetch when the route changes

  return (
    <div className="App">
      <div className="progress-bar-wrapper">
        <GoalBar progress={progress} dailyGoal={dailyGoal} />
      </div>
      <div className="quote-area-wrapper">
        <QuoteArea progress={progress} setProgress={setProgress} />
      </div>
      <div className="nav-bar-wrapper">
        <NavBar />
      </div>
    </div>
  );
}

export default App;