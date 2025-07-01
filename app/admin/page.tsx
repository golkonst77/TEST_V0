"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Calculator, 
  DollarSign, 
  Users, 
  FileText, 
  ImageIcon, 
  Settings,
  Palette,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    title: "Главная страница",
    description: "Редактирование контента и расположения элементов",
    href: "/admin/homepage",
    icon: Home
  },
  {
    title: "Калькулятор",
    description: "Настройка услуг и цен калькулятора",
    href: "/admin/calculator",
    icon: Calculator
  },
  {
    title: "Тарифы",
    description: "Управление тарифными планами и ценами",
    href: "/admin/pricing",
    icon: DollarSign
  },
  {
    title: "Настройки",
    description: "Общие настройки сайта и конфигурация",
    href: "/admin/settings",
    icon: Settings
  }
]

const stats = [
  {
    title: "Активные пользователи",
    value: "24",
    icon: Users,
    trend: "+12%"
  },
  {
    title: "Заявки сегодня",
    value: "8",
    icon: TrendingUp,
    trend: "+5%"
  },
  {
    title: "Время работы",
    value: "99.9%",
    icon: Activity,
    trend: "Стабильно"
  }
]

export default function AdminPage() {
  return (
    <AdminLayout title="Панель управления" description="Обзор системы и быстрые действия">
      <div className="p-6 space-y-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-green-600">{stat.trend}</p>
                    </div>
                    <Icon className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Быстрые действия */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.href} className="border border-gray-200 hover:border-gray-300 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-base">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-3">
                      {action.description}
                    </CardDescription>
                    <Link href={action.href}>
                      <Button size="sm" className="w-full">
                        Перейти
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Последние действия */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Последние действия</h2>
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">Обновлены настройки главной страницы</span>
                  <span className="text-gray-400 ml-auto">2 мин назад</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">Добавлен новый тариф</span>
                  <span className="text-gray-400 ml-auto">1 час назад</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">Обновлен калькулятор услуг</span>
                  <span className="text-gray-400 ml-auto">3 часа назад</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
