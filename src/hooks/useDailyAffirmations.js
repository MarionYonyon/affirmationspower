import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getCurrentDate } from "../utils/dateUtils";
import { AFFIRMATION_LABELS, JOBSTATUS_LABELS } from "../utils/constants";
import { auth, db } from "../components/firebaseConfig";

const useDailyAffirmations = () => {
  const [affirmations, setAffirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobStatus, setJobStatus] = useState(null); // Fetch jobStatus directly
  let isFetching = false; // Concurrency guard

  const fetchAndSaveAffirmations = async () => {
    if (isFetching) {
      console.warn("Fetch already in progress. Skipping this call."); // Log for case 6
      return; // Prevent concurrent calls
    }
    isFetching = true;

    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        console.error("No user logged in.");
        setLoading(false);
        return;
      }

      const currentDate = getCurrentDate();
      const userDocRef = doc(db, "users", user.uid);

      // Fetch the user's data
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Fetch jobStatus from userData
        if (!userData.jobStatus) {
          console.warn("Job status not found in user data. Aborting fetch.");
          setLoading(false);
          return;
        }
        setJobStatus(userData.jobStatus); // Update state with jobStatus

        // Ensure toggles are ready before proceeding
        if (!userData.affirmationsToggles) {
          console.warn("Affirmations toggles not ready. Aborting fetch.");
          setLoading(false);
          return;
        }

        // Check if affirmations for the current date already exist
        if (userData.dailyAffirmations?.[currentDate]) {
          setAffirmations(userData.dailyAffirmations[currentDate]);
          setLoading(false);
          return;
        }

        // Get the selected topics from `affirmationsToggles`
        const selectedTopics = Object.entries(
          userData.affirmationsToggles || {}
        )
          .filter(([_, isSelected]) => isSelected) // Keep only topics set to true
          .map(([topicKey]) => AFFIRMATION_LABELS[topicKey]); // Map to Firestore document names

        if (selectedTopics.length === 0) {
          console.warn(
            "No topics selected for affirmations. Returning empty array."
          );
          setAffirmations([]);
          setLoading(false);
          return;
        }

        // Debug logging
        console.log("Job status:", userData.jobStatus);
        console.log("Selected topics:", selectedTopics);

        // Fetch affirmations based on job status and toggled topics
        const affirmations = await fetchAffirmationsFromJobStatus(
          userData.jobStatus,
          selectedTopics
        );

        if (affirmations.length === 0) {
          console.warn("No affirmations fetched. Check Firestore data."); // Log for case 9
        }

        // Shuffle and select 20 affirmations
        const randomAffirmations = affirmations
          .sort(() => 0.5 - Math.random())
          .slice(0, 20);

        // Save affirmations for the day in Firestore
        try {
          await setDoc(
            userDocRef,
            {
              dailyAffirmations: {
                [currentDate]: randomAffirmations,
              },
            },
            { merge: true }
          );
          console.log("Affirmations for the day saved successfully.");
        } catch (error) {
          console.error("Error saving daily affirmations:", error); // Log for case 10
        }

        setAffirmations(randomAffirmations);
      } else {
        console.error("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching and saving daily affirmations:", error); // Log for case 9
    } finally {
      setLoading(false);
      isFetching = false; // Reset the guard
    }
  };

  const fetchAffirmationsFromJobStatus = async (jobStatus, topics) => {
    const affirmations = [];

    for (const topic of topics) {
      const topicDocRef = doc(
        db,
        `Topic/Career and Professional Growth/Job Status/${JOBSTATUS_LABELS[jobStatus]}/Practice`,
        topic
      );
      const topicDoc = await getDoc(topicDocRef);

      if (topicDoc.exists()) {
        const topicData = topicDoc.data();
        affirmations.push(...Object.values(topicData)); // Add all affirmations from the topic
      } else {
        console.warn(
          `Topic document ${topic} does not exist for jobStatus ${jobStatus}.` // Log for case 9
        );
      }
    }

    return affirmations;
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("User not logged in. Skipping useEffect."); // Log for case 2
      return; // Wait until user is set
    }

    const userDocRef = doc(db, "users", user.uid);

    // Subscribe to changes in the user's document
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.affirmationsToggles) {
          fetchAndSaveAffirmations();
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Removed jobStatus from dependency array

  return { affirmations, loading };
};

export default useDailyAffirmations;