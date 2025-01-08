import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);

  if (isLoggedIn === null) {
    // Render a loading state until the authentication status is determined
    return <p>Loading...</p>;
  }

  return isLoggedIn ? children : <Navigate to="/affirmationspower/login" />;
};

export default PrivateRoute;
