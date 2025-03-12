import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase/firebaseConfig";
import { AFFIRMATION_LABELS } from "../utils/constants";

export const cleanUserCategories = async (userId) => {
  if (!userId) return;

  try {
    const userDocRef = doc(db, "users", userId, "settings", "preferences");
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const currentCategories = userData.selectedCategories || [];

      // 🔥 Remove categories that no longer exist in AFFIRMATION_LABELS
      const updatedCategories = currentCategories.filter(
        (category) => category in AFFIRMATION_LABELS
      );

      if (
        JSON.stringify(currentCategories) !== JSON.stringify(updatedCategories)
      ) {
        await updateDoc(userDocRef, { selectedCategories: updatedCategories });
        console.log("🔥 Old categories removed from Firestore!");
      } else {
        console.log("✅ No outdated categories found.");
      }
    }
  } catch (error) {
    console.error("❌ Error cleaning categories from Firestore:", error);
  }
};
