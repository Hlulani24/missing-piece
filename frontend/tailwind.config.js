/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Missing Piece's actual brand marks: black/white graffiti wordmark with a
        // red crown accent, used across the logo, price list and hang tags.
        ink: "#0e0e0e",
        paper: "#f7f4ef",
        crimson: "#e11d2e",
        crimsonDark: "#a8111f",
        smoke: "#4a4a4a",
        line: "#232323",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
