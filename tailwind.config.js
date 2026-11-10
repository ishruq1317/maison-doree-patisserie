/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#23150D',
          100: '#2B1A11',
          200: 'rgba(245, 179, 56, 0.16)',
          300: 'rgba(245, 179, 56, 0.28)',
          400: '#8C7567',
          500: '#A89080',
          600: '#C4AEA0',
          700: '#DDD0C7',
          800: '#EDE4DC',
          900: '#FAF3EA',
          ivory: 'var(--bg-stone-ivory)',
          DEFAULT: '#130B07',
        },
        creme: {
          surface: 'var(--bg-creme-surface)',
          DEFAULT: '#1E120B',
        },
        espresso: {
          deep: 'var(--surface-espresso-deep)',
          warm: 'var(--surface-espresso-warm)',
          DEFAULT: '#0D0704',
        },
        butter: {
          DEFAULT: 'var(--accent-butter, #F5B338)',
          gold: 'var(--accent-butter-gold, #E59B24)',
          light: 'var(--accent-butter-light, #FDF7EE)',
        },
        terracotta: {
          DEFAULT: 'var(--accent-terracotta, #D95A2B)',
          hover: 'var(--accent-terracotta-hover, #BF481B)',
          light: '#351B12',
        },
        bordeaux: {
          DEFAULT: 'var(--accent-bordeaux, #731726)',
          hover: '#5B0E1B',
          light: '#2E1016',
        },
        patisserie: {
          ink: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        gourmand: {
          dark: '#130B07',
          ganache: '#1E120B',
          crust: '#D95A2B',
          butter: '#F5B338',
          cream: '#FAF3EA',
          amber: '#E59B24',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tactile-subtle': '0 2px 8px -2px rgba(35, 23, 18, 0.06), 0 4px 16px -4px rgba(35, 23, 18, 0.04)',
        'tactile-hover': '0 12px 28px -6px rgba(35, 23, 18, 0.12), 0 8px 16px -4px rgba(35, 23, 18, 0.08)',
        'tactile-inset': 'inset 0 2px 4px 0 rgba(35, 23, 18, 0.06)',
        'glass-glow': '0 8px 32px 0 rgba(197, 107, 73, 0.15)',
        'gold-glow': '0 0 20px -3px rgba(244, 208, 111, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
