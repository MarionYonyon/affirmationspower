import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import SettingsPage from "./components/SettingsPage";
import ParametersPage from "./components/ParametersPage";
import SigninPage from "./components/SigninPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import AudioPlayer from "./components/Audiplayer/AudioPlayer";
import NavBar from "./components/NavBar";
import BreathworkAnchor from "./components/BreathworkAnchor";
import SoundAnchor from "./components/SoundAnchor";
import QuoteArea from "./components/QuoteArea";
import GoalBar from "./components/GoalBar";
import TimeTracker from "./utils/TimeTracker";
import PrivateRoute from "./components/PrivateRoute";
import { AppProvider, AppContext } from "./context/AppContext";
import { DEFAULT_USER_SETTINGS } from "./utils/constants";
import Onboarding from "./components/Onboarding";
import { Navigate } from "react-router-dom";
import TestingComponent from "./components/TestingComponent";

const AppContent = () => {
  const {
    initializing,
    affirmationsLoading,
    currentAffirmation,
    userSettings,
    handleCategoryChange,
    handleJobStatusChange,
  } = useContext(AppContext);

  // Log the state retrieved from the context

  if (initializing || affirmationsLoading) {
    return <p>Loading...</p>;
  }

  // Use default values from constants
  const selectedCategories =
    userSettings?.selectedCategories ||
    DEFAULT_USER_SETTINGS.selectedCategories;
  const jobStatus = userSettings?.jobStatus || DEFAULT_USER_SETTINGS.jobStatus;

  return (
    <Router basename="/">
      <div className="app-container">
        <TimeTracker />
        <Routes>
          {/* Default route: Redirect based on login status */}
          <Route
            path="/"
            element={
              userSettings?.isLoggedIn ? (
                <Navigate to="/read" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/sign-in" element={<SigninPage />} />
          <Route path="/login/sign-up" element={<SignupPage />} />
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <Onboarding />
              </PrivateRoute>
            }
          />
          <Route
            path="/testing"
            element={
              <PrivateRoute>
                <TestingComponent />
              </PrivateRoute>
            }
          />
          <Route
            path="/parameters"
            element={
              <PrivateRoute>
                <ParametersPage
                  selectedCategories={selectedCategories}
                  handleCategoryChange={handleCategoryChange}
                />
                <NavBar />
              </PrivateRoute>
            }
          />
          <Route
            path="/read"
            element={
              <PrivateRoute>
                <div className="App">
                  <div className="progress-bar-wrapper">
                    <GoalBar />
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
                  <NavBar />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/listen"
            element={
              <PrivateRoute>
                <AudioPlayer />
                <TestingComponent />
                <NavBar />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage
                  jobStatus={jobStatus}
                  setJobStatus={handleJobStatusChange}
                />
                <NavBar />
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
