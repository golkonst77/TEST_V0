"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  username: string
  role: string
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin_token")

      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setIsAuthenticated(true)
          setUser(data.user)
        } else {
          localStorage.removeItem("admin_token")
          setIsAuthenticated(false)
        }
      } else {
        localStorage.removeItem("admin_token")
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      // При ошибке сети не удаляем токен, просто считаем не авторизованным
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    setIsAuthenticated(false)
    setUser(null)
    router.push("/admin/login")
  }

  useEffect(() => {
    try {
      checkAuth()
    } catch (error) {
      console.error("Error in checkAuth effect:", error)
      setIsLoading(false)
      setIsAuthenticated(false)
    }
  }, [])

  // Перенаправление на страницу входа, если не авторизован
  useEffect(() => {
    try {
      if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
        const currentPath = window.location.pathname
        if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error in redirect effect:", error)
    }
  }, [isAuthenticated, isLoading, router])

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    checkAuth,
  }
}
