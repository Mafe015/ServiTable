/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#d4a373", // caramelo: acento
        ink: "#f1e6d8", // crema cálido: texto principal (no blanco puro)
        muted: "#b8a999", // texto secundario
        navy: { 900: "#0b1422", 800: "#111f33", 700: "#1a2c47" },
        coffee: { 800: "#2e211a", 600: "#5a3d2b", 500: "#7a5238" },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", sm: "2rem", lg: "4rem", xl: "5rem", "2xl": "6rem" },
      },
    },
  },
  plugins: [],
};
