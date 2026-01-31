/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#60a5fa', // Light blue
          hover: '#3b82f6',
        },
        dark: {
          bg: '#000000', // Pure black
          card: '#18181b', // Zinc 900
          sidebar: '#171717', // Neutral 900 (Pure dark gray)
          input: '#334155',
          border: '#475569',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
        },
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
