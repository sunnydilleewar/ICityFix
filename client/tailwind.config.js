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
          50: '#eefbff',
          100: '#dff8ff',
          200: '#bfeefc',
          300: '#93defc',
          400: '#5cc8f7',
          500: '#2bb2f3',
          600: '#0e8de9',
          700: '#0e6ec4',
          800: '#14559d',
          900: '#153f72',
          950: '#0d2243',
        },
        navy: {
          800: '#0F172A',
          900: '#0B1120',
          950: '#060A13',
        },
        status: {
          reported: '#3B82F6',
          review: '#F59E0B',
          assigned: '#8B5CF6',
          progress: '#0284C7',
          resolved: '#10B981',
          rejected: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 12px 30px rgba(15, 23, 42, 0.08), 0 2px 10px rgba(14, 141, 233, 0.08)',
        'card-hover': '0 18px 45px rgba(15, 23, 42, 0.12), 0 8px 18px rgba(14, 141, 233, 0.10)',
      }
    },
  },
  plugins: [],
}
