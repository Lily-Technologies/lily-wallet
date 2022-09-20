const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  mode: 'jit',
  theme: {
    extend: {
      animation: {
        xBounce: 'xBounce 1s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite'
      },
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
      },
      keyframes: {
        xBounce: {
          '0%, 100%': { transform: 'translateX(0.1rem)' },
          '50%': { transform: 'translateX(0rem)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0.4rem)' },
          '50%': { transform: 'translateY(0rem)' }
        }
      },
      transitionProperty: {
        height: 'height'
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
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          highlight: (value) => ({ boxShadow: `inset 0 1px 0 0 ${value}` })
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      );
    }
  ]
};
