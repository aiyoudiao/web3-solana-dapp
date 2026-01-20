import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}></div>
      {text && (
        <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
      )}
    </div>
  )
}

export default LoadingSpinner