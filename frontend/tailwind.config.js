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
        'dark-blue': '#060658',
        'primary': '#726FFF',
        'danger': '#F44336',
        'success': '#19BE34'
      },
      spacing: {
        '15': '72px'
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))'
      },
    },
  },
  plugins: [],
}

