import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores'
import { useThemeStore } from '../stores/themeStore'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, userLoading, fetchUser, fetchMarkets } = useAppStore()
  const { theme, setTheme } = useThemeStore()
  const { t } = useTranslation()

  useEffect(() => {
    fetchUser()
    fetchMarkets()
  }, [fetchUser, fetchMarkets])

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    // 语言切换后重新获取市场数据
    fetchMarkets()
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance)
  }

  if (userLoading) {
    return (
      <header className="bg-surface p-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text">{t('header.title')}</h1>
          <div className="text-text-light">{t('loading')}</div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-surface/80 backdrop-blur-md p-4 shadow-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <Link to="/markets" className="text-2xl font-bold text-gradient-blue hover:text-primary transition-colors">
            {t('header.title')}
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/markets" className="text-text-light hover:text-text transition-colors">
              {t('header.nav.markets')}
            </Link>
            <Link to="/create" className="text-text-light hover:text-text transition-colors">
              {t('header.nav.create')}
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-700/50 transition-colors flex items-center gap-1">
              <i className={`fa ${theme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'} text-text-light`}></i>
              <span className="text-sm text-text-light">{t(`theme.${theme}`)}</span>
            </button>
            <div className="absolute right-0 mt-1 w-36 bg-surface rounded-lg shadow-lg py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-border">
              <button 
                onClick={() => setTheme('light')}
                className={`w-full text-left px-4 py-2 text-sm ${theme === 'light' ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-background/50'}`}
              >
                {t('theme.light')}
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-background/50'}`}
              >
                {t('theme.dark')}
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`w-full text-left px-4 py-2 text-sm ${theme === 'system' ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-background/50'}`}
              >
                {t('theme.system')}
              </button>
            </div>
          </div>
          
          {/* Language Switcher */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-700/50 transition-colors flex items-center gap-1">
              <i className="fa fa-globe text-text-light"></i>
              <span className="text-sm text-text-light">{t(`language.${i18n.language}`)}</span>
            </button>
            <div className="absolute right-0 mt-1 w-36 bg-surface rounded-lg shadow-lg py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-border">
              <button 
                onClick={() => changeLanguage('en')}
                className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-background/50'}`}
              >
                {t('language.en')}
              </button>
              <button 
                onClick={() => changeLanguage('zh')}
                className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'zh' ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-background/50'}`}
              >
                {t('language.zh')}
              </button>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 px-3 py-1 rounded-full text-sm">
                <span className="text-primary font-medium">${formatBalance(user.balance)}</span>
              </div>
              <div className="bg-secondary px-3 py-1 rounded-full text-xs text-text-light truncate max-w-[150px]">
                {user.address}
              </div>
            </div>
          )}
          <Link 
            to="/create"
            className="md:hidden bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t('header.nav.create')}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header