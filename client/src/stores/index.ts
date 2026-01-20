import { create } from 'zustand'
import { Market, User, Bet } from '../types'
import { 
  getUser, 
  getMarkets, 
  getMarketById, 
  createMarket as createMarketAPI,
  placeBet as placeBetAPI,
  getUserBets,
  claimReward as claimRewardAPI,
  calculateOdds
} from '../mocks'

interface AppState {
  // User state
  user: User | null
  userLoading: boolean
  userError: string | null
  
  // Markets state
  markets: Market[]
  marketsLoading: boolean
  marketsError: string | null
  
  // Current market
  currentMarket: Market | null
  currentMarketLoading: boolean
  currentMarketError: string | null
  
  // User bets
  userBets: Bet[]
  betsLoading: boolean
  betsError: string | null
  
  // UI state
  creatingMarket: boolean
  placingBet: boolean
  claimingReward: boolean
  
  // Actions
  fetchUser: () => Promise<void>
  fetchMarkets: () => Promise<void>
  fetchMarketById: (id: string) => Promise<void>
  createMarket: (data: {
    title: string
    description: string
    endTime: number
    yesPool?: number
    noPool?: number
  }) => Promise<void>
  placeBet: (marketId: string, side: 'yes' | 'no', amount: number) => Promise<void>
  fetchUserBets: () => Promise<void>
  claimReward: (marketId: string) => Promise<number>
  getOdds: (market: Market) => { yes: number; no: number }
  resetCurrentMarket: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  userLoading: false,
  userError: null,
  
  markets: [],
  marketsLoading: false,
  marketsError: null,
  
  currentMarket: null,
  currentMarketLoading: false,
  currentMarketError: null,
  
  userBets: [],
  betsLoading: false,
  betsError: null,
  
  creatingMarket: false,
  placingBet: false,
  claimingReward: false,
  
  // Actions
  /**
   * 获取用户信息
   */
  fetchUser: async () => {
    set({ userLoading: true, userError: null })
    try {
      const user = await getUser()
      set({ user, userLoading: false })
    } catch (error) {
      set({ userError: error instanceof Error ? error.message : '获取用户信息失败', userLoading: false })
    }
  },
  
  /**
   * 获取市场列表
   */
  fetchMarkets: async () => {
    set({ marketsLoading: true, marketsError: null })
    try {
      const markets = await getMarkets()
      set({ markets, marketsLoading: false })
    } catch (error) {
      set({ marketsError: error instanceof Error ? error.message : '获取市场列表失败', marketsLoading: false })
    }
  },
  
  /**
   * 根据ID获取市场详情
   * @param id 市场ID
   */
  fetchMarketById: async (id: string) => {
    set({ currentMarketLoading: true, currentMarketError: null })
    try {
      const market = await getMarketById(id)
      set({ currentMarket: market, currentMarketLoading: false })
    } catch (error) {
      set({ currentMarketError: error instanceof Error ? error.message : '获取市场详情失败', currentMarketLoading: false })
    }
  },
  
  /**
   * 创建市场
   * @param data 市场数据
   */
  createMarket: async (data) => {
    set({ creatingMarket: true })
    try {
      const newMarket = await createMarketAPI(data)
      set(state => ({ 
        markets: [...state.markets, newMarket],
        creatingMarket: false 
      }))
    } catch (error) {
      set({ creatingMarket: false })
      throw error
    }
  },
  
  /**
   * 下注
   * @param marketId 市场ID
   * @param side 投注方向
   * @param amount 投注金额
   */
  placeBet: async (marketId: string, side: 'yes' | 'no', amount: number) => {
    set({ placingBet: true })
    try {
      await placeBetAPI(marketId, side, amount)
      
      // 乐观更新UI
      set(state => {
        const updatedMarkets = state.markets.map(market => {
          if (market.id === marketId) {
            return {
              ...market,
              yesPool: side === 'yes' ? market.yesPool + amount : market.yesPool,
              noPool: side === 'no' ? market.noPool + amount : market.noPool
            }
          }
          return market
        })
        
        const updatedCurrentMarket = state.currentMarket && state.currentMarket.id === marketId
          ? {
              ...state.currentMarket,
              yesPool: side === 'yes' ? state.currentMarket.yesPool + amount : state.currentMarket.yesPool,
              noPool: side === 'no' ? state.currentMarket.noPool + amount : state.currentMarket.noPool
            }
          : state.currentMarket
        
        const updatedUser = state.user ? { ...state.user, balance: state.user.balance - amount } : null
        
        return {
          markets: updatedMarkets,
          currentMarket: updatedCurrentMarket,
          user: updatedUser,
          placingBet: false
        }
      })
      
      // 获取更新后的投注列表
      await get().fetchUserBets()
    } catch (error) {
      set({ placingBet: false })
      throw error
    }
  },
  
  /**
   * 获取用户投注列表
   */
  fetchUserBets: async () => {
    set({ betsLoading: true, betsError: null })
    try {
      const bets = await getUserBets()
      set({ userBets: bets, betsLoading: false })
    } catch (error) {
      set({ betsError: error instanceof Error ? error.message : '获取投注列表失败', betsLoading: false })
    }
  },
  
  /**
   * 领取奖励
   * @param marketId 市场ID
   * @returns 奖励金额
   */
  claimReward: async (marketId: string) => {
    set({ claimingReward: true })
    try {
      const reward = await claimRewardAPI(marketId)
      
      // 更新用户余额
      set(state => ({
        user: state.user ? { ...state.user, balance: state.user.balance + reward } : null,
        claimingReward: false
      }))
      
      // 获取更新后的投注列表
      await get().fetchUserBets()
      
      return reward
    } catch (error) {
      set({ claimingReward: false })
      throw error
    }
  },
  
  /**
   * 计算赔率
   * @param market 市场数据
   * @returns 赔率对象 {yes: number, no: number}
   */
  getOdds: (market: Market) => {
    return calculateOdds(market.yesPool, market.noPool)
  },
  
  /**
   * 重置当前市场
   */
  resetCurrentMarket: () => {
    set({ currentMarket: null, currentMarketError: null })
  }
}))