"use client"

import { useState, useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export default function DebugPage() {
  const { isAuthenticated, isLoading, user } = useAdminAuth()
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedToken = localStorage.getItem("admin_token")
    setToken(storedToken)
  }, [])

  if (!mounted) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Отладка аутентификации</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h2 className="font-semibold text-blue-900 mb-2">Статус хука:</h2>
            <p className="text-blue-700">isLoading: {isLoading ? "true" : "false"}</p>
            <p className="text-blue-700">isAuthenticated: {isAuthenticated ? "true" : "false"}</p>
            <p className="text-blue-700">user: {user ? JSON.stringify(user) : "null"}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-md">
            <h2 className="font-semibold text-green-900 mb-2">localStorage:</h2>
            <p className="text-green-700">Токен: {token ? token.substring(0, 50) + "..." : "Нет токена"}</p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                localStorage.removeItem("admin_token")
                setToken(null)
                window.location.reload()
              }}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Очистить токен
            </button>
            <a 
              href="/admin/login"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
            >
              Страница входа
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
