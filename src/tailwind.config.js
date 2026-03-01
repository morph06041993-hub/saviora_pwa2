/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Основной шрифт для интерфейса - мягкий и уютный
        sans: ['Nunito', 'sans-serif'], 
        // Шрифт для заголовков - атмосферный и книжный
        serif: ['"DM Serif Text"', 'serif'],
        // Рукописный для акцентов
        hand: ['"Playwrite US Trad"', 'cursive'],
      },
    },
  },
  plugins: [],
}