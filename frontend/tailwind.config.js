/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'lighter-blue': '#12108E',
        'regular-blue': '#0E0D7A',
        'dark-blue': '#060658'
      },
      spacing: {
        '15': '72px'
      }
    },
  },
  plugins: [],
}

