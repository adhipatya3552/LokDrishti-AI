import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Cinematic dark-mode palette
        ink: {
          950: '#08090b',
          900: '#0d0f12',
          850: '#11141a',
          800: '#161a22',
          700: '#1d222c',
          600: '#262c38',
          500: '#3a4150',
        },
        ash: {
          50: '#f5f6f8',
          100: '#e5e8ee',
          200: '#c8ced9',
          300: '#9aa3b3',
          400: '#6e7787',
          500: '#4b5363',
        },
        // Stage-light accents
        amber: {
          DEFAULT: '#d4a85a',
          400: '#e6c081',
          500: '#d4a85a',
          600: '#a8843a',
        },
        teal: {
          DEFAULT: '#5fcdc1',
          500: '#5fcdc1',
          600: '#3da9a0',
        },
        emerald: {
          DEFAULT: '#4f9e7a',
          500: '#4f9e7a',
          600: '#3b7a5d',
        },
        rose: {
          DEFAULT: '#c46b6b',
          500: '#c46b6b',
          600: '#a35050',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      backgroundImage: {
        'film-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
