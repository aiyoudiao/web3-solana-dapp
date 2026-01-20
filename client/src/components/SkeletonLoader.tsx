import React from 'react'

interface SkeletonLoaderProps {
  width?: string | 'full'
  height?: string
  className?: string
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = 'full',
  height = '1rem',
  className = ''
}) => {
  const widthClass = width === 'full' ? 'w-full' : `w-[${width}]`
  
  return (
    <div 
      className={`${widthClass} h-[${height}] bg-border rounded skeleton-pulse opacity-80 transition-opacity duration-300 ${className}`}
    />
  )
}

export const MarketCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-xl shadow-md p-6 border border-border opacity-80 transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <SkeletonLoader width="70%" height="1.5rem" className="rounded-lg" />
        <SkeletonLoader width="100px" height="28px" className="rounded-full" />
      </div>
      
      <SkeletonLoader width="full" height="1rem" className="mb-4" />
      <SkeletonLoader width="80%" height="1rem" className="mb-4" />
      
      <div className="flex justify-between items-center gap-4 mb-4">
        <SkeletonLoader width="150px" height="1rem" />
        <SkeletonLoader width="80px" height="28px" className="rounded-full" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-background/50 rounded-lg p-4">
          <SkeletonLoader width="60px" height="0.875rem" className="mb-2" />
          <div className="flex justify-between items-center">
            <SkeletonLoader width="80px" height="1.25rem" className="rounded" />
            <SkeletonLoader width="60px" height="0.875rem" className="rounded" />
          </div>
        </div>
        
        <div className="bg-background/50 rounded-lg p-4">
          <SkeletonLoader width="60px" height="0.875rem" className="mb-2" />
          <div className="flex justify-between items-center">
            <SkeletonLoader width="80px" height="1.25rem" className="rounded" />
            <SkeletonLoader width="60px" height="0.875rem" className="rounded" />
          </div>
        </div>
      </div>
      
      <div className="bg-background/50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <SkeletonLoader width="100px" height="1rem" className="rounded" />
          <SkeletonLoader width="120px" height="1.5rem" className="rounded" />
        </div>
      </div>
    </div>
  )
}

export const FullScreenSkeleton: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <SkeletonLoader width="200px" height="2.5rem" className="mx-auto mb-4 rounded-lg" />
        <SkeletonLoader width="300px" height="1rem" className="mx-auto rounded" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <MarketCardSkeleton key={item} />
        ))}
      </div>
    </div>
  )
}