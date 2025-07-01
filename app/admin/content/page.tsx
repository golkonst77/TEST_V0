"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Eye, Trash2, FileText, Search, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function AdminContentPage() {
  const [pages, setPages] = useState([
    { id: 1, title: "Главная страница", slug: "/", status: "published", updated: "2024-01-15", type: "page" },
    { id: 2, title: "О компании", slug: "/about", status: "published", updated: "2024-01-10", type: "page" },
    { id: 3, title: "Услуги", slug: "/services", status: "published", updated: "2024-01-12", type: "page" },
    { id: 4, title: "Контакты", slug: "/contacts", status: "draft", updated: "2024-01-14", type: "page" },
    { id: 5, title: "Калькулятор", slug: "/calculator", status: "published", updated: "2024-01-13", type: "page" },
    { id: 6, title: "Тарифы ИП", slug: "/pricing/ip", status: "published", updated: "2024-01-11", type: "page" },
    { id: 7, title: "Тарифы ООО", slug: "/pricing/ooo", status: "published", updated: "2024-01-11", type: "page" },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    return (
      <Badge 
        variant={status === "published" ? "default" : "secondary"}
        className={`text-xs ${status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
      >
        {status === "published" ? "Опубликовано" : "Черновик"}
      </Badge>
    )
  }

  const handleViewPage = (slug: string) => {
    window.open(slug, '_blank')
  }

  const handleEditPage = (pageId: number) => {
    // Здесь будет редирект на страницу редактирования
    console.log('Редактирование страницы:', pageId)
    alert('Функция редактирования будет добавлена в следующих версиях')
  }

  const handleDeletePage = (pageId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту страницу?')) {
      setPages(pages.filter(page => page.id !== pageId))
    }
  }

  const handleToggleStatus = (pageId: number) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? { ...page, status: page.status === 'published' ? 'draft' : 'published', updated: new Date().toISOString().split('T')[0] }
        : page
    ))
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout 
      title="Управление контентом" 
      description="Редактирование страниц и материалов сайта"
      actions={
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Создать страницу
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {/* Поиск */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск страниц..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Список страниц */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Страницы сайта</span>
            </CardTitle>
            <CardDescription className="text-sm">Редактирование содержимого страниц</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredPages.map((page) => (
                <div key={page.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 text-sm">{page.title}</h3>
                          {getStatusBadge(page.status)}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{page.slug}</p>
                        <p className="text-xs text-gray-400">Обновлено: {page.updated}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0"
                        onClick={() => handleViewPage(page.slug)}
                        title="Просмотреть страницу"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0"
                        onClick={() => handleEditPage(page.id)}
                        title="Редактировать страницу"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`h-7 w-7 p-0 ${page.status === 'published' ? 'text-orange-500' : 'text-green-500'}`}
                        onClick={() => handleToggleStatus(page.id)}
                        title={page.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
                      >
                        {page.status === 'published' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 text-red-500"
                        onClick={() => handleDeletePage(page.id)}
                        title="Удалить страницу"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{pages.filter(p => p.status === 'published').length}</div>
              <div className="text-xs text-gray-600">Опубликовано</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{pages.filter(p => p.status === 'draft').length}</div>
              <div className="text-xs text-gray-600">Черновиков</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{pages.length}</div>
              <div className="text-xs text-gray-600">Всего страниц</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-xs text-gray-600">В корзине</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
