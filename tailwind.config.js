/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#243c5a",
        maroon: {
          200: "#8C1645",
          400: "#6E002D",
          500: "#70002E",
          600: "#500020",
        },
      },
    },
  },
  plugins: [],
};
