/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#171B1D',
        darkgray: '#202426',
        bordergray: '#202227',
        lightgray: '#5B5E5F',
        blueish: '#48A6C3',
      },
    },
  },
  plugins: [],
};
