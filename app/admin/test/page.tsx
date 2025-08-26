"use client"

import { useState, useEffect } from "react"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Тест админки</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h2 className="font-semibold text-blue-900 mb-2">Статус:</h2>
            <p className="text-blue-700">✅ Страница загружается корректно</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md">
            <h2 className="font-semibold text-green-900 mb-2">Маршрутизация:</h2>
            <p className="text-green-700">✅ /admin/test работает</p>
          </div>
          
          <div className="flex space-x-2">
            <a 
              href="/admin/login"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
            >
              Страница входа
            </a>
            <a 
              href="/admin"
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-center hover:bg-gray-700 transition-colors"
            >
              Главная админки
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
