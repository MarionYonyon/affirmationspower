export const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };
  