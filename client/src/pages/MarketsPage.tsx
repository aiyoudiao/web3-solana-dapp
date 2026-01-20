import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '../stores'
import MarketCard from '../components/MarketCard'
import ErrorMessage from '../components/ErrorMessage'
import { Market } from '../types'
import { useTranslation } from 'react-i18next'
import { FullScreenSkeleton, MarketCardSkeleton } from '../components/SkeletonLoader'

type FilterOption = 'all' | 'active' | 'pending' | 'resolved'

const MarketsPage: React.FC = () => {
  const { markets, marketsLoading, marketsError, fetchMarkets } = useAppStore()
  const [filter, setFilter] = useState<FilterOption>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedMarkets, setDisplayedMarkets] = useState<Market[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)
  const itemsPerPage = 6
  const { t } = useTranslation()

  useEffect(() => {
    fetchMarkets()
  }, [fetchMarkets])

  // 过滤市场数据（仅用于渲染）
  const filteredMarketsForRender = markets.filter(market => {
    const matchesFilter = filter === 'all' || market.status === filter
    const matchesSearch = searchTerm === '' || 
      market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // 加载初始数据和处理筛选/搜索变化
  useEffect(() => {
    if (markets.length > 0 && !marketsLoading) {
      // 当筛选条件或搜索词改变时，重置显示的数据
      const initialMarkets = markets
        .filter(market => {
          const matchesFilter = filter === 'all' || market.status === filter
          const matchesSearch = searchTerm === '' || 
            market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            market.description.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesFilter && matchesSearch
        })
        .slice(0, itemsPerPage)
      
      setDisplayedMarkets(initialMarkets)
      setHasMore(initialMarkets.length < markets.length)
      // 重置加载更多状态
      setIsLoadingMore(false)
    }
  }, [markets, marketsLoading, filter, searchTerm])

  // 加载更多数据
  const loadMoreMarkets = useCallback(() => {
    if (isLoadingMore || !hasMore || marketsLoading) return
    
    setIsLoadingMore(true)
    
    // 模拟加载延迟
    setTimeout(() => {
      const currentLength = displayedMarkets.length
      
      // 在回调中直接过滤数据，避免依赖filteredMarkets
      const nextMarkets = markets
        .filter(market => {
          const matchesFilter = filter === 'all' || market.status === filter
          const matchesSearch = searchTerm === '' || 
            market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            market.description.toLowerCase().includes(searchTerm.toLowerCase())
          return matchesFilter && matchesSearch
        })
        .slice(currentLength, currentLength + itemsPerPage)
      
      if (nextMarkets.length > 0) {
        setDisplayedMarkets(prev => [...prev, ...nextMarkets])
        setHasMore(currentLength + nextMarkets.length < markets.length)
      } else {
        setHasMore(false)
      }
      
      setIsLoadingMore(false)
    }, 800)
  }, [isLoadingMore, hasMore, marketsLoading, displayedMarkets, markets, filter, searchTerm])

  // 设置无限滚动观察器
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreMarkets()
        }
      },
      { 
        threshold: 0.5,
        rootMargin: '100px'
      }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, loadMoreMarkets])

  const handleRetry = () => {
    fetchMarkets()
  }

  if (marketsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FullScreenSkeleton />
      </div>
    )
  }

  if (marketsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <ErrorMessage message={marketsError} onRetry={handleRetry} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">
          {t('markets.title')}
        </h1>
        <p className="text-text-light">
          {t('markets.description')}
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={t('markets.search')}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface text-text focus:ring-2 focus:ring-primary/50 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light">
              <i className="fa fa-search"></i>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'active', 'pending', 'resolved'] as FilterOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === option
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-light hover:bg-secondary'
              }`}
            >
              {t(`markets.filters.${option}`)}
            </button>
          ))}
        </div>
      </div>

      {markets.filter(market => {
        const matchesFilter = filter === 'all' || market.status === filter
        const matchesSearch = searchTerm === '' || 
          market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          market.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesFilter && matchesSearch
      }).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-text-light mb-4">
            <i className="fa fa-search text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-text mb-1">
            {t('markets.noResults')}
          </h3>
          <p className="text-text-light">
            {t('markets.noResultsHint')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMarkets.map((market, index) => (
              <div key={market.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <MarketCard market={market} />
              </div>
            ))}
            
            {/* 加载更多指示器 */}
            {isLoadingMore && (
              <>
                {[1, 2, 3].map((item) => (
                  <div key={`skeleton-${item}`} className="animate-fade-in" style={{animationDelay: `${item * 0.1}s`}}>
                    <MarketCardSkeleton />
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* 无限滚动观察目标 */}
          <div ref={observerTarget} className="h-16 mt-8 bg-primary/5 border border-dashed border-primary/20 rounded-lg flex items-center justify-center text-primary/60 text-sm">
            <span className="animate-pulse">Scroll for more markets...</span>
          </div>
          
          {!hasMore && displayedMarkets.length > 0 && (
            <div className="text-center mt-8 text-text-light">
              {t('markets.noMoreMarkets')}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MarketsPage