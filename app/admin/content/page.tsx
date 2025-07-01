"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Eye, Trash2, FileText, Search, CheckCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface Page {
  id: number
  title: string
  slug: string
  status: string
  updated: string
  type: string
}

export default function AdminContentPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Загружаем страницы при монтировании компонента
  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/content")
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      } else {
        toast.error("Ошибка загрузки страниц")
      }
    } catch (error) {
      console.error("Error fetching pages:", error)
      toast.error("Ошибка загрузки страниц")
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (pageId: number) => {
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle-status",
          pageId: pageId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        
        // Обновляем локальное состояние
        setPages(pages.map(page => 
          page.id === pageId 
            ? { ...page, status: data.page.status, updated: data.page.updated }
            : page
        ))
        
        // Показываем уведомление о необходимости перезагрузки
        if (data.page.status === 'draft') {
          toast.info("Страница снята с публикации. Обновите браузер, чтобы увидеть изменения.", {
            duration: 5000
          })
        } else {
          toast.info("Страница опубликована. Обновите браузер, чтобы увидеть изменения.", {
            duration: 5000
          })
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Ошибка изменения статуса")
      }
    } catch (error) {
      console.error("Error toggling publish status:", error)
      toast.error("Ошибка изменения статуса")
    }
  }

  const deletePage = async (pageId: number) => {
    const page = pages.find(p => p.id === pageId)
    if (!page) return

    if (!confirm(`Вы уверены, что хотите удалить страницу "${page.title}"?`)) {
      return
    }

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          pageId: pageId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        setPages(pages.filter(page => page.id !== pageId))
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Ошибка удаления страницы")
      }
    } catch (error) {
      console.error("Error deleting page:", error)
      toast.error("Ошибка удаления страницы")
    }
  }

  const viewPage = (slug: string) => {
    window.open(slug, '_blank')
  }

  const editPage = (pageId: number) => {
    toast.info("Функция редактирования будет добавлена позже")
  }

  // Фильтрация страниц по поисковому запросу
  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка страниц...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление контентом</h1>
            <p className="text-gray-600">Управляйте страницами и их публикацией</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Создать страницу
          </Button>
        </div>

        {/* Поиск */}
        <Card className="border border-gray-200">
          <CardContent className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск страниц..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Список страниц */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Страницы ({filteredPages.length})</CardTitle>
            <CardDescription>
              Управляйте публикацией и содержимым страниц сайта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-sm">{page.title}</h3>
                      <p className="text-xs text-gray-500">{page.slug}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={page.status === "published" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {page.status === "published" ? "Опубликовано" : "Черновик"}
                    </Badge>
                    
                    <span className="text-xs text-gray-500">{page.updated}</span>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewPage(page.slug)}
                        className="h-7 w-7 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editPage(page.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish(page.id)}
                        className="h-7 w-7 p-0"
                      >
                        {page.status === "published" ? (
                          <Clock className="h-3 w-3 text-orange-600" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePage(page.id)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredPages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Страницы не найдены</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {pages.filter(p => p.status === 'published').length}
                </div>
                <div className="text-xs text-gray-600">Опубликовано</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  {pages.filter(p => p.status === 'draft').length}
                </div>
                <div className="text-xs text-gray-600">Черновики</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {pages.length}
                </div>
                <div className="text-xs text-gray-600">Всего страниц</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

