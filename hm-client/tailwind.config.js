/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#074173",
      },
      fontFamily: {
        kufam: ["Noto Sans", "sans-serif"],
      },
      borderWidth: {
        0.5: "0.5px",
      },
      screens: {
        xxs: "240px",
        xs: "340px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
