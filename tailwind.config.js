/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007BFF',
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#007BFF',
          600: '#0062CC',
          700: '#004A99',
          800: '#003166',
          900: '#001933',
        },
        success: {
          DEFAULT: '#28A745',
          50: '#E8F5E8',
          100: '#D1EBD1',
          200: '#A3D7A3',
          300: '#75C375',
          400: '#47AF47',
          500: '#28A745',
          600: '#208637',
          700: '#186529',
          800: '#10441B',
          900: '#08220D',
        },
        viral: {
          DEFAULT: '#FF6B35',
          50: '#FFF2ED',
          100: '#FFE5DB',
          200: '#FFCBB7',
          300: '#FFB193',
          400: '#FF976F',
          500: '#FF6B35',
          600: '#FF4500',
          700: '#CC3700',
          800: '#992900',
          900: '#661B00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
