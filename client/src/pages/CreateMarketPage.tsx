import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import ErrorMessage from '../components/ErrorMessage'
import { useTranslation } from 'react-i18next'

const CreateMarketPage: React.FC = () => {
  const navigate = useNavigate()
  const { createMarket, creatingMarket, user } = useAppStore()
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endTime: '',
    yesPool: '',
    noPool: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = t('createMarket.form.errors.titleRequired')
    } else if (formData.title.length > 100) {
      newErrors.title = t('createMarket.form.errors.titleTooLong')
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('createMarket.form.errors.descriptionRequired')
    } else if (formData.description.length > 500) {
      newErrors.description = t('createMarket.form.errors.descriptionTooLong')
    }
    
    if (!formData.endTime) {
      newErrors.endTime = t('createMarket.form.errors.endTimeRequired')
    } else {
      const selectedTime = new Date(formData.endTime).getTime()
      const now = Date.now()
      if (selectedTime <= now) {
        newErrors.endTime = t('createMarket.form.errors.endTimeFuture')
      }
    }
    
    if (formData.yesPool && isNaN(parseFloat(formData.yesPool))) {
      newErrors.yesPool = t('createMarket.form.errors.invalidNumber')
    }
    
    if (formData.noPool && isNaN(parseFloat(formData.noPool))) {
      newErrors.noPool = t('createMarket.form.errors.invalidNumber')
    }
    
    const yesPoolAmount = parseFloat(formData.yesPool) || 0
    const noPoolAmount = parseFloat(formData.noPool) || 0
    
    if ((yesPoolAmount > 0 || noPoolAmount > 0) && user) {
      if (yesPoolAmount + noPoolAmount > user.balance) {
        newErrors.yesPool = t('createMarket.form.errors.insufficientBalance')
        newErrors.noPool = t('createMarket.form.errors.insufficientBalance')
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitError('')
    setSubmitSuccess('')
    
    try {
      await createMarket({
        title: formData.title.trim(),
        description: formData.description.trim(),
        endTime: new Date(formData.endTime).getTime(),
        yesPool: parseFloat(formData.yesPool) || 0,
        noPool: parseFloat(formData.noPool) || 0
      })
      
      setSubmitSuccess(t('createMarket.form.success'))
      
      // Redirect to markets page after 2 seconds
      setTimeout(() => {
        navigate('/markets')
      }, 2000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create market')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Set minimum date to current time
  const getMinDateTime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/markets')}
        className="mb-6"
        icon={<i className="fa fa-arrow-left"></i>}
      >
        {t('marketDetail.backToMarkets')}
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-2">
          {t('createMarket.title')}
        </h1>
        <p className="text-text-light mb-8">
          {t('createMarket.subtitle')}
        </p>

        <div className="bg-surface rounded-xl shadow-blue p-8 border border-border hover:border-primary/30 transition-all duration-300">
          {submitError && (
            <ErrorMessage message={submitError} className="mb-6" />
          )}
          
          {submitSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg mb-6">
              {t('createMarket.form.success')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label={t('createMarket.form.title')}
                placeholder={t('createMarket.form.titlePlaceholder')}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                maxLength={100}
              />
              <div className="text-xs text-text-light mt-1 text-right">
                {formData.title.length}/100
              </div>
            </div>

            <div>
              <Textarea
                label={t('createMarket.form.description')}
                placeholder={t('createMarket.form.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={errors.description}
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-text-light mt-1 text-right">
                {formData.description.length}/500
              </div>
            </div>

            <div>
              <Input
                label={t('createMarket.form.endTime')}
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                error={errors.endTime}
                min={getMinDateTime()}
              />
              <p className="text-xs text-text-light mt-1">
                {t('createMarket.form.endTimeHint')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label={t('createMarket.form.yesPool')}
                  type="number"
                  placeholder="0.00"
                  value={formData.yesPool}
                  onChange={(e) => handleInputChange('yesPool', e.target.value)}
                  error={errors.yesPool}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Input
                  label={t('createMarket.form.noPool')}
                  type="number"
                  placeholder="0.00"
                  value={formData.noPool}
                  onChange={(e) => handleInputChange('noPool', e.target.value)}
                  error={errors.noPool}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {user && (
              <div className="text-sm text-text-light">
                {t('createMarket.form.yourBalance')}: ${user.balance.toFixed(2)}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={creatingMarket}
                disabled={creatingMarket || !user}
              >
                {creatingMarket ? t('createMarket.form.creating') : t('createMarket.form.create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateMarketPage