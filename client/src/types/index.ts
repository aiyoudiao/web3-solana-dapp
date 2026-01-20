// 市场状态类型
export type MarketStatus = 'pending' | 'active' | 'resolved'

// 市场数据类型
export type Market = {
  id: string // 市场唯一标识
  title: string // 市场标题
  description: string // 市场描述
  endTime: number // 结束时间戳
  status: MarketStatus // 市场状态
  yesPool: number // 支持方奖池金额
  noPool: number // 反对方奖池金额
  result?: 'yes' | 'no' // 结算结果（仅在已结算市场中存在）
}

// 用户数据类型
export type User = {
  address: string // 用户地址
  balance: number // 用户余额
}

// 投注数据类型
export type Bet = {
  marketId: string // 市场ID
  side: 'yes' | 'no' // 投注方向
  amount: number // 投注金额
}

// 创建市场的数据类型
export type CreateMarketData = {
  title: string // 市场标题
  description: string // 市场描述
  endTime: number // 结束时间戳
  yesPool?: number // 初始支持方奖池（可选）
  noPool?: number // 初始反对方奖池（可选）
}