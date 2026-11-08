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
        onedark: {
          bg: "#1e222a",
          dark: "#181b21",
          surface: "#21252b",
          surface2: "#282c34",
          border: "#3e4451",
          borderMuted: "#2c313a",
          text: "#abb2bf",
          textBright: "#dcdfe4",
          muted: "#5c6370",
          red: "#e06c75",
          green: "#98c379",
          yellow: "#e5c07b",
          blue: "#61afef",
          purple: "#c678dd",
          cyan: "#56b6c2",
          orange: "#d19a66",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        window: "0 18px 40px -10px rgba(0, 0, 0, 0.65), 0 0 0 1px #3e4451",
        windowActive: "0 22px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px #61afef, 0 0 25px -5px rgba(97, 175, 239, 0.15)",
        chip: "0 2px 8px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
