import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import SettingsPage from "./components/SettingsPage";
import ParametersPage from "./components/ParametersPage";
import SigninPage from "./components/SigninPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import TestingComponent from "./components/TestingComponentPage";
import NavBar from "./components/NavBar";
import BreathworkAnchor from "./components/BreathworkAnchor";
import SoundAnchor from "./components/SoundAnchor";
import QuoteArea from "./components/QuoteArea";
import GoalBar from "./components/GoalBar";
import TimeTracker from "./utils/TimeTracker";
import PrivateRoute from "./components/PrivateRoute";
import useAffirmations from "./hooks/useAffirmations";
import useGoalAndProgress from "./hooks/useGoalAndProgress";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebaseConfig";
import ProgressPractice from "./components/ProgressPractice";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const {
    affirmations,
    currentAffirmation,
    nextAffirmation,
    loading: affirmationsLoading,
    userSettings,
    setUserSettings,
    jobStatus,
    setJobStatus,
    selectedCategories,
    setSelectedCategories,
    setTogglesChanged,
  } = useAffirmations(userId);

  const { dailyGoal, dailyProgress } = useGoalAndProgress();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        localStorage.clear();
        sessionStorage.clear();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCategoryChange = (newCategories) => {
    setSelectedCategories(newCategories);
    setTogglesChanged(true);
  };

  const handleJobStatusChange = (newStatus) => {
    setJobStatus(newStatus);
    setTogglesChanged(true);
  };

  if (isLoggedIn === null || affirmationsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <TimeTracker />}
        <Routes>
          <Route path="/affirmationspower/login" element={<LoginPage />} />
          <Route path="/affirmationspower/login/sign-in" element={<SigninPage />} />
          <Route path="/affirmationspower/login/sign-up" element={<SignupPage />} />
          <Route path="/affirmationspower/login/testing" element={<TestingComponent />} />
          <Route
            path="/affirmationspower/parameters"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ParametersPage
                  selectedCategories={selectedCategories}
                  handleCategoryChange={handleCategoryChange}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/affirmationspower/practice"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <div className="App">
                  <div className="progress-bar-wrapper">
                    <GoalBar progress={dailyProgress} dailyGoal={dailyGoal} />
                  </div>
                  <div className="border-wrapper">
                    <div className="quote-area-wrapper">
                      <QuoteArea currentAffirmation={currentAffirmation} />
                      <div className="toggle-onoff-wrapper">
                        <BreathworkAnchor />
                        <SoundAnchor />
                      </div>
                    </div>
                  </div>
                  <div className="nav-bar-wrapper">
                    <NavBar />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/affirmationspower/settings"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <SettingsPage
                  jobStatus={jobStatus}
                  setJobStatus={handleJobStatusChange}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
