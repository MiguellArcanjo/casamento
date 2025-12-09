import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          50: '#fef7f7',
          100: '#feecec',
          200: '#fdd9d9',
          300: '#fbbaba',
          400: '#f78d8d',
          500: '#f16161',
          600: '#e03e3e',
          700: '#c02d2d',
          800: '#9f2828',
          900: '#842828',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#ffced3',
          300: '#ffa6b0',
          400: '#ff7d8c',
          500: '#ff5469',
          600: '#ed1e3a',
          700: '#c8122a',
          800: '#a51226',
          900: '#8b1526',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config

