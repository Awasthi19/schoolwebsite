import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/portfoliocomponents/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'custom-light': '0 5px 5px rgba(100, 100, 100, 0.5)', // Light mode shadow
        'custom-dark': '0 5px 5px rgba(0, 0, 0, 2)', // Dark mode shadow
      },
      backgroundColor: {
        'custom-light': '#fff', // Light mode background color
        'custom-dark': '#1f1f1f', // Dark mode background color
      },
      textColor: {
        'custom-light': '#333', // Light mode text color
        'custom-dark': '#fff', // Dark mode text color
      },
    },
  },
  plugins: [],
};
export default config;
