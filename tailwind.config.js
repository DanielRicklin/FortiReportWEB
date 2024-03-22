/** @type {import('tailwindcss').Config} */
import themer from "@tailus/themer";
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./resources/**/*.edge",
    "./resources/**/*.{js,ts,jsx,tsx,vue}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: ['selector'],
  theme: {
    colors: ({ colors }) => ({
        primary: colors.blue,
        secondary: colors.lime,
        accent: colors.pink,
        success: colors.lime,
        danger: colors.red,
        warning: colors.yellow,
        info: colors.blue,
        gray: colors.zinc,
        white: colors.white,
        black: colors.black,
        transparent: colors.transparent,
    }),
    keyframes: {
        loop: {
            to: {
                "offset-distance": "100%",
            },
        },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

