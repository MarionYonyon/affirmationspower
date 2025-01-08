import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

const useAuthState = () => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsLoggedIn(true);
        setInitialized(true);
      } else {
        setUserId(null);
        setIsLoggedIn(false);
        localStorage.clear();
        sessionStorage.clear();
      }
    });

    return () => unsubscribe();
  }, []);

  return { userId, isLoggedIn, initialized };
};

export default useAuthState;
