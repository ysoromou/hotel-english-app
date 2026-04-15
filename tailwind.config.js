/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Palette Premium Light — source unique de vérité */
        primary:  { DEFAULT: '#006633', dark: '#004d26' },
        success:  '#4CAF50',
        error:    '#DC2626',
        surface:  '#F5F5F5',
        /* Alias métiers (gardés pour compatibilité) */
        reception:   '#006633',
        housekeeping:'#4CAF50',
        restaurant:  '#006633',
        security:    '#333333',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft':  '0 2px 16px rgba(0,0,0,0.06)',
        'soft-lg':'0 4px 32px rgba(0,0,0,0.08)',
      },
      minHeight: { touch: '44px' },
      minWidth:  { touch: '44px' },
    },
  },
  plugins: [],
}
