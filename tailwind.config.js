/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      animation: {
        riseFlame: "riseFlame linear infinite",
        flameBurst: "flameBurst 0.4s ease-out", // 💥 New
      },
      keyframes: {
        riseFlame: {
          "0%": {
            transform: "translateY(0) scale(1)",
            opacity: "0",
          },
          "10%": {
            opacity: "0.6",
          },
          "90%": {
            opacity: "0.6",
          },
          "100%": {
            transform: "translateY(-120vh) scale(0.7)",
            opacity: "0",
          },
        },
      },
      colors: {
        purple: {
          DEFAULT: "#673ab7",
          light: "#d8b9ff",
        },
        green: {
          DEFAULT: "#47c9af",
          light: "#b3e9c7",
        },
        black: {
          DEFAULT: "#333333",
          light: "#777777",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "18px",
      },
      boxShadow: {
        light: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
