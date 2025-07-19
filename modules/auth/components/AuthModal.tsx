"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, FileText, Loader2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import type { LoginCredentials, RegisterCredentials } from "../types/auth"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)
  
  const { login, register } = useAuth()

  const validateEmail = (v: string) => /.+@.+\..+/.test(v)
  const validatePassword = (v: string) => v.length >= 6

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    const newErrors: Record<string, string> = {}
    if (!validateEmail(email)) newErrors.email = "Некорректный email"
    if (!validatePassword(password)) newErrors.password = "Пароль должен быть не менее 6 символов"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const credentials: LoginCredentials = { email, password }
    const result = await login(credentials)
    
    if (result.success) {
      onOpenChange(false)
      window.location.href = "/lk"
    } else {
      setErrors({ general: result.error || "Ошибка входа" })
    }
    
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    const newErrors: Record<string, string> = {}
    if (!validateEmail(email)) newErrors.email = "Некорректный email"
    if (!validatePassword(password)) newErrors.password = "Пароль должен быть не менее 6 символов"
    if (!name.trim()) newErrors.name = "Имя обязательно"
    if (!phone.trim()) newErrors.phone = "Телефон обязателен"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const credentials: RegisterCredentials = {
      email,
      password,
      name,
      phone,
      question
    }
    
    const result = await register(credentials)
    
    if (result.success) {
      onOpenChange(false)
      window.location.href = "/lk"
    } else {
      setErrors({ general: result.error || "Ошибка регистрации" })
    }
    
    setLoading(false)
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setPhone("")
    setQuestion("")
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl shadow-2xl border bg-white dark:bg-zinc-900">
        <Tabs value={tab} onValueChange={(value) => { setTab(value); resetForm() }} className="w-full">
          <TabsList className="flex w-full">
            <TabsTrigger value="login" className="flex-1">Вход</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">Регистрация</TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    autoComplete="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@email.com" 
                    className={errors.email ? "border-red-500" : ""} 
                  />
                  {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                </div>
                
                <div>
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Пароль
                  </Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    autoComplete="current-password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••" 
                    className={errors.password ? "border-red-500" : ""} 
                  />
                  {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Войти
                </Button>
                
                {errors.general && (
                  <div className="text-xs text-red-500 text-center">{errors.general}</div>
                )}
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} encType="multipart/form-data" className="space-y-4">
                <div>
                  <Label htmlFor="reg-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    autoComplete="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="you@email.com" 
                    className={errors.email ? "border-red-500" : ""} 
                  />
                  {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                </div>
                
                <div>
                  <Label htmlFor="reg-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Пароль
                  </Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    autoComplete="new-password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••" 
                    className={errors.password ? "border-red-500" : ""} 
                  />
                  {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                </div>
                
                <div>
                  <Label htmlFor="reg-name" className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Имя
                  </Label>
                  <Input 
                    id="reg-name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Ваше имя" 
                    className={errors.name ? "border-red-500" : ""} 
                  />
                  {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                </div>
                
                <div>
                  <Label htmlFor="reg-phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Телефон
                  </Label>
                  <Input 
                    id="reg-phone" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="+7 999 123-45-67" 
                    className={errors.phone ? "border-red-500" : ""} 
                  />
                  {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                </div>
                
                <div>
                  <Label htmlFor="reg-question" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Вопрос для консультации
                  </Label>
                  <textarea
                    id="reg-question"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Опишите ваш вопрос..."
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Зарегистрироваться
                </Button>
                
                {errors.general && (
                  <div className="text-xs text-red-500 text-center">{errors.general}</div>
                )}
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Импорт для Phone иконки
import { Phone } from "lucide-react" 