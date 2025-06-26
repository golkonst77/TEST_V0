"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export function AdminLoginButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    return <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <Settings className="h-4 w-4 mr-2" />
            Админка
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/admin/login">
        <LogIn className="h-4 w-4 mr-2" />
        Вход
      </Link>
    </Button>
  )
}
