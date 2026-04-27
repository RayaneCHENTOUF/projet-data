/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#09090b',
        secondary: '#18181b',
        accent: '#3b82f6',
        panel: 'rgba(24, 24, 27, 0.75)',
        'panel-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
