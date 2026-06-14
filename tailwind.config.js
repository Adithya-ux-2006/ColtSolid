/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral:  { DEFAULT: '#FF6B6B', light: '#FF8E8E', dark: '#E55555' },
        teal:   { DEFAULT: '#4ECDC4', light: '#72D9D2', dark: '#3BADA5' },
        yellow: { DEFAULT: '#FFD93D', light: '#FFE472', dark: '#E5C22A' },
        cream:  { DEFAULT: '#FFFAF5', dark: '#FFF0E0' },
        ink:    { DEFAULT: '#2D3748', muted: '#718096' },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'coral': '0 4px 20px rgba(255,107,107,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
