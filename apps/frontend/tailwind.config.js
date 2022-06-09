module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      }
    }
  },
  variants: {
    extend: {
      borderWidth: ['focus-within'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      scale: ['group-hover'],
      rotate: ['group-hover'],
      transform: ['group-hover'],
      translate: ['group-hover'],
      transformOrigin: ['group-hover']
    }
  },
  plugins: []
};
