/**
 * @file: auth-form.tsx
 * @description: Универсальная форма аутентификации
 * @dependencies: use-auth.ts, types.ts
 * @created: 2024-12-19
 */

'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/use-auth'
import { ReCAPTCHAComponent } from './recaptcha'
import type { AuthMode, LoginFormData, RegisterFormData } from '../lib/types'

interface AuthFormProps {
  mode: AuthMode
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

export function AuthForm({ mode, onSuccess, onError, className = '' }: AuthFormProps) {
  const { signIn, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<LoginFormData | RegisterFormData>({
    email: '',
    password: '',
    ...(mode === 'register' && {
      confirmPassword: '',
      full_name: '',
      phone: '',
      question: ''
    })
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    if (mode === 'register') {
      const registerData = formData as RegisterFormData
      
      if (!registerData.full_name) {
        newErrors.full_name = 'Имя обязательно'
      }

      if (!registerData.phone) {
        newErrors.phone = 'Телефон обязателен'
      }

      if (registerData.password !== registerData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }
    }

    if (!recaptchaToken) {
      newErrors.recaptcha = 'Пожалуйста, подтвердите, что вы не робот'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      let response

      if (mode === 'login') {
        response = await signIn(formData.email, formData.password)
      } else if (mode === 'register') {
        const registerData = formData as RegisterFormData
        response = await signUp(registerData)
      }

      if (response?.success) {
        onSuccess?.()
      } else {
        const errorMessage = response?.error || 'Произошла ошибка'
        setErrors({ general: errorMessage })
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = 'Произошла ошибка при обработке запроса'
      setErrors({ general: errorMessage })
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {errors.general && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">
          {errors.general}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Введите ваш email"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Пароль
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Введите пароль"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {mode === 'register' && (
        <>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={(formData as RegisterFormData).confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              ФИО
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={(formData as RegisterFormData).full_name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Введите ваше полное имя"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={(formData as RegisterFormData).phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Ваш вопрос (необязательно)
            </label>
            <textarea
              id="question"
              name="question"
              value={(formData as RegisterFormData).question}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Опишите ваш вопрос или задачу"
            />
          </div>
        </>
      )}

      <ReCAPTCHAComponent
        onVerify={setRecaptchaToken}
        className="flex justify-center"
      />
      {errors.recaptcha && <p className="text-red-500 text-xs text-center">{errors.recaptcha}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Обработка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>
  )
} 