import React from 'react'
import { Link } from 'react-router-dom'
import { Market } from '../types'
import { useAppStore } from '../stores'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

interface MarketCardProps {
  market: Market
}

const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const { getOdds } = useAppStore()
  const { t } = useTranslation()
  const odds = getOdds(market)
  const totalPool = market.yesPool + market.noPool

  const formatDate = (timestamp: number) => {
    const lang = i18n.language || 'en'
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    if (lang === 'zh') {
      return new Date(timestamp).toLocaleDateString('zh-CN', options)
    } else {
      return new Date(timestamp).toLocaleDateString('en-US', options)
    }
  }

  const getStatusColor = (status: Market['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'resolved':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getResultColor = (result?: 'yes' | 'no') => {
    if (!result) return ''
    return result === 'yes' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  return (
    <Link to={`/markets/${market.id}`} className="block">
      <div className="bg-surface rounded-xl shadow-blue hover:shadow-lg transition-all duration-300 p-6 border border-border hover:border-primary/30 hover:glow-blue group">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-text line-clamp-2">
            {market.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(market.status)}`}>
            {t(`marketCard.status.${market.status}`)}
          </span>
        </div>
        
        <p className="text-text-light text-sm mb-4 line-clamp-2">
          {market.description}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="text-sm text-text-light">
            <i className="fa fa-clock-o mr-1"></i>
            {t('marketCard.ends')}: {formatDate(market.endTime)}
          </div>
          
          {market.status === 'resolved' && market.result && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResultColor(market.result)}`}>
              {t('marketCard.result')}: {market.result.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-blue-light rounded-lg p-4 border border-border/50 group-hover:border-primary/20 transition-colors">
            <div className="text-sm font-medium text-text-light mb-1">{t('marketCard.yesPool')}</div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                ${market.yesPool.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-text-light">
                {t('marketCard.odds')}: {odds.yes.toFixed(2)}x
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-blue-light rounded-lg p-4 border border-border/50 group-hover:border-primary/20 transition-colors">
            <div className="text-sm font-medium text-text-light mb-1">{t('marketCard.noPool')}</div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                ${market.noPool.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-text-light">
                {t('marketCard.odds')}: {odds.no.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-background/50 grid-pattern rounded-lg p-4 border border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-text-light">{t('marketCard.totalPool')}</span>
            <span className="text-xl font-bold text-gradient-blue">
              ${totalPool.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MarketCard