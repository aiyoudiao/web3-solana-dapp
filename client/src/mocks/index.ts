import { Market, User, Bet, CreateMarketData } from '../types'
import { generateMarkets } from '../utils/dataGenerator'
import i18n from '../i18n'

// Mock data
const mockUser: User = {
  address: '0x7a5BC28B694a1B5c0C6646Be8c3Ee1C221E7fB5b',
  balance: 1000,
}

// 语言市场数据缓存
const languageMarketsCache: { [key: string]: Market[] } = {}

// 生成指定语言的市场数据
const getMarketsByLanguage = (lang: string): Market[] => {
  if (!languageMarketsCache[lang]) {
    languageMarketsCache[lang] = generateMarkets(30, lang as 'en' | 'zh')
  }
  return languageMarketsCache[lang]
}

const mockBets: Bet[] = [
  {
    marketId: '1',
    side: 'yes',
    amount: 100,
  },
  {
    marketId: '3',
    side: 'yes',
    amount: 200,
  },
]

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock APIs
export const getUser = async (): Promise<User> => {
  await delay(300)
  return { ...mockUser }
}

export const getMarkets = async (): Promise<Market[]> => {
  await delay(500)
  const currentLang = i18n.language || 'en'
  const markets = getMarketsByLanguage(currentLang)
  return [...markets]
}

export const getMarketById = async (id: string): Promise<Market> => {
  await delay(300)
  const currentLang = i18n.language || 'en'
  const markets = getMarketsByLanguage(currentLang)
  const market = markets.find(m => m.id === id)
  if (!market) {
    throw new Error('Market not found')
  }
  return { ...market }
}

export const createMarket = async (data: CreateMarketData): Promise<Market> => {
  await delay(800)
  
  const newMarket: Market = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    endTime: data.endTime,
    status: 'pending',
    yesPool: data.yesPool || 0,
    noPool: data.noPool || 0,
  }
  
  const currentLang = i18n.language || 'en'
  const markets = getMarketsByLanguage(currentLang)
  markets.push(newMarket)
  return { ...newMarket }
}

export const placeBet = async (marketId: string, side: 'yes' | 'no', amount: number): Promise<void> => {
  await delay(600)
  
  const currentLang = i18n.language || 'en'
  const markets = getMarketsByLanguage(currentLang)
  const market = markets.find(m => m.id === marketId)
  if (!market) {
    throw new Error('Market not found')
  }
  
  if (market.status !== 'active') {
    throw new Error('Market is not active')
  }
  
  if (mockUser.balance < amount) {
    throw new Error('Insufficient balance')
  }
  
  // Update market pools
  if (side === 'yes') {
    market.yesPool += amount
  } else {
    market.noPool += amount
  }
  
  // Update user balance
  mockUser.balance -= amount
  
  // Record the bet
  mockBets.push({ marketId, side, amount })
}

export const getUserBets = async (): Promise<Bet[]> => {
  await delay(400)
  return [...mockBets]
}

export const claimReward = async (marketId: string): Promise<number> => {
  await delay(700)
  
  const market = mockMarkets.find(m => m.id === marketId)
  if (!market || market.status !== 'resolved' || !market.result) {
    throw new Error('Market not resolved yet')
  }
  
  const userBet = mockBets.find(b => b.marketId === marketId && b.side === market.result)
  if (!userBet) {
    throw new Error('No winning bet found')
  }
  
  // Calculate reward
  const totalPool = market.yesPool + market.noPool
  const winnerPool = market.result === 'yes' ? market.yesPool : market.noPool
  const reward = (userBet.amount / winnerPool) * totalPool
  
  // Update user balance
  mockUser.balance += reward
  
  // Remove the bet (to prevent double claiming)
  const betIndex = mockBets.findIndex(b => b.marketId === marketId && b.side === market.result)
  if (betIndex > -1) {
    mockBets.splice(betIndex, 1)
  }
  
  return reward
}

// Utility function to calculate odds
export const calculateOdds = (yesPool: number, noPool: number): { yes: number; no: number } => {
  const total = yesPool + noPool
  if (total === 0) return { yes: 1, no: 1 }
  
  return {
    yes: total / yesPool,
    no: total / noPool,
  }
}