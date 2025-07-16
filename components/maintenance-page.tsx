/**
 * @file: maintenance-page.tsx
 * @description: Компонент страницы технического обслуживания
 * @dependencies: React
 * @created: 2025-01-07
 */

import { useEffect, useState } from "react"
import { Wrench, Clock, Phone, Mail } from "lucide-react"

export function MaintenancePage() {
  const [settings, setSettings] = useState({ phone: '', email: '', telegram: '', vk: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Иконка */}
        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Wrench className="w-10 h-10 text-blue-600" />
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold mb-4">Сайт на обслуживании</h1>
        <p className="text-gray-600 mb-6">Мы временно недоступны. Скоро вернемся!</p>

        {/* Время работы */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Время работы</span>
          </div>
          <p className="text-sm text-gray-600">
            Пн-Пт: 9:00 - 18:00<br />
            Сб: 10:00 - 15:00<br />
            Вс: Выходной
          </p>
        </div>

        {/* Контакты */}
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <Phone className="w-4 h-4 text-gray-500 mr-2" />
            <a 
              href={`tel:${settings.phone?.replace(/\s/g, '') || ''}`} 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {settings.phone || 'Телефон' }
            </a>
          </div>
          
          <div className="flex items-center justify-center">
            <Mail className="w-4 h-4 text-gray-500 mr-2" />
            <a 
              href={`mailto:${settings.email || ''}`} 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {settings.email || 'Email'}
            </a>
          </div>
        </div>

        {/* Социальные сети */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Следите за обновлениями</p>
          <div className="flex justify-center space-x-4">
            <a 
              href={settings.telegram || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Telegram
            </a>
            <a 
              href={settings.vk || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              VK
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 