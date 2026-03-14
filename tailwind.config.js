export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bihar-red': '#d32f2f',
        'bihar-maroon': {
          DEFAULT: '#800000',
          dark: '#4a0000',
          light: '#b03030',
        },
        'bihar-mustard': {
          DEFAULT: '#ffc107',
          light: '#ffecb3',
          dark: '#c19100',
        },
        'bihar-cream': {
          DEFAULT: '#fff8e1',
          dark: '#f0e6d6',
        },
        'bihar-green': {
          DEFAULT: '#388e3c',
          light: '#81c784',
          dark: '#1b5e20',
        },
        'primary': '#d32f2f',
        'accent': '#ffc107',
      },
      fontFamily: {
        display: ['Outfit', 'Playfair Display', 'serif'],
        heading: ['Outfit', 'sans-serif'],
        hindi: ['Poppins', 'sans-serif'], // Or any Indic font if available
      },
      boxShadow: {
        'bihari': '0 10px 30px -5px rgba(211, 47, 47, 0.2)',
        'bihari-lg': '0 20px 50px -10px rgba(128, 0, 0, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
