import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import Button from '../components/Button'
import Input from '../components/Input'
import { useTranslation } from 'react-i18next'

const MarketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    currentMarket,
    currentMarketLoading,
    currentMarketError,
    user,
    userBets,
    fetchMarketById,
    placeBet,
    claimReward,
    getOdds,
    fetchUserBets,
    placingBet,
    claimingReward
  } = useAppStore()
  const { t } = useTranslation()

  const [betSide, setBetSide] = useState<'yes' | 'no'>('yes')
  const [betAmount, setBetAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id) {
      fetchMarketById(id)
      fetchUserBets()
    }
  }, [id, fetchMarketById, fetchUserBets])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleBet = async () => {
    if (!currentMarket || !user) return
    
    setError('')
    setSuccess('')
    
    const amount = parseFloat(betAmount)
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    if (amount > user.balance) {
      setError(t('marketDetail.insufficientBalance'))
      return
    }
    
    if (currentMarket.status !== 'active') {
      setError(t('marketDetail.marketClosed'))
      return
    }
    
    try {
      await placeBet(currentMarket.id, betSide, amount)
      setBetAmount('')
      setSuccess(t('marketDetail.placedBet', { amount: `$${amount.toFixed(2)}`, side: betSide.toUpperCase() }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet')
    }
  }

  const handleClaimReward = async () => {
    if (!currentMarket) return
    
    try {
      const reward = await claimReward(currentMarket.id)
      setSuccess(t('marketDetail.claimedReward', { amount: `$${reward.toFixed(2)}` }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward')
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getUserBet = () => {
    if (!currentMarket) return null
    return userBets.find(bet => bet.marketId === currentMarket.id)
  }

  const canClaimReward = () => {
    if (!currentMarket || currentMarket.status !== 'resolved' || !currentMarket.result) {
      return false
    }
    
    const userBet = getUserBet()
    return userBet && userBet.side === currentMarket.result
  }

  const calculatePotentialReward = (amount: number) => {
    if (!currentMarket) return 0
    
    const odds = getOdds(currentMarket)
    const selectedOdds = betSide === 'yes' ? odds.yes : odds.no
    return amount * selectedOdds
  }

  if (currentMarketLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" text="Loading market details..." />
        </div>
      </div>
    )
  }

  if (currentMarketError || !currentMarket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <ErrorMessage 
            message={currentMarketError || 'Market not found'} 
            onRetry={() => id && fetchMarketById(id)} 
          />
          <div className="mt-4 text-center">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/markets')}
              icon={<i className="fa fa-arrow-left"></i>}
            >
              Back to Markets
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const odds = getOdds(currentMarket)
  const totalPool = currentMarket.yesPool + currentMarket.noPool
  const userBet = getUserBet()
  const potentialReward = betAmount ? calculatePotentialReward(parseFloat(betAmount)) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/markets')}
        className="mb-6"
        icon={<i className="fa fa-arrow-left"></i>}
      >
        Back to Markets
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl shadow-blue p-6 border border-border hover:border-primary/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text mb-2">
                  {currentMarket.title}
                </h1>
                <p className="text-text-light mb-4">
                  {currentMarket.description}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentMarket.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : currentMarket.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {t(`marketCard.status.${currentMarket.status}`)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-background/50 grid-pattern rounded-lg p-4 border border-border/50">
                <div className="text-sm font-medium text-text-light mb-1">
                  {t('marketCard.ends')}
                </div>
                <div className="text-lg font-semibold text-text">
                  {formatDate(currentMarket.endTime)}
                </div>
              </div>
              <div className="bg-background/50 grid-pattern rounded-lg p-4 border border-border/50">
                <div className="text-sm font-medium text-text-light mb-1">
                  {t('marketCard.totalPool')}
                </div>
                <div className="text-lg font-semibold text-text">
                  ${totalPool.toFixed(2)}
                </div>
              </div>
            </div>

            {currentMarket.status === 'resolved' && currentMarket.result && (
              <div className={`mb-6 p-4 rounded-lg ${
                currentMarket.result === 'yes'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa fa-check-circle"></i>
                  <h3 className="font-bold text-lg">{t('marketDetail.marketResolved')}</h3>
                </div>
                <p className="text-sm">
                  {t('marketCard.result')} <strong>{currentMarket.result.toUpperCase()}</strong>. 
                  {userBet && userBet.side === currentMarket.result 
                    ? ` ${t('marketDetail.youWon')}` 
                    : userBet 
                    ? ` ${t('marketDetail.youLost')}`
                    : ` ${t('marketDetail.noBet')}`
                  }
                </p>
              </div>
            )}

            {userBet && (
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                  {t('marketDetail.yourBet')}
                </h3>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userBet.side === 'yes'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {userBet.side.toUpperCase()}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ${userBet.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl shadow-blue p-6 border border-border hover:border-primary/30 transition-all duration-300 sticky top-6">
            <h3 className="text-lg font-bold text-text mb-4">
              {currentMarket.status === 'resolved' ? 'Market Results' : 'Place Your Bet'}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-sm font-medium text-text-light mb-1">
                  {t('marketCard.yesPool')}
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                  ${currentMarket.yesPool.toFixed(2)}
                </div>
                <div className="text-sm text-text-light">
                  {t('marketCard.odds')}: {odds.yes.toFixed(2)}x
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="text-sm font-medium text-text-light mb-1">
                  {t('marketCard.noPool')}
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">
                  ${currentMarket.noPool.toFixed(2)}
                </div>
                <div className="text-sm text-text-light">
                  {t('marketCard.odds')}: {odds.no.toFixed(2)}x
                </div>
              </div>
            </div>

            {canClaimReward() ? (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    {t('marketDetail.claimReward')}
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${((userBet!.amount / (currentMarket.result === 'yes' ? currentMarket.yesPool : currentMarket.noPool)) * totalPool).toFixed(2)}
                  </p>
                </div>
                <Button 
                  fullWidth 
                  onClick={handleClaimReward}
                  loading={claimingReward}
                  disabled={claimingReward}
                >
                  {claimingReward ? t('marketDetail.claimingReward') : t('marketDetail.claimReward')}
                </Button>
              </div>
            ) : currentMarket.status === 'active' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    {t('marketDetail.chooseSide')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        betSide === 'yes'
                          ? 'bg-green-600 text-white'
                          : 'bg-background/50 text-text-light hover:bg-background/80'
                      }`}
                      onClick={() => setBetSide('yes')}
                    >
                      YES
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        betSide === 'no'
                          ? 'bg-red-600 text-white'
                          : 'bg-background/50 text-text-light hover:bg-background/80'
                      }`}
                      onClick={() => setBetSide('no')}
                    >
                      NO
                    </button>
                  </div>
                </div>

                <div>
                  <Input
                    label={t('marketDetail.amount')}
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    error={error}
                  />
                </div>

                {betAmount && potentialReward > 0 && (
                  <div className="bg-background/50 grid-pattern p-3 rounded-lg border border-border/50">
                    <div className="text-sm text-text-light mb-1">
                      {t('marketDetail.potentialReward')}
                    </div>
                    <div className="text-lg font-bold text-text">
                      ${potentialReward.toFixed(2)}
                    </div>
                    <div className="text-xs text-text-light">
                      (Odds: {betSide === 'yes' ? odds.yes.toFixed(2) : odds.no.toFixed(2)}x)
                    </div>
                  </div>
                )}

                <div className="text-sm text-text-light mb-4">
                  {t('marketDetail.balance')}: ${user?.balance.toFixed(2) || '0.00'}
                </div>

                <Button
                  fullWidth
                  onClick={handleBet}
                  loading={placingBet}
                  disabled={placingBet || !betAmount || parseFloat(betAmount) <= 0 || !user}
                >
                  {placingBet ? t('marketDetail.placingBet') : t('marketDetail.placeBetAction')}
                </Button>
              </div>
            ) : currentMarket.status === 'pending' ? (
              <div className="text-center py-8">
                <div className="text-yellow-500 mb-4">
                  <i className="fa fa-clock-o text-4xl"></i>
                </div>
                <h3 className="font-medium text-text mb-2">
                  {t('marketDetail.marketNotActive')}
                </h3>
                <p className="text-sm text-text-light">
                  {t('marketDetail.marketNotActiveHint')}
                </p>
              </div>
            ) : currentMarket.status === 'resolved' && (!userBet || userBet.side !== currentMarket.result) ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <i className="fa fa-check-circle text-4xl"></i>
                </div>
                <h3 className="font-medium text-text mb-2">
                  {t('marketDetail.marketResolved')}
                </h3>
                <p className="text-sm text-text-light">
                  {userBet ? t('marketDetail.youLost') : t('marketDetail.noBet')}
                </p>
              </div>
            ) : null}

            {success && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm p-3 rounded-lg">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketDetailPage