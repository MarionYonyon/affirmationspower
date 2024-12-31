import React, { createContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("UserProvider mounted");
    const user = auth.currentUser;

    if (!user) {
      console.warn("No user logged in, skipping Firestore subscription.");
      setLoading(false);
      return;
    }

    console.log("Subscribing to Firestore user document for user:", user.uid);
    const userDocRef = doc(db, "users", user.uid, "settings", "userSettings");
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Firestore document snapshot received:", docSnap.data());
        setUserData(docSnap.data());
      } else {
        console.warn("Firestore document does not exist.");
      }
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up Firestore subscription for user:", user.uid);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("UserProvider state updated: ", { userData, loading });
  }, [userData, loading]);

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
};
