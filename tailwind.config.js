/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:  { 50: '#FFF8F1', 100: '#FFEFD9', 200: '#FFE0B0' },
        sakura: { 50: '#FFF5F7', 100: '#FFE0E8', 200: '#FFC2D1', 300: '#FFA3B8', 400: '#FF84A0' },
        lavender: { 50: '#F5F1FF', 100: '#E8DFFF', 200: '#D4C5FF', 300: '#B8A4FF', 400: '#9C84FF' },
        mint:   { 50: '#F0FFF7', 100: '#D1F7E2', 200: '#A8EFC8', 300: '#7FE8AE' },
        mocha:  { 500: '#8B6F5C', 600: '#6B5344', 700: '#4A3828' },
      },
      fontFamily: {
        sans: ['ui-rounded', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(139, 111, 92, 0.12)',
        glow: '0 0 0 4px rgba(255, 194, 209, 0.25)',
      },
    },
  },
  plugins: [],
};
