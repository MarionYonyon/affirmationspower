import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css"; // Reintroduced
import SettingsPage from "./components/SettingsPage"; // Reintroduced
import ParametersPage from "./components/ParametersPage"; // Reintroduced
import SigninPage from "./components/SigninPage"; // Reintroduced
import SignupPage from "./components/SignupPage"; // Reintroduced
import LoginPage from "./components/LoginPage"; // Reintroduced
import TestingComponent from "./components/TestingComponentPage"; // Reintroduced
import NavBar from "./components/NavBar"; // Reintroduced
import BreathworkAnchor from "./components/BreathworkAnchor"; // Reintroduced
import SoundAnchor from "./components/SoundAnchor"; // Reintroduced
import QuoteArea from "./components/QuoteArea"; // Already present
import GoalBar from "./components/GoalBar"; // Reintroduced
import TimeTracker from "./utils/TimeTracker"; // Already present
import AppLayout from "./components/AppLayout"; // Already present
import PrivateRoute from "./components/PrivateRoute"; // Already present
import useAffirmations from "./hooks/useAffirmations"; // From NEW PROJECT
import useUserSettings from "./hooks/useUserSettings"; // From NEW PROJECT
import saveDailyAffirmations from "./components/saveDailyAffirmations"; // From NEW PROJECT
import useGoalAndProgress from "./hooks/useGoalAndProgress"; // Already present
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebaseConfig";
import ProgressPractice from "./components/ProgressPractice";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const { userSettings, setUserSettings, loading } = useUserSettings(userId);
  const {
    affirmations,
    currentAffirmation,
    currentIndex,
    setCurrentIndex,
    nextAffirmation,
    selectedCategories,
    setSelectedCategories,
    jobStatus,
    setJobStatus,
    setTogglesChanged,
  } = useAffirmations();
  const { dailyGoal, setDailyGoal, dailyProgress, incrementDailyProgress } =
    useGoalAndProgress();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoggedIn((prev) => (prev === null ? false : prev));
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      if (user) {
        console.log("User logged in:", user);
        setUserId(user.uid); // Set the userId from the logged-in user
        setIsLoggedIn(true);
      } else {
        console.log("No user logged in.");
        setIsLoggedIn(false);
        setUserId(null);
        localStorage.clear();
        sessionStorage.clear();
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const storedCategories = localStorage.getItem("selectedCategories");
    const storedJobStatus = localStorage.getItem("jobStatus");
    const storedIndex = localStorage.getItem("currentIndex");

    if (storedCategories) {
      setSelectedCategories(JSON.parse(storedCategories));
    }
    if (storedJobStatus) {
      setJobStatus(storedJobStatus);
    }
    if (storedIndex) {
      setCurrentIndex(parseInt(storedIndex, 10) || 0);
    }

    setInitialized(true);
  }, [setSelectedCategories, setJobStatus, setCurrentIndex]);

  useEffect(() => {
    if (!loading && userSettings && initialized) {
      if (!localStorage.getItem("selectedCategories")) {
        setSelectedCategories(userSettings.selectedCategories);
      }
      if (!localStorage.getItem("jobStatus")) {
        setJobStatus(userSettings.jobStatus);
      }
      if (!localStorage.getItem("currentIndex")) {
        setCurrentIndex(userSettings.currentIndex || 0); // Initialize currentIndex
      }
    }
  }, [loading, userSettings, initialized, setSelectedCategories, setJobStatus, setCurrentIndex]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (userId && affirmations.length > 0) {
      saveDailyAffirmations(userId, currentDate, affirmations)
        .then(() => console.log("Daily affirmations saved successfully!"))
        .catch((error) =>
          console.error("Error saving daily affirmations:", error)
        );
    }
  }, [jobStatus, selectedCategories, affirmations, userId]);

  const handleCategoryChange = (newCategories) => {
    if (newCategories.length === 0) {
      console.warn("At least one category must remain enabled.");
      return;
    }
    setSelectedCategories(newCategories);
    setUserSettings({ ...userSettings, selectedCategories: newCategories });
    setTogglesChanged(true);
  };

  const handleJobStatusChange = (newStatus) => {
    setJobStatus(newStatus);
    setUserSettings({ ...userSettings, jobStatus: newStatus });
    setTogglesChanged(true);
  };

  if (isLoggedIn === null) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <TimeTracker />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/sign-in" element={<SigninPage />} />
          <Route path="/login/sign-up" element={<SignupPage />} />
          <Route path="/login/testing" element={<TestingComponent />} />
          <Route
            path="/parameters"
            element={
              <ParametersPage
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
              />
            }
          />
          <Route
            path="/practice"
            element={
              <QuoteArea>
                <ProgressPractice
                  currentAffirmation={currentAffirmation}
                  nextAffirmation={nextAffirmation}
                  loading={loading}
                />
              </QuoteArea>
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                jobStatus={jobStatus}
                setJobStatus={handleJobStatusChange}
              />
            }
          />
          <Route
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

function Home() {
  const { dailyGoal, dailyProgress, incrementDailyProgress } =
    useGoalAndProgress();

  return (
    <div className="App">
      <div className="progress-bar-wrapper">
        <GoalBar progress={dailyProgress} dailyGoal={dailyGoal} />
      </div>
      <div className="border-wrapper">
        <div className="quote-area-wrapper">
          <QuoteArea />
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
  );
}

export default App;
