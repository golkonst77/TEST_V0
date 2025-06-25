import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, Settings, Users } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Панель администратора</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Управление контентом и настройками сайта</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Калькулятор</CardTitle>
            <CardDescription>Редактирование цен услуг и множителей калькулятора стоимости</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/calculator">Редактировать калькулятор</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Тарифы</CardTitle>
            <CardDescription>Управление тарифными планами для ИП и ООО, дополнительными услугами</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/pricing">Редактировать тарифы</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Клиенты</CardTitle>
            <CardDescription>Просмотр заявок с квиза и управление клиентской базой</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/admin/clients">Управление клиентами</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 mb-4">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle>Настройки</CardTitle>
            <CardDescription>Общие настройки сайта, контактная информация, интеграции</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/admin/settings">Настройки сайта</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/calculator">
              <Calculator className="mr-2 h-4 w-4" />
              Обновить цены в калькуляторе
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/pricing">
              <DollarSign className="mr-2 h-4 w-4" />
              Изменить тарифные планы
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
