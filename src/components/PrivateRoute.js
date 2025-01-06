import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn, children }) => {
  useEffect(() => {
    console.log("PrivateRoute rendered: isLoggedIn =", isLoggedIn);
  });

  if (isLoggedIn === null) {
    console.log("PrivateRoute: Waiting for authentication state...");
    return <p>Loading...</p>;
  }

  console.log("PrivateRoute: User is", isLoggedIn ? "logged in" : "logged out");
  return isLoggedIn ? children : <Navigate to="/affirmationspower/login" replace />;
};

export default PrivateRoute;
