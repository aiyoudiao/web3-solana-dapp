import { Market, MarketStatus } from '../types'

/**
 * 数据生成器工具
 * 用于生成模拟的预测市场数据，支持中英文国际化
 */

// 英文预测市场主题
const enTopics = [
  'Will Bitcoin reach $100,000 by end of 2024?',
  'Will Ethereum switch to Proof of Stake in 2024?',
  'Will Solana transaction fees remain below $0.01?',
  'Will Apple release a VR headset in 2024?',
  'Will AI surpass human performance in chess by 2025?',
  'Will the US economy enter a recession in 2024?',
  'Will Tesla deliver more than 2 million cars in 2024?',
  'Will Google launch a quantum computer by 2026?',
  'Will renewable energy account for 50% of global energy by 2030?',
  'Will a major tech company acquire Twitter in 2024?',
  'Will Elon Musk step down as CEO of Tesla in 2024?',
  'Will the first human land on Mars by 2030?',
  'Will NFT market cap exceed $100 billion by 2025?',
  'Will Google be broken up by antitrust regulators by 2026?',
  'Will autonomous cars be legal on all US roads by 2027?',
  'Will Amazon reach $2 trillion market cap by 2025?',
  'Will Microsoft acquire another major gaming company by 2025?',
  'Will Bitcoin ETF be approved by SEC by end of 2024?',
  'Will global temperature increase by 1.5°C by 2030?',
  'Will electric vehicles make up 30% of new car sales by 2025?'
]

// 中文预测市场主题
const zhTopics = [
  '比特币会在2024年底前达到10万美元吗？',
  '以太坊会在2024年切换到权益证明机制吗？',
  'Solana的交易费用会保持在0.01美元以下吗？',
  '苹果会在2024年发布VR头显吗？',
  'AI会在2025年前在国际象棋上超越人类表现吗？',
  '美国经济会在2024年进入衰退吗？',
  '特斯拉会在2024年交付超过200万辆汽车吗？',
  '谷歌会在2026年前推出量子计算机吗？',
  '可再生能源会在2030年前占全球能源的50%吗？',
  '一家主要科技公司会在2024年收购Twitter吗？',
  '埃隆·马斯克会在2024年辞去特斯拉CEO职务吗？',
  '人类会在2030年前首次登陆火星吗？',
  'NFT市场规模会在2025年前超过1000亿美元吗？',
  '谷歌会在2026年前被反垄断监管机构拆分吗？',
  '自动驾驶汽车会在2027年前在美国所有道路上合法吗？',
  '亚马逊会在2025年前达到2万亿美元市值吗？',
  '微软会在2025年前收购另一家主要游戏公司吗？',
  'SEC会在2024年底前批准比特币ETF吗？',
  '全球气温会在2030年前上升1.5°C吗？',
  '电动汽车会在2025年前占新车销量的30%吗？'
]

// 英文描述模板
const enDescriptions = [
  'This prediction market will resolve to YES if {{topic}} before {{date}}.',
  'This market resolves to YES if {{topic}} by the end of {{year}}.',
  'Will {{topic}}? This market resolves when official data is released.',
  'This market resolves to YES if {{topic}} according to official sources.',
  'This prediction market will resolve based on official announcements regarding {{topic}}.'
]

// 中文描述模板
const zhDescriptions = [
  '如果在{{date}}之前{{topic}}，这个预测市场将结算为YES。',
  '如果到{{year}}年底{{topic}}，这个市场将结算为YES。',
  '{{topic}}？这个市场将在官方数据发布后结算。',
  '根据官方来源，如果{{topic}}，这个市场将结算为YES。',
  '这个预测市场将根据有关{{topic}}的官方公告进行结算。'
]

/**
 * 生成随机日期时间戳
 * @param minDays 最小天数
 * @param maxDays 最大天数
 * @returns 时间戳
 */
