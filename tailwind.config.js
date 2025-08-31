/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'body': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#007AFF',
        'primary-dark': '#0056CC',
        secondary: '#5856D6',
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        info: '#5AC8FA',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
        'gradient-success': 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
        'gradient-warning': 'linear-gradient(135deg, #FF9500 0%, #FF9F0A 100%)',
        'gradient-error': 'linear-gradient(135deg, #FF3B30 0%, #FF453A 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      animation: {
        'ios-bounce': 'iosBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ios-fade-in': 'iosFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'ios-slide-up': 'iosSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        iosBounce: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        iosFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        iosSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
