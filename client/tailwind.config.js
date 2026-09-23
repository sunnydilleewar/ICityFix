/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#f5faf7',
          100: '#e3f3ee',
          200: '#cfe9df',
          300: '#a9d8c7',
          400: '#7fc0a8',
          500: '#4fa986',
          600: '#2e8f72',
          700: '#246f5d',
          800: '#1c544a',
          900: '#173d39',
          950: '#122c2a',
        },
        navy: {
          800: '#1b2a2b',
          900: '#142127',
          950: '#0d1719',
        },
        status: {
          reported: '#2f8f72',
          review: '#f29b57',
          assigned: '#7b6dff',
          progress: '#2f6fe0',
          resolved: '#2fbf85',
          rejected: '#ed6b5f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 18px 40px rgba(15, 23, 42, 0.08), 0 3px 12px rgba(46, 143, 114, 0.08)',
        'card-hover': '0 24px 52px rgba(15, 23, 42, 0.10), 0 8px 20px rgba(46, 143, 114, 0.12)',
      }
    },
  },
  plugins: [],
}
