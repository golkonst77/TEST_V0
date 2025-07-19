/**
 * @file: recaptcha.tsx
 * @description: Компонент reCAPTCHA для защиты от ботов
 * @dependencies: react-google-recaptcha
 * @created: 2024-12-19
 */

'use client'

import { useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface ReCAPTCHAProps {
  onVerify: (token: string | null) => void
  className?: string
}

export function ReCAPTCHAComponent({ onVerify, className = '' }: ReCAPTCHAProps) {
  // Временно отключаем reCAPTCHA
  useEffect(() => {
    // Автоматически устанавливаем токен как "disabled" для пропуска проверки
    onVerify('disabled')
  }, [onVerify])

  return (
    <div className={`recaptcha-placeholder ${className}`}>
      <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded border">
        reCAPTCHA временно отключена
      </div>
    </div>
  )
}

export default ReCAPTCHAComponent 