/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#673ab7", // Default purple color
          light: "#d8b9ff", // Lighter purple
        },
        green: {
          DEFAULT: "#47c9af", // Default green
          light: "#b3e9c7", // Lighter green
        },
        black: {
          DEFAULT: "#333333", // Default black
          light: "#777777", // Lighter black
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "18px", // Custom larger border radius, similar to your block styles
      },
      boxShadow: {
        light: "0 1px 3px rgba(0, 0, 0, 0.1)", // Light box shadow for buttons
      },
    },
  },
};
