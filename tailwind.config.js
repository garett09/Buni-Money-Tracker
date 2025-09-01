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
        'liquid-morph': 'liquidMorph 8s ease-in-out infinite',
        'liquid-morph-2': 'liquidMorph2 10s ease-in-out infinite',
        'liquid-morph-3': 'liquidMorph3 12s ease-in-out infinite',
        'liquid-flow': 'liquidFlow 2s ease-in-out infinite',
        'liquid-shimmer': 'liquidShimmer 1.5s ease-in-out infinite',
        'apple-float': 'appleFloat 6s ease-in-out infinite',
        'apple-glow': 'appleGlow 3s ease-in-out infinite alternate',
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
        liquidMorph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 30% 60% 50% / 40% 50% 60% 30%' },
          '75%': { borderRadius: '40% 70% 40% 60% / 70% 40% 50% 60%' },
        },
        liquidMorph2: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '33%': { borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%' },
          '66%': { borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%' },
        },
        liquidMorph3: {
          '0%, 100%': { borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' },
          '25%': { borderRadius: '40% 60% 60% 40% / 50% 50% 50% 50%' },
          '50%': { borderRadius: '60% 40% 40% 60% / 40% 60% 60% 40%' },
          '75%': { borderRadius: '30% 70% 70% 30% / 70% 30% 30% 70%' },
        },
        liquidFlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        liquidShimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        appleFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        appleGlow: {
          '0%': { 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 0 rgba(0, 122, 255, 0.4)' 
          },
          '100%': { 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(0, 122, 255, 0.2)' 
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
        '4xl': '60px',
        '5xl': '80px',
      },
      borderRadius: {
        'liquid': '60% 40% 30% 70% / 60% 30% 70% 40%',
        'liquid-2': '30% 70% 70% 30% / 30% 30% 70% 70%',
        'liquid-3': '50% 50% 50% 50% / 60% 60% 40% 40%',
      },
    },
  },
  plugins: [],
}
