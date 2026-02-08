export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        sepia: {
          50: '#faf8f3',
          100: '#f5f1e7',
          200: '#ebe3cf',
          300: '#ddd0b0',
          400: '#d0bd91',
          500: '#c2aa72',
          600: '#b4975b',
          700: '#907849',
          800: '#76603d',
          900: '#604f33',
        },
      },
    },
  },
  plugins: [],
}
