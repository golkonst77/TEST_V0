"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Menu, X, ChevronDown } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"
import { useCruiseClick } from "@/hooks/use-cruise-click"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, FileText, Loader2 } from "lucide-react"
import { Logo } from "./logo"
import { ReCAPTCHAComponent } from "./recaptcha"

interface SiteSettings {
  siteName: string
  phone: string
  telegram: string
  vk: string
  email: string
  address: string
}

interface MenuItem {
  id: string
  title: string
  href: string
  show: boolean
  type: "link" | "dropdown"
  children?: MenuItem[]
}

interface HeaderConfig {
  logo: {
    text: string
    show: boolean
    type: "text" | "image"
    imageUrl?: string
  }
  phone: {
    number: string
    show: boolean
  }
  social: {
    telegram: string
    vk: string
    show: boolean
  }
  ctaButton: {
    text: string
    show: boolean
  }
  menuItems: MenuItem[]
  layout: {
    sticky: boolean
    background: "white" | "transparent" | "colored"
    height: number
  }
}

function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const validateEmail = (v: string) => /.+@.+\..+/.test(v);
  const validatePassword = (v: string) => v.length >= 6;

  const login = async (e: React.FormEvent) => {
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

    const form = new FormData()
    form.append("email", email)
    form.append("password", password)
    form.append("action", "login")
    await fetch("/api/user/profile", { method: "POST", body: form });
    setLoading(false);
    setMsg("");
    onOpenChange(false);
    window.location.href = "/lk";
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    
    const newErrors: Record<string, string> = {}
    if (!validateEmail(email)) newErrors.email = "Некорректный email"
    if (!validatePassword(password)) newErrors.password = "Пароль должен быть не менее 6 символов"
    if (!name.trim()) newErrors.name = "Имя обязательно"
    if (!phone.trim()) newErrors.phone = "Телефон обязателен"
    if (!recaptchaToken) newErrors.recaptcha = "Пожалуйста, подтвердите, что вы не робот"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      // Проверяем reCAPTCHA
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recaptchaToken })
      })

      const recaptchaData = await recaptchaResponse.json()
      
      if (!recaptchaData.success || !recaptchaData.isHuman) {
        setErrors({ recaptcha: 'Проверка reCAPTCHA не пройдена. Попробуйте еще раз.' })
        setLoading(false)
        return
      }

      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      form.append("name", name);
      form.append("phone", phone);
      form.append("question", question);
      form.append("action", "register");
      
      await fetch("/api/user/profile", { method: "POST", body: form });
      setLoading(false);
      setMsg("");
      onOpenChange(false);
      window.location.href = "/lk";
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ recaptcha: 'Ошибка при регистрации. Попробуйте еще раз.' })
      setLoading(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl shadow-2xl border bg-white dark:bg-zinc-900">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex w-full">
            <TabsTrigger value="login" className="flex-1">Вход</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">Регистрация</TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="login">
              <form onSubmit={login} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                  <Input id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                </div>
                <div>
                  <Label htmlFor="login-password" className="flex items-center gap-2"><Lock className="w-4 h-4" /> Пароль</Label>
                  <Input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className={errors.password ? "border-red-500" : ""} />
                  {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Войти
                </Button>
                {msg && <div className="text-xs text-red-500 mt-2 text-center">{msg}</div>}
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={register} className="space-y-4">
                <div>
                  <Label htmlFor="reg-email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                  <Input id="reg-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-password" className="flex items-center gap-2"><Lock className="w-4 h-4" /> Пароль</Label>
                  <Input id="reg-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className={errors.password ? "border-red-500" : ""} />
                  {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-name" className="flex items-center gap-2"><User className="w-4 h-4" /> Имя</Label>
                  <Input id="reg-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" className={errors.name ? "border-red-500" : ""} />
                  {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-phone" className="flex items-center gap-2"><Phone className="w-4 h-4" /> Телефон</Label>
                  <Input id="reg-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" className={errors.phone ? "border-red-500" : ""} />
                  {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
                </div>
                <div>
                  <Label htmlFor="reg-question" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Вопрос</Label>
                  <Textarea id="reg-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ваш вопрос (необязательно)" />
                </div>
                <div>
                  <ReCAPTCHAComponent 
                    onVerify={setRecaptchaToken} 
                    className="flex justify-center"
                  />
                  {errors.recaptcha && <div className="text-xs text-red-500 mt-1 text-center">{errors.recaptcha}</div>}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Зарегистрироваться
                </Button>
                {msg && <div className="text-xs text-red-500 mt-2 text-center">{msg}</div>}
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export const Header = () => {
  const { openContactForm } = useContactForm()
  const { handleCruiseClick, modalOpen, setModalOpen, quizUrl } = useCruiseClick()
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchHeaderConfig()
  }, [])

  const fetchHeaderConfig = async () => {
    try {
      console.log("Header: Fetching settings...")
      const response = await fetch("/api/settings")
      if (response.ok) {
        const settings = await response.json()
        console.log("Header: Loaded settings:", settings)
        
        // Преобразуем данные из settings в формат header
        const config: HeaderConfig = {
          logo: {
            text: settings.siteName || "ПростоБюро",
            show: true,
            type: "text",
            imageUrl: "",
          },
          phone: {
            number: settings.phone || "+7 953 330-17-77",
            show: true,
          },
          social: {
            telegram: settings.telegram || "https://t.me/prostoburo",
            vk: settings.vk || "https://m.vk.com/buh_urist?from=groups",
            show: true,
          },
          ctaButton: {
            text: "Получить скидку",
            show: true,
          },
          menuItems: [
            {
              id: "services",
              title: "Услуги",
              href: "/services",
              show: true,
              type: "link"
            },
            {
              id: "pricing",
              title: "Тарифы",
              href: "/pricing",
              show: true,
              type: "link"
            },
            {
              id: "calculator",
              title: "Калькулятор",
              href: "/calculator",
              show: true,
              type: "link"
            },
            {
              id: "about",
              title: "О компании",
              href: "/about",
              show: true,
              type: "link"
            },
            {
              id: "blog",
              title: "Блог",
              href: "/blog",
              show: true,
              type: "link"
            },
            {
              id: "contacts",
              title: "Контакты",
              href: "#contacts",
              show: true,
              type: "link"
            },
          ],
          layout: {
            sticky: true,
            background: "white",
            height: 64,
          },
        }
        
        setHeaderConfig(config)
      } else {
        console.error("Header: Failed to fetch settings")
      }
    } catch (error) {
      console.error("Header: Error fetching settings:", error)
    }
  }

  if (!headerConfig) {
    return null // Или показать загрузочный индикатор
  }

  const renderMenuItem = (item: MenuItem) => {
    if (!item.show) return null

    if (item.type === "dropdown" && item.children) {
      return (
        <div key={item.id} className="relative group">
          <button className="flex items-center gap-1 hover:text-blue-600">
            {item.title}
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.children.map((child) => (
              child.show && (
                <Link
                  key={child.id}
                  href={child.href}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {child.title}
                </Link>
              )
            ))}
          </div>
        </div>
      )
    }

    return (
      <Link key={item.id} href={item.href} className="hover:text-blue-600">
        {item.title}
      </Link>
    )
  }

  return (
    <header className={`${headerConfig.layout.sticky ? 'sticky top-0' : ''} z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60`}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {headerConfig.menuItems.map(renderMenuItem)}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Открыть меню"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Right side widgets */}
        <div className="hidden lg:flex items-center space-x-4">
          {headerConfig.phone.show && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>{headerConfig.phone.number}</span>
            </div>
          )}

          {/* Social links */}
          {headerConfig.social.show && (
            <div className="flex items-center space-x-2">
              <Link href={headerConfig.social.telegram || "#"} className="p-2 rounded-full hover:bg-gray-100" aria-label="Telegram">
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link href={headerConfig.social.vk || "#"} className="p-2 rounded-full hover:bg-gray-100" aria-label="VK">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.4v1.608c0 .432-.138.69-1.276.69-1.966 0-4.644-1.193-6.36-3.428C4.304 11.13 3.568 8.28 3.568 7.648c0-.414.138-.69.966-.69h1.744c.69 0 .966.276 1.241 1.172.69 2.07 1.863 3.428 2.346 3.428.276 0 .414-.138.414-.9V9.936c-.069-1.241-.725-1.345-.725-1.793 0-.345.276-.69.725-.69h2.76c.588 0 .795.276.795.966v2.898c0 .588.276.795.414.795.276 0 .588-.207 1.172-.795 1.241-1.379 2.139-3.566 2.139-3.566.138-.345.414-.69 1.103-.69h1.744c.828 0 1.01.414.828.966-.414 1.24-2.484 4.062-2.484 4.062-.276.414-.207.588 0 .966.207.276 1.103 1.103 1.655 1.793.552.69.966 1.379.69 1.793z" />
                </svg>
              </Link>
            </div>
          )}

          {/* CTA */}
          {headerConfig.ctaButton.show && (
            <Button
              onClick={handleCruiseClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base"
            >
              {headerConfig.ctaButton.text}
            </Button>
          )}
          
          {/* Кнопка входа в ЛК */}
          <Button 
            variant="outline" 
            className="ml-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm md:text-base" 
            onClick={() => setAuthOpen(true)}
          >
            Личный кабинет
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg lg:hidden z-50 max-h-[80vh] overflow-y-auto">
            <div className="container mx-auto px-4 py-6 space-y-6">
              {/* Mobile Menu Items */}
              <div className="space-y-4">
              {headerConfig.menuItems.map((item) => (
                item.show && (
                  <div key={item.id}>
                    {item.type === "dropdown" && item.children ? (
                      <div>
                          <div className="font-semibold text-gray-900 mb-3 text-lg">{item.title}</div>
                          <div className="pl-4 space-y-3">
                          {item.children.map((child) => (
                            child.show && (
                              <Link
                                key={child.id}
                                href={child.href}
                                  className="block text-gray-600 hover:text-blue-600 py-2 text-base"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.title}
                              </Link>
                            )
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                          className="block text-gray-900 hover:text-blue-600 py-3 text-lg font-medium border-b border-gray-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                )
              ))}
              </div>
              
              {/* Mobile Contact Info */}
              {headerConfig.phone.show && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 text-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{headerConfig.phone.number}</span>
                  </div>
                </div>
              )}
              
              {/* Mobile Social Links */}
              {headerConfig.social.show && (
                <div className="flex items-center space-x-4 pt-4">
                  <Link href={headerConfig.social.telegram || "#"} className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors" aria-label="Telegram">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </Link>
                  <Link href={headerConfig.social.vk || "#"} className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors" aria-label="VK">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.4v1.608c0 .432-.138.69-1.276.69-1.966 0-4.644-1.193-6.36-3.428C4.304 11.13 3.568 8.28 3.568 7.648c0-.414.138-.69.966-.69h1.744c.69 0 .966.276 1.241 1.172.69 2.07 1.863 3.428 2.346 3.428.276 0 .414-.138.414-.9V9.936c-.069-1.241-.725-1.345-.725-1.793 0-.345.276-.69.725-.69h2.76c.588 0 .795.276.795.966v2.898c0 .588.276.795.414.795.276 0 .588-.207 1.172-.795 1.241-1.379 2.139-3.566 2.139-3.566.138-.345.414-.69 1.103-.69h1.744c.828 0 1.01.414.828.966-.414 1.24-2.484 4.062-2.484 4.062-.276.414-.207.588 0 .966.207.276 1.103 1.103 1.655 1.793.552.69.966 1.379.69 1.793z" />
                    </svg>
                  </Link>
                </div>
              )}
              
              {/* Mobile CTA Button */}
              {headerConfig.ctaButton.show && (
                <div className="pt-4">
                <Button
                  onClick={() => {
                    handleCruiseClick()
                    setMobileMenuOpen(false)
                  }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg rounded-xl"
                >
                  {headerConfig.ctaButton.text}
                </Button>
                </div>
              )}
              
              {/* Mobile Auth Button */}
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full py-4 text-lg font-medium" 
                  onClick={() => {
                    setAuthOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  Личный кабинет
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}

export default Header
