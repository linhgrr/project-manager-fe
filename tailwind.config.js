/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/**/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3b82f6',
        'secondary-blue': '#2563eb',
        'light-gray': '#f9f9f9',
        'dark-gray': '#374151',
      }
    },
  },
  plugins: [],
}
