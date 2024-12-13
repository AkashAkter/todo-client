/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
  daisyui: {
    themes: ["light"],
  },
  theme: {

    extend: {},
  },
  plugins: [require("daisyui")],
}

