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
        primary: "#4ABFBF",
        primaryDark: "#2D9E9E",
        dark: "#0F1923",
        darkSurface: "#141E28",
        textPrimary: "#F0F4F8",
        textSecondary: "#94A3B8",
        textDark: "#1E293B",
        lightBg: "#F8FFFE",
        light: "#FFFFFF",
        gray: "#F5F5F5",
      },
      fontFamily: {
        sans: ["Google Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
