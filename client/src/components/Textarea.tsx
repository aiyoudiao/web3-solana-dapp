import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <div className={`space-y-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:ring-offset-gray-900 transition-colors resize-none ${
          error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Textarea