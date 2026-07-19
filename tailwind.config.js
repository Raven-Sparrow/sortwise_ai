/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pine: {
          950: '#0B1613',
          900: '#0F1B17',
          800: '#16241F',
          700: '#1D302A',
          600: '#2A4139',
        },
        paper: '#F1EFE7',
        muted: '#9DB0A8',
        recyclable: {
          DEFAULT: '#2FA8D9',
          dim: '#1E6E90',
          glow: 'rgba(47,168,217,0.35)',
        },
        compost: {
          DEFAULT: '#8CC63F',
          dim: '#5E8A29',
          glow: 'rgba(140,198,63,0.35)',
        },
        landfill: {
          DEFAULT: '#B08968',
          dim: '#7A5C46',
          glow: 'rgba(176,137,104,0.35)',
        },
        hazard: {
          DEFAULT: '#E0574F',
          dim: '#9C3B35',
          glow: 'rgba(224,87,79,0.35)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        drop: {
          '0%': { transform: 'translateY(-40px) scale(0.9)', opacity: '0' },
          '60%': { transform: 'translateY(4px) scale(1.02)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        travel: {
          '0%': { left: '2%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { left: 'var(--stop, 78%)', opacity: '1' },
        },
        beltMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-80px 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        drop: 'drop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        travel: 'travel 1.4s cubic-bezier(0.65,0,0.35,1) forwards',
        belt: 'beltMove 1s linear infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        scan: 'scan 1.8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
