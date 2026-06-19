/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral:   { DEFAULT: '#FF6B6B', light: '#FF8E8E', dark: '#E05555' },
        teal:    { DEFAULT: '#4ECDC4', light: '#7EDDD6', dark: '#3BB5AD' },
        yellow:  { DEFAULT: '#FFD93D', light: '#FFE366', dark: '#F0C220' },
        cream:   { DEFAULT: '#FFFAF5', dark: '#FFF5ED' },
        ink:     { DEFAULT: '#1A1F2E', muted: '#5A6270', subtle: '#9CA3AF' },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 16px rgba(0,0,0,0.04)',
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.08)',
        'coral': '0 4px 20px rgba(255,107,107,0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['1.75rem', { lineHeight: '1.25' }],
        'body': ['1.125rem', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [],
}
