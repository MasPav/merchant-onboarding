/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    fontFamily: {'sans': ['Assistant', 'helvetica']},
    extend: {
      colors: {
        "primary": "#0A325E",
        "secondary": "#0F4988",
        "accent": "#1D78BC",
        "gold": "#d7a31a",
        "success": colors.emerald
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

