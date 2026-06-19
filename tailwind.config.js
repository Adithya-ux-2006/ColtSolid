/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#1F5E4A', dark: '#164535', light: '#2F7D61' },
        accent:    { DEFAULT: '#8FD9B6', light: '#B0E5CC', dark: '#6EC8A0' },
        surface:   { DEFAULT: '#DCEFE4', light: '#E8F5EE', dark: '#C5E5D6' },
        bg:        { DEFAULT: '#F8FBF9', dark: '#F0F6F2' },
        ink:       { DEFAULT: '#16352B', muted: '#4A7263', subtle: '#8AA89B' },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(22,53,43,0.04)',
        'card': '0 4px 20px rgba(22,53,43,0.06)',
        'card-hover': '0 8px 30px rgba(22,53,43,0.1)',
        'glow': '0 4px 24px rgba(143,217,182,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'heading': ['1.625rem', { lineHeight: '1.25' }],
        'body': ['1.0625rem', { lineHeight: '1.65' }],
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(135deg, #DCEFE4 0%, #E8F5EE 100%)',
        'gradient-featured': 'linear-gradient(135deg, #8FD9B6 0%, #B0E5CC 100%)',
        'gradient-hero': 'linear-gradient(180deg, #F8FBF9 0%, #DCEFE4 100%)',
      },
    },
  },
  plugins: [],
}
