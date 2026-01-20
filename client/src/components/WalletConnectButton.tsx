import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

// 模拟钱包状态接口
interface WalletState {
  connected: boolean
  publicKey?: string
  balance?: number
  walletName?: string
}

const WalletConnectButton: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({ connected: false })
  const [isConnecting, setIsConnecting] = useState(false)
  const { t } = useTranslation()

  // 模拟连接钱包的函数
  const connectWallet = async () => {
    setIsConnecting(true)
    
    try {
      // 模拟连接延迟
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟成功连接到Phantom钱包
      const mockWallet: WalletState = {
        connected: true,
        publicKey: '2p9oM768DfYvXrUV3cH9j8qN3wGzK5tF7eL1aP4sR6',
        balance: 2.45,
        walletName: 'Phantom'
      }
      
      setWallet(mockWallet)
      console.log('Wallet connected:', mockWallet)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert(t('wallet.connectionFailed'))
    } finally {
      setIsConnecting(false)
    }
  }

  // 断开钱包连接
  const disconnectWallet = () => {
    setWallet({ connected: false })
    console.log('Wallet disconnected')
  }

  // 格式化公钥显示
  const formatPublicKey = (key: string) => {
    if (!key) return ''
    return `${key.slice(0, 6)}...${key.slice(-4)}`
  }

  if (wallet.connected && wallet.publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium">
          {wallet.walletName}
        </div>
        <div className="text-text-light text-sm">
          {formatPublicKey(wallet.publicKey)}
        </div>
        {wallet.balance !== undefined && (
          <div className="bg-secondary px-3 py-1 rounded-lg text-sm font-medium">
            {wallet.balance} SOL
          </div>
        )}
        <button
          onClick={disconnectWallet}
          className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
        >
          {t('wallet.disconnect')}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-medium hover:from-primary/90 hover:to-purple-600/90 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
    >
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {t('wallet.connecting')}
        </>
      ) : (
        <>
          <i className="fa fa-wallet"></i>
          {t('wallet.connect')}
        </>
      )}
    </button>
  )
}

export default WalletConnectButton