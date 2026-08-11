/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        apparel: {
          bg: '#0c0e16',
          panel: '#171a29',
          panel2: '#1f2438',
          border: 'rgba(120, 244, 233, 0.16)',
          teal: '#20e3cf',
          tealLight: '#9af9f2',
          pink: '#ff2fa5',
          pinkLight: '#ff8fd0',
          volt: '#d4ff3d',
          cream: '#f7fbff',
          muted: 'rgba(222, 241, 255, 0.72)',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'grad-drop': 'linear-gradient(120deg, #20e3cf 0%, #30b7f2 45%, #ff2fa5 100%)',
        'grad-volt': 'linear-gradient(120deg, #d4ff3d 0%, #20e3cf 100%)',
        'grad-fire': 'linear-gradient(135deg, #ff2fa5 0%, #ff8f3d 100%)',
        'hero-radial':
          'radial-gradient(circle at 15% 10%, rgba(255,47,165,0.28) 0%, transparent 42%), radial-gradient(circle at 85% 20%, rgba(32,227,207,0.28) 0%, transparent 46%), radial-gradient(circle at 50% 95%, rgba(212,255,61,0.14) 0%, transparent 46%)',
      },
    },
  },
  plugins: [],
}
