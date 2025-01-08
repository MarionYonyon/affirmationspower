import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

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

  return (
    <AppContext.Provider value={{ userId, isLoggedIn, setUserId, setIsLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
};
