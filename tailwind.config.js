/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(142 72% 22%)",
          light: "hsl(142 50% 85%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ink: { DEFAULT: '#1E2D28', muted: '#6E7A74', subtle: '#9AA8A2' },
        bg: { DEFAULT: '#F8FCF9', dark: '#F0F6F2' },
        surface: { DEFAULT: '#FFFFFF', light: '#F8FCF9', dark: '#EEF8F3' },
        mint: { DEFAULT: '#EEF8F3' },
        warm: { DEFAULT: '#F4A261', light: '#FBD3A8', dark: '#E08838' },
        forest: { DEFAULT: '#2F6E52', light: '#4A7263' },
        danger: { DEFAULT: '#E85C5C', light: '#FEF2F2' },
        warning: { DEFAULT: '#F2A93B', light: '#FFFBEB' },
        success: { DEFAULT: '#4CAF50', light: '#F0FDF4' },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(22,53,43,0.04)',
        'soft-lg': '0 4px 24px rgba(22,53,43,0.06)',
        'card': '0 4px 20px rgba(22,53,43,0.06)',
        'card-hover': '0 8px 30px rgba(22,53,43,0.1)',
        'glow': '0 4px 24px rgba(143,217,182,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'heading': ['1.625rem', { lineHeight: '1.25' }],
        'body': ['1.0625rem', { lineHeight: '1.65' }],
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(135deg, #DCEFE4 0%, #E8F5EE 100%)',
        'gradient-featured': 'linear-gradient(135deg, #8FD9B6 0%, #B0E5CC 100%)',
        'gradient-hero': 'linear-gradient(180deg, #F8FBF9 0%, #DCEFE4 100%)',
        'gradient-mint': 'linear-gradient(135deg, #EEF8F3 0%, #F8FCF9 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: ["tailwindcss-animate"],
}
