import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppStore } from './stores'
import Header from './components/Header'
import MarketsPage from './pages/MarketsPage'
import MarketDetailPage from './pages/MarketDetailPage'
import CreateMarketPage from './pages/CreateMarketPage'
import { useTranslation } from 'react-i18next'
import './i18n'

const App: React.FC = () => {
  const { fetchUser } = useAppStore()
  const { t } = useTranslation()

  useEffect(() => {
    // Initialize user data
    fetchUser()
  }, [fetchUser])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/markets/:id" element={<MarketDetailPage />} />
          <Route path="/create" element={<CreateMarketPage />} />
          <Route path="/" element={<MarketsPage />} />
        </Routes>
      </main>
      <footer className="bg-surface text-text-light py-8 mt-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>{t('footer.copyright')}</p>
          <p className="mt-2">{t('footer.builtWith')}</p>
        </div>
      </footer>
    </div>
  )
}

export default App