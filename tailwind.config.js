module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Berkshire Swash", "cursive"],
        body: ["Happy Monkey", "cursive"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
