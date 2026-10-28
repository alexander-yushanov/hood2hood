/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"] },
      colors: { ink: "#0b1220" },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pop: { "0%": { opacity: "0", transform: "translateY(12px) scale(.96)" }, "100%": { opacity: "1", transform: "translateY(0) scale(1)" } },
        ping2: { "0%": { transform: "scale(1)", opacity: ".6" }, "100%": { transform: "scale(3)", opacity: "0" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        pop: "pop .5s cubic-bezier(.2,.8,.2,1) both",
        ping2: "ping2 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
