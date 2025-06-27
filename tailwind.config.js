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
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            // Updated primary color (#164863) with generated shades
            primary: {
              50: '#e6f0f5',
              100: '#cce1eb',
              200: '#99c3d7',
              300: '#66a5c3',
              400: '#3387af',
              500: '#164863',
              600: '#123a4f',
              700: '#0e2b3b',
              800: '#091d28',
              900: '#050e14',
              DEFAULT: '#164863',
              foreground: '#FFFFFF',
            },
            // Updated secondary color (#427D9D) with generated shades
            secondary: {
              50: '#eaf3f7',
              100: '#d5e7ef',
              200: '#abcfdf',
              300: '#81b7cf',
              400: '#579fbf',
              500: '#427D9D',
              600: '#35647e',
              700: '#284b5e',
              800: '#1a323f',
              900: '#0d191f',
              DEFAULT: '#427D9D',
              foreground: '#FFFFFF',
            },
            // Added accent color (#DDF2FD) with generated shades
            accent: {
              50: '#fcfeff',
              100: '#f9fdfe',
              200: '#f3fbfd',
              300: '#edf9fc',
              400: '#e7f7fb',
              500: '#DDF2FD',
              600: '#b1c2ca',
              700: '#859198',
              800: '#586165',
              900: '#2c3033',
              DEFAULT: '#DDF2FD',
              foreground: '#164863',
            },
          },
        },
        dark: {
          colors: {
            // Updated primary color for dark mode
            primary: {
              50: '#050e14',
              100: '#091d28',
              200: '#0e2b3b',
              300: '#123a4f',
              400: '#164863',
              500: '#3387af',
              600: '#66a5c3',
              700: '#99c3d7',
              800: '#cce1eb',
              900: '#e6f0f5',
              DEFAULT: '#164863',
              foreground: '#FFFFFF',
            },
            // Updated secondary color for dark mode
            secondary: {
              50: '#0d191f',
              100: '#1a323f',
              200: '#284b5e',
              300: '#35647e',
              400: '#427D9D',
              500: '#579fbf',
              600: '#81b7cf',
              700: '#abcfdf',
              800: '#d5e7ef',
              900: '#eaf3f7',
              DEFAULT: '#427D9D',
              foreground: '#FFFFFF',
            },
            // Added accent color for dark mode
            accent: {
              50: '#2c3033',
              100: '#586165',
              200: '#859198',
              300: '#b1c2ca',
              400: '#DDF2FD',
              500: '#e7f7fb',
              600: '#edf9fc',
              700: '#f3fbfd',
              800: '#f9fdfe',
              900: '#fcfeff',
              DEFAULT: '#DDF2FD',
              foreground: '#164863',
            },
          },
        },
      },
    }),
  ],
}
