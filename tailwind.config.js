/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:  { DEFAULT: '#2D6A4F', light: '#52B788', dark: '#1B4332' },
        sage:    { DEFAULT: '#95D5B2', light: '#B7E4C7', dark: '#74C69D' },
        amber:   { DEFAULT: '#F4A261', light: '#F9C784', dark: '#E76F51' },
        snow:    { DEFAULT: '#FAFAF8', dark: '#F0F0EC' },
        ink:     { DEFAULT: '#1A2E2A', muted: '#4A6572', subtle: '#8FA3A0' },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'forest': '0 4px 20px rgba(45,106,79,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
