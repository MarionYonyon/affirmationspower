import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);

  if (isLoggedIn === null) {
    // Render a loading state until authentication status is determined
    return <p>Loading...</p>;
  }
  console.log("PrivateRoute: isLoggedIn =", isLoggedIn);

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If logged in, render the protected route
  return children;
};

export default PrivateRoute;
