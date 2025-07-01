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

  // Загрузка страниц с сервера
  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/content')
      const data = await response.json()
      if (data.success) {
        setPages(data.pages)
      } else {
        toast.error('Ошибка загрузки страниц')
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleView = (slug: string) => {
    window.open(slug, '_blank')
  }

  const handleEdit = (id: number) => {
    toast.info('Редактор страниц будет добавлен в следующих версиях')
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          pageId: id,
          status: newStatus
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setPages(pages.map(page => 
          page.id === id 
            ? { ...page, status: newStatus, updated: data.page.updated }
            : page
        ))
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Ошибка обновления статуса')
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу')
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Вы уверены, что хотите удалить страницу "${title}"?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          pageId: id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setPages(pages.filter(page => page.id !== id))
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Ошибка удаления страницы')
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу')
    }
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Загрузка страниц...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Управление контентом</h1>
            <p className="text-gray-600">Управляйте страницами сайта</p>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Создать страницу
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Страницы сайта</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск страниц..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{page.title}</span>
                        <Badge 
                          variant={page.status === 'published' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {page.status === 'published' ? 'Опубликовано' : 'Черновик'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {page.slug} • Обновлено {page.updated}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(page.slug)}
                      className="h-7 w-7 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(page.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(page.id, page.status)}
                      className="h-7 w-7 p-0"
                    >
                      {page.status === 'published' ? (
                        <Clock className="h-3 w-3 text-orange-600" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(page.id, page.title)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredPages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Страницы не найдены' : 'Нет страниц'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Опубликовано</p>
                  <p className="text-lg font-bold">{pages.filter(p => p.status === 'published').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Черновики</p>
                  <p className="text-lg font-bold">{pages.filter(p => p.status === 'draft').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Всего страниц</p>
                  <p className="text-lg font-bold">{pages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
