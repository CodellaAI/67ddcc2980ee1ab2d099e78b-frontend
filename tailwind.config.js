
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        darkBlue: '#1A91DA',
        lightGray: '#AAB8C2',
        extraLightGray: '#E1E8ED',
        background: '#F5F8FA',
        danger: '#E0245E'
      },
    },
  },
  plugins: [],
}
