"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Crown, X, Settings, Calculator, FileText } from "lucide-react"
import Link from "next/link"

export function FloatingAdminButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      if (token) {
        const response = await fetch("/api/admin/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(data.valid)
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()

    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
    >
      {/* Расширенное меню */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 min-w-[220px] animate-in slide-in-from-bottom-2 duration-200">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-700 mb-3 px-2">
              {isAuthenticated ? "Панель администратора" : "Вход в систему"}
            </div>

            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start hover:bg-blue-50">
                  <Link href="/admin">
                    <Crown className="h-4 w-4 mr-3 text-purple-600" />
                    Главная админки
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start hover:bg-blue-50">
                  <Link href="/admin/calculator">
                    <Calculator className="h-4 w-4 mr-3 text-green-600" />
                    Калькулятор
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start hover:bg-blue-50">
                  <Link href="/admin/content">
                    <FileText className="h-4 w-4 mr-3 text-blue-600" />
                    Контент
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start hover:bg-blue-50">
                  <Link href="/admin/settings">
                    <Settings className="h-4 w-4 mr-3 text-orange-600" />
                    Настройки
                  </Link>
                </Button>
                <hr className="my-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:bg-red-50"
                  onClick={() => {
                    localStorage.removeItem("admin_token")
                    setIsAuthenticated(false)
                    setIsExpanded(false)
                  }}
                >
                  <X className="h-4 w-4 mr-3" />
                  Выйти
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm" className="w-full justify-start hover:bg-blue-50">
                <Link href="/admin/login">
                  <Shield className="h-4 w-4 mr-3 text-blue-600" />
                  Войти в админку
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Основная кнопка */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl
          ${
            isAuthenticated
              ? "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700"
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700"
          }
          ${isExpanded ? "rotate-45" : ""}
        `}
      >
        {isExpanded ? (
          <X className="h-6 w-6 text-white" />
        ) : isAuthenticated ? (
          <div className="relative">
            <Crown className="h-6 w-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <Shield className="h-6 w-6 text-white" />
        )}

        {/* Пульсирующее кольцо */}
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75"></div>
      </Button>

      {/* Подсказка */}
      {!isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {isAuthenticated ? "Админка" : "Вход в админку"}
        </div>
      )}
    </div>
  )
}
