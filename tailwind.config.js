/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', '"Barlow Condensed"', 'sans-serif'],
        condensed: ['"Barlow Condensed"', '"Bebas Neue"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7EE',
          200: '#F4F0E3',
          300: '#EDE7D4',
          400: '#E4DCBF',
        },
        card: '#F2EFE5',
        input: '#F5F1E6',
        lime: {
          400: '#C4FF00',
          500: '#B5FF00',
          600: '#9EE000',
        },
        brand: '#121212',
      }
    },
  },
  plugins: [],
}