const getRandomDate = (minDays: number, maxDays: number): number => {
  const now = Date.now()
  const min = minDays * 24 * 60 * 60 * 1000
  const max = maxDays * 24 * 60 * 60 * 1000
  return now + Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机市场状态
 * @returns 市场状态
 */
const getRandomStatus = (): MarketStatus => {
  const rand = Math.random()
  if (rand < 0.3) return 'pending'  // 30% 概率为待开始状态
  if (rand < 0.8) return 'active'   // 50% 概率为进行中状态
  return 'resolved'                 // 20% 概率为已结算状态
}

/**
 * 生成随机结算结果
 * @returns 结算结果（仅当状态为resolved时使用）
 */
const getRandomResult = (): 'yes' | 'no' | undefined => {
  return Math.random() < 0.5 ? 'yes' : 'no'
}

/**
 * 生成随机金额
 * @param min 最小金额
 * @param max 最大金额
 * @returns 金额（保留两位小数）
 */
const getRandomAmount = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

/**
 * 格式化日期
 * @param timestamp 时间戳
 * @param lang 语言
 * @returns 格式化后的日期字符串
 */
const formatDate = (timestamp: number, lang: 'en' | 'zh'): string => {
  const date = new Date(timestamp)
  if (lang === 'en') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

/**
 * 生成单个市场数据
 * @param lang 语言
 * @param index 索引
 * @returns 市场数据
 */
const generateSingleMarket = (lang: 'en' | 'zh', index: number): Market => {
  const topics = lang === 'en' ? enTopics : zhTopics
  const descriptions = lang === 'en' ? enDescriptions : zhDescriptions
  
  // 确保有足够的主题，如果不够则循环使用
  const topicIndex = index % topics.length
  const topic = topics[topicIndex]
  
  // 随机选择描述模板
  const descriptionTemplate = descriptions[Math.floor(Math.random() * descriptions.length)]
  const endTime = getRandomDate(1, 90)  // 生成1-90天后的随机日期
  const status = getRandomStatus()
  const result = status === 'resolved' ? getRandomResult() : undefined
  
  // 根据模板生成描述，替换占位符
  let description = descriptionTemplate
    .replace('{{topic}}', topic.replace(/[?？]$/, ''))  // 移除主题末尾的问号
    .replace('{{date}}', formatDate(endTime, lang))
    .replace('{{year}}', new Date(endTime).getFullYear().toString())
  
  // 生成奖池金额
  const yesPool = getRandomAmount(100, 10000)
  const noPool = getRandomAmount(100, 10000)
  
  return {
    id: `market-${lang}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    title: topic,
    description,
    endTime,
    status,
    yesPool,
    noPool,
    result
  }
}

/**
 * 生成多个市场数据
 * @param count 市场数量
 * @param lang 语言（默认为英文）
 * @returns 市场数据数组
 */
export const generateMarkets = (count: number, lang: 'en' | 'zh' = 'en'): Market[] => {
  const markets: Market[] = []
  
  for (let i = 0; i < count; i++) {
    markets.push(generateSingleMarket(lang, i))
  }
  
  // 按创建时间倒序排序（新创建的市场排在前面）
  return markets.sort((a, b) => {
    // 从ID中提取时间戳进行排序
    const timeA = parseInt(a.id.split('-').pop() || '0')
    const timeB = parseInt(b.id.split('-').pop() || '0')
    return timeB - timeA
  })
}

/**
 * 生成混合语言的市场数据
 * @param count 市场总数
 * @returns 混合语言的市场数据数组
 */
export const generateMixedLanguageMarkets = (count: number): Market[] => {
  const enCount = Math.floor(count / 2)  // 英文市场数量
  const zhCount = count - enCount        // 中文市场数量
  
  const enMarkets = generateMarkets(enCount, 'en')
  const zhMarkets = generateMarkets(zhCount, 'zh')
  
  // 合并并按结束时间排序
  return [...enMarkets, ...zhMarkets].sort((a, b) => a.endTime - b.endTime)
}