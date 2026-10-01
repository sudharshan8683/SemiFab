/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#04070D',
        surface: 'rgba(17, 23, 32, 0.7)',
        elevated: 'rgba(26, 35, 50, 0.7)',
        border: 'rgba(255, 255, 255, 0.08)',
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        brand: {
          DEFAULT: '#38BDF8',
          accent: '#818CF8'
        },
        status: {
          running: '#34D399',
          idle: '#94A3B8',
          warning: '#FBBF24',
          critical: '#F87171',
          maintenance: '#60A5FA',
          info: '#A78BFA',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(56, 189, 248, 0.5)',
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        neon: '0 0 10px rgba(52, 211, 153, 0.4), 0 0 20px rgba(52, 211, 153, 0.2)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      }
    },
  },
  plugins: [],
}
