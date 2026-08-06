/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#CC470A",
          50: "#FDF0E7",
          100: "#FADCC8",
          200: "#F5B98D",
          300: "#EF9653",
          400: "#E9721F",
          500: "#CC470A",
          600: "#A63A08",
          700: "#7F2C06",
          800: "#591F04",
          900: "#331202",
        },
        cream: "#FFF8F2",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-600px 0" },
          "100%": { backgroundPosition: "600px 0" },
        },
        "wishlist-burst": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.6)" },
          "50%": { transform: "scale(0.9)" },
          "70%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        "wishlist-ring": {
          "0%": { opacity: "0.9", transform: "scale(0.3)" },
          "100%": { opacity: "0", transform: "scale(2.2)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-in-right": "slide-in-right 0.3s ease-out both",
        shimmer: "shimmer 1.4s linear infinite",
        "wishlist-burst": "wishlist-burst 0.7s ease-out both",
        "wishlist-ring": "wishlist-ring 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};
