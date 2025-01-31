/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
      },
      spacing: {
        'safe-area-inset': 'env(safe-area-inset-bottom)'
      }
    },
  },
  plugins: [],
} 