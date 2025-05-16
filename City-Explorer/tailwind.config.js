/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edfcf9',
          100: '#d3f6ef',
          200: '#abe9de',
          300: '#74d5c9',
          400: '#3bbcaf',
          500: '#14B8A6', // Primary teal
          600: '#088a7f',
          700: '#076f69',
          800: '#075855',
          900: '#064747',
          950: '#022c2b',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6', // Secondary blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F97316', // Accent orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        success: {
          500: '#22c55e', // Success green
        },
        warning: {
          500: '#eab308', // Warning yellow
        },
        error: {
          500: '#ef4444', // Error red
        },
      },
      spacing: {
        '0.5': '4px',  // 0.5 * 8px
        '1': '8px',    // 1 * 8px
        '1.5': '12px', // 1.5 * 8px
        '2': '16px',   // 2 * 8px
        '2.5': '20px', // 2.5 * 8px
        '3': '24px',   // 3 * 8px
        '4': '32px',   // 4 * 8px
        '5': '40px',   // 5 * 8px
        '6': '48px',   // 6 * 8px
        '8': '64px',   // 8 * 8px
        '10': '80px',  // 10 * 8px
        '12': '96px',  // 12 * 8px
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        body: '150%',    // 1.5
        heading: '120%', // 1.2
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};