/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 蓝色科技主题颜色
        'blue-primary': '#1E88E5',
        'blue-primary-dark': '#1565C0',
        'blue-secondary': '#E3F2FD',
        'blue-background': '#F5F7FA',
        'blue-text': '#2C3E50',
        'blue-text-light': '#7F8C8D',
        'blue-border': '#BDC3C7',
        
        // 紫罗兰主题颜色
        'violet-primary': '#9370DB',
        'violet-primary-dark': '#7B68EE',
        'violet-secondary': '#483D8B',
        'violet-background': '#1A1A2E',
        'violet-text': '#E0E0E0',
        'violet-text-light': '#B0B0B0',
        'violet-border': '#6A5ACD',
        
        // 动态主题颜色（使用CSS变量）
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        'text-light': 'var(--text-light)',
        border: 'var(--border)',
        
        // 保留原有颜色以便兼容
        accent: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}