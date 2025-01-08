import { useState } from "react";
import { db } from "../utils/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const useFeedbackSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = async ({ feedback, email }) => {
    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, "feedbacks"), {
        feedback,
        email,
        timestamp: new Date(),
      });
      console.log("Feedback saved with ID: ", docRef.id);
    } catch (e) {
      console.error("Error saving feedback: ", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitFeedback, loading, error };
};

export default useFeedbackSubmit;
