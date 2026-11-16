/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#847445',
          'gold-dark': '#6E6038',
          'gold-light': '#F6F4EE',
          primary: '#847445',
          'primary-dark': '#6E6038',
          'primary-light': '#F6F4EE',
          dark: '#14181F',
          text: '#222831',
          muted: '#64748B',
          border: '#EAEAEA'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        hand: ['Caveat', 'cursive'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
