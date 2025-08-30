"use client"

import { useState, useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Home, 
  Settings, 
  Calculator, 
  DollarSign, 
  Gift,
  Users, 
  FileText, 
  ImageIcon, 
  Menu, 
  X, 
  LogOut,
  Crown,
  ChevronRight,
  Eye,
  ArrowLeft,
  Palette,
  Mail,
  Send,
  MessageSquare,
  Video,
  Lock
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  showBackButton?: boolean
  backHref?: string
  actions?: React.ReactNode
}

export function AdminLayout({ 
  children, 
  title = "Админ панель", 
  description,
  showBackButton = true,
  backHref = "/admin",
  actions 
}: AdminLayoutProps) {
  const { isAuthenticated, isLoading, logout } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const navigation = [
    {
      name: 'Главная',
      href: '/admin',
      icon: Crown,
      current: pathname === '/admin'
    },
    {
      name: 'Контент сайта',
      icon: FileText,
      current: ['/admin/homepage', '/admin/header', '/admin/media', '/admin/contacts', '/admin/visibility'].includes(pathname),
      children: [
        { name: 'Главная страница', href: '/admin/homepage', current: pathname === '/admin/homepage' },
        { name: 'Шапка сайта', href: '/admin/header', current: pathname === '/admin/header' },
        { name: 'Контактная информация', href: '/admin/contacts', current: pathname === '/admin/contacts' },
        { name: 'Видимость секций', href: '/admin/visibility', current: pathname === '/admin/visibility' },
        { name: 'Медиафайлы', href: '/admin/media', current: pathname === '/admin/media' }
      ]
    },
    {
      name: 'Коммерция',
      icon: DollarSign,
      current: ['/admin/calculator', '/admin/pricing', '/admin/coupons'].includes(pathname),
      children: [
        { name: 'Калькулятор', href: '/admin/calculator', current: pathname === '/admin/calculator' },
        { name: 'Тарифы', href: '/admin/pricing', current: pathname === '/admin/pricing' },
        { name: 'Купоны', href: '/admin/coupons', current: pathname === '/admin/coupons' }
      ]
    },
    {
      name: 'Интерактив',
      icon: MessageSquare,
      current: ['/admin/checklists', '/admin/reviews', '/admin/video-reviews'].includes(pathname),
      children: [
        { name: 'Чек-листы', href: '/admin/checklists', current: pathname === '/admin/checklists' },
        { name: 'Отзывы', href: '/admin/reviews', current: pathname === '/admin/reviews' },
        { name: 'Видеоотзывы', href: '/admin/video-reviews', current: pathname === '/admin/video-reviews' }
      ]
    },
    {
      name: 'Маркетинг',
      icon: Mail,
      current: pathname.startsWith('/admin/newsletter'),
      children: [
        { name: 'Подписчики', href: '/admin/newsletter', current: pathname === '/admin/newsletter' },
        { name: 'Кампании', href: '/admin/newsletter/campaigns', current: pathname === '/admin/newsletter/campaigns' }
      ]
    },
    {
      name: 'Политика конфиденциальности',
      href: '/admin/policy',
      icon: Lock,
      current: pathname === '/admin/policy'
    },
    {
      name: 'Пользователи',
      href: '/admin/users',
      icon: Users,
      current: pathname === '/admin/users'
    },
    {
      name: 'Настройки',
      href: '/admin/settings',
      icon: Settings,
      current: pathname === '/admin/settings'
    }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Добавляем обработку ошибок
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Требуется авторизация</h2>
          <p className="text-gray-600 mb-4">Для доступа к админ-панели необходимо войти в систему</p>
          <a 
            href="/admin/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Войти в систему
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Мобильное меню overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Боковая панель */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 bg-white border-r transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full w-full">
          {/* Заголовок боковой панели */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Админка</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Навигационное меню */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = item.current
              const hasChildren = item.children && item.children.length > 0
              const isParentActive = hasChildren && item.children.some(child => child.current)
              const Icon = item.icon
              
              if (hasChildren) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className={cn(
                      "flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors",
                      isParentActive 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}>
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = child.current
                        
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              "flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors",
                              isChildActive 
                                ? "bg-blue-50 text-blue-700 font-medium" 
                                : "text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-gray-300" />
                            <span className="truncate">{child.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Нижняя панель */}
          <div className="p-3 border-t">
            <Button
              onClick={() => {
                logout()
                setSidebarOpen(false)
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
            
            <Link href="/" target="_blank" className="block">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-700 hover:bg-gray-100 mt-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Просмотр сайта
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Мобильная шапка */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="font-semibold text-gray-900">{title}</h1>
            <div className="w-8" />
          </div>
        </div>

        {/* Заголовок страницы - только для десктопа */}
        <div className="hidden lg:block bg-white border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBackButton && pathname !== "/admin" && (
                <Link href={backHref}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
} 