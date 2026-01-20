import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  isDarkMode: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => {
  // Check system preference
  const checkSystemTheme = () => {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  }

  // Initialize with saved theme or system preference
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const initialTheme = savedTheme || 'system'
  const initialIsDarkMode = initialTheme === 'system' ? checkSystemTheme() : initialTheme === 'dark'

  // Apply theme to document
  const applyTheme = (isDark: boolean) => {
    // 移除所有主题类
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    // 添加当前主题类
    document.documentElement.classList.add(isDark ? 'theme-dark' : 'theme-light')
  }

  // Apply initial theme
  applyTheme(initialIsDarkMode)

  // Listen for system theme changes
  if (initialTheme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      set({ isDarkMode: e.matches })
      applyTheme(e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
  }

  return {
    theme: initialTheme,
    isDarkMode: initialIsDarkMode,
    
    setTheme: (theme: Theme) => {
      localStorage.setItem('theme', theme)
      
      let isDarkMode: boolean
      if (theme === 'system') {
        isDarkMode = checkSystemTheme()
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
          set({ isDarkMode: e.matches })
          applyTheme(e.matches)
        }
        mediaQuery.addEventListener('change', handleChange)
      } else {
        isDarkMode = theme === 'dark'
      }
      
      set({ theme, isDarkMode })
      applyTheme(isDarkMode)
    },
    
    toggleTheme: () => {
      const { theme, isDarkMode } = get()
      
      if (theme === 'system') {
        // Toggle between light and dark when on system theme
        const newTheme = isDarkMode ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        set({ theme: newTheme, isDarkMode: !isDarkMode })
        applyTheme(!isDarkMode)
      } else {
        // Toggle between light and dark
        const newTheme = theme === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', newTheme)
        set({ theme: newTheme, isDarkMode: newTheme === 'dark' })
        applyTheme(newTheme === 'dark')
      }
    }
  }
})