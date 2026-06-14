/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f5',
          100: '#e5ebe6',
          200: '#cbdad1',
          300: '#a3c0b1',
          400: '#759e89',
          500: '#527f68',
          600: '#3f6551',
          700: '#325041',
          800: '#2a4135',
          900: '#22362c',
          950: '#13201a',
        },
        cream: {
          50: '#faf9f6',
          100: '#f3f0e8',
          200: '#e5dfcf',
          300: '#d1c6aa',
          400: '#baa681',
          500: '#a5895f',
          600: '#947650',
          700: '#7b5e41',
          800: '#654c37',
          900: '#533f30',
          950: '#2c2018',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

