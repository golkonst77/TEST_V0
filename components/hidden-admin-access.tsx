"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"

export function HiddenAdminAccess() {
  const [hoverTime, setHoverTime] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [login, setLogin] = useState("admin")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError("")

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: login, password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.token) {
          localStorage.setItem("admin_token", data.token)
          setLogin("")
          setPassword("")
          setShowDialog(false)
          // Сразу перенаправляем в админку
          window.location.href = "/admin"
        } else {
          setLoginError(data.message || "Ошибка входа")
        }
      } else {
        const errorData = await response.json()
        setLoginError(errorData.message || "Ошибка входа")
      }
    } catch (error) {
      setLoginError("Ошибка соединения")
    } finally {
      setIsLoggingIn(false)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isHovering) {
      interval = setInterval(() => {
        setHoverTime(prev => {
          if (prev >= 6) {
            setShowDialog(true)
            setIsHovering(false)
            setHoverTime(0)
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    } else {
      setHoverTime(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovering])



  return (
    <>
      {/* Скрытая область в правом нижнем углу */}
      <div
        className="fixed bottom-0 right-0 w-8 h-8 z-50 cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false)
          setHoverTime(0)
        }}
        title="Скрытая область"
      >
        {/* Индикатор прогресса */}
        {isHovering && hoverTime > 0 && (
          <div className="absolute bottom-0 right-0 w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="rgb(99, 102, 241)"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - hoverTime / 6)}`}
                className="transition-all duration-100"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Диалог входа в админку */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-blue-600" />
              Вход в админку
            </DialogTitle>
            <DialogDescription>
              Введите логин и пароль для входа в административную панель
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Введите логин"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
            </div>
            {loginError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {loginError}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-3" />
                  Войти в админку
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
} 