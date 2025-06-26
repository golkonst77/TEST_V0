"use client"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AdminContentPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [pages] = useState([
    { id: 1, title: "Главная страница", slug: "/", status: "published", updated: "2024-01-15" },
    { id: 2, title: "О компании", slug: "/about", status: "published", updated: "2024-01-10" },
    { id: 3, title: "Услуги", slug: "/services", status: "published", updated: "2024-01-12" },
    { id: 4, title: "Контакты", slug: "/contacts", status: "draft", updated: "2024-01-14" },
    { id: 5, title: "Калькулятор", slug: "/calculator", status: "published", updated: "2024-01-13" },
  ])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "published" ? "default" : "secondary"}>
        {status === "published" ? "Опубликовано" : "Черновик"}
      </Badge>
    )
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Управление контентом</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Создать страницу
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Страницы сайта</CardTitle>
            <CardDescription>Редактирование содержимого страниц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-gray-500">{page.slug}</p>
                    <p className="text-xs text-gray-400">Обновлено: {page.updated}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(page.status)}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Медиафайлы</CardTitle>
              <CardDescription>Управление изображениями и файлами</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/media">Открыть медиа-менеджер</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO настройки</CardTitle>
              <CardDescription>Мета-теги и оптимизация</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Настроить SEO
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
