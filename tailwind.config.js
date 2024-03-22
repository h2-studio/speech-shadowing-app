/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff4500",
        "primary-200": "#ff2500",
        black: "#3D3B37",
      },
    },
  },
  plugins: [],
};
