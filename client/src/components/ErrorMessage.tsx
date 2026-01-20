import React from 'react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <i className="fa fa-exclamation-circle text-red-500 text-lg"></i>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
            Error
          </h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              <i className="fa fa-refresh"></i>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage