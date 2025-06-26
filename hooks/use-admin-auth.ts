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
      localStorage.removeItem("admin_token")
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
    checkAuth()
  }, [])

  // Перенаправление на страницу входа, если не авторизован
  useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
      const currentPath = window.location.pathname
      if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
        router.push("/admin/login")
      }
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
