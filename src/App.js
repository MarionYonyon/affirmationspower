import React, { useContext } from "react";
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
import useGoalAndProgress from "./hooks/useGoalAndProgress";
import { AppProvider, AppContext } from "./context/AppContext";

const AppContent = () => {
  const {
    currentAffirmation,
    affirmationsLoading,
    userSettings,
    handleCategoryChange,
    handleJobStatusChange,
  } = useContext(AppContext);

  const { dailyGoal, dailyProgress } = useGoalAndProgress();

  if (affirmationsLoading) {
    return <p>Loading...</p>;
  }

    // Default values for userSettings properties if they are undefined
    const selectedCategories = userSettings?.selectedCategories || [];
    const jobStatus = userSettings?.jobStatus || "";
  

  return (
    <Router>
      <div className="app-container">
        <TimeTracker />
        <Routes>
          <Route path="/affirmationspower/login" element={<LoginPage />} />
          <Route
            path="/affirmationspower/login/sign-in"
            element={<SigninPage />}
          />
          <Route
            path="/affirmationspower/login/sign-up"
            element={<SignupPage />}
          />
          <Route
            path="/affirmationspower/login/testing"
            element={<TestingComponent />}
          />
          <Route
            path="/affirmationspower/parameters"
            element={
              <PrivateRoute>
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
              <PrivateRoute>
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
              <PrivateRoute>
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

const App = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;