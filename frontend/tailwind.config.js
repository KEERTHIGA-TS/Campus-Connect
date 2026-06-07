/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b9ccff',
          300: '#85a5ff',
          400: '#4d75ff',
          500: '#2548f5',
          600: '#1530eb',
          700: '#1124d8',
          800: '#1420ae',
          900: '#162089',
        },
        surface: '#f8f9fe',
        card: '#ffffff',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06)',
        elevated: '0 4px 24px rgba(37,72,245,.10)',
      }
    },
  },
  plugins: [],
}
