/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Using Inter as a modern sans-serif font
      },
      colors: {
        'brand-primary': '#00A9FF',
        'brand-secondary': '#CDF5FD',
        'brand-dark': '#003C5C',
        'brand-light': '#A0E9FF',
      }
    },
  },
  plugins: [],
}