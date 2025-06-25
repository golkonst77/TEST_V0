import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, Users, Settings, BarChart3, FileText } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="container py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Панель администратора</h1>
        <p className="text-gray-600 mt-2">Управление сайтом ProstoBuro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Калькулятор */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-blue-600" />
              <CardTitle>Калькулятор</CardTitle>
            </div>
            <CardDescription>Управление ценами услуг и множителями для калькулятора</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/calculator">Редактировать калькулятор</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Тарифы */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <CardTitle>Тарифные планы</CardTitle>
            </div>
            <CardDescription>Редактирование тарифов и их описаний</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/pricing">Редактировать тарифы</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Пользователи */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <CardTitle>Пользователи</CardTitle>
            </div>
            <CardDescription>Управление пользователями и их правами</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline" disabled>
              <Link href="/admin/users">Скоро доступно</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Новости */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-orange-600" />
              <CardTitle>Новости</CardTitle>
            </div>
            <CardDescription>Добавление и редактирование новостей</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline" disabled>
              <Link href="/admin/news">Скоро доступно</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Аналитика */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-red-600" />
              <CardTitle>Аналитика</CardTitle>
            </div>
            <CardDescription>Статистика посещений и конверсий</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline" disabled>
              <Link href="/admin/analytics">Скоро доступно</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Настройки */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-gray-600" />
              <CardTitle>Настройки</CardTitle>
            </div>
            <CardDescription>Общие настройки сайта</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline" disabled>
              <Link href="/admin/settings">Скоро доступно</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Часто используемые функции</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline">
                <Link href="/">Перейти на сайт</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/calculator">Обновить цены</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/pricing">Изменить тарифы</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
