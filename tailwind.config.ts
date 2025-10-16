import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Цвета из Figma дизайна
        winrate: {
          primary: "#2581FF", // Основной синий цвет
          dark: "#282E3B",     // Темный фон навигации
          darker: "#080B12",   // Самый темный фон
          accent: "#131A2A",   // Акцентный темный
        }
      },
      fontFamily: {
        fact: ['Inter', 'Arial', 'sans-serif'], // Заменяем Fact на доступный Inter
      },
      backdropBlur: {
        '21': '21px',
      }
    },
  },
  plugins: [],
};
export default config;
