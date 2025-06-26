"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, Crown } from "lucide-react"
import Link from "next/link"

export function AdminLoginButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token")

    if (!token) {
      setIsAuthenticated(false)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(data.valid)
      } else {
        localStorage.removeItem("admin_token")
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("admin_token")
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    setIsAuthenticated(false)
    window.location.href = "/"
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        {/* Админская панель */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            asChild
            className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/admin" className="flex items-center space-x-2 px-4 py-2">
              <div className="relative">
                <Crown className="h-4 w-4 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <span className="font-semibold">Админка</span>
            </Link>
          </Button>

          {/* Tooltip */}
          {isHovered && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black text-white text-xs rounded-lg whitespace-nowrap z-50 animate-fadeIn">
              Панель администратора
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          )}
        </div>

        {/* Кнопка выхода */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="relative group hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 group-hover:animate-bounce" />
        </Button>
      </div>
    )
  }

  return (
    <div className="relative group">
      <Button
        asChild
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
      >
        <Link href="/admin/login" className="flex items-center space-x-2 px-4 py-2">
          <div className="relative">
            <Shield className="h-4 w-4 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
          </div>
          <span className="font-semibold">Вход</span>

          {/* Блестящий эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Link>
      </Button>

      {/* Подсветка */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10"></div>
    </div>
  )
}
