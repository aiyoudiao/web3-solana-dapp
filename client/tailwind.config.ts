/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Vue.js浅色主题颜色
        "blue-primary": "#41B883", // Vue绿色
        "blue-primary-dark": "#369F70",
        "blue-secondary": "#E8F5F0",
        "blue-background": "#FFFFFF",
        "blue-text": "#35495E", // Vue深蓝色
        "blue-text-light": "#6C7A89",
        "blue-border": "#41B883",

        // React深色主题颜色
        "violet-primary": "#61DAFB", // React蓝色
        "violet-primary-dark": "#4ECDC4",
        "violet-secondary": "#282C34",
        "violet-background": "#20232A", // React深色背景
        "violet-text": "#FFFFFF",
        "violet-text-light": "#ABB2BF",
        "violet-border": "#61DAFB",

        // 动态主题颜色（使用CSS变量）
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        surface: "var(--surface)",
        text: "var(--text)",
        "text-light": "var(--text-light)",
        border: "var(--border)",

        // 框架官方颜色
        "vue-green": "#41B883",
        "vue-blue": "#35495E",
        "react-blue": "#61DAFB",
        "react-dark": "#20232A",
        "react-surface": "#282C34",

        // 保留原有颜色以便兼容
        accent: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
