/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['luxury', 'retro'],
    base: true,
    styled: true,
    utils: true,
    logs: true,
    themeRoot: ':root',
  },
};
