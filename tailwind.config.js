// tailwind.config.js
import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
}
