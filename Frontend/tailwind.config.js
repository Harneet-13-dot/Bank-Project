// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // ← must include jsx/tsx
  ],
  theme: { extend: {} },
  plugins: [],
}