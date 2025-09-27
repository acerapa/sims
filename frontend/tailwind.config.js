/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'lighter-blue': '#12108E',
        'regular-blue': '#0E0D7A',
        'dark-blue': '#060658',
        primary: '#726FFF',
        danger: '#F44336',
        success: '#19BE34',
        'default-gray': '#e5e7eb'
      },
      spacing: {
        15: '72px'
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-18': 'span 18 / span 18'
      },
      gridColumnStart: {
        13: '13'
      },
      gridColumnEnd: {
        13: '13'
      },
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
        17: 'repeat(17, minmax(0, 1fr))',
        18: 'repeat(18, minmax(0, 1fr))',
        19: 'repeat(19, minmax(0, 1fr))',
        20: 'repeat(20, minmax(0, 1fr))',
        21: 'repeat(21, minmax(0, 1fr))',
        22: 'repeat(22, minmax(0, 1fr))'
      }
    }
  },
  plugins: []
}
