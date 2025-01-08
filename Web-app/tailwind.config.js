/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#d4502c',
      },
      fontFamily: {
        sans: ['Crimson Text', 'serif'],
      },
    },
  },
  plugins: [],
};