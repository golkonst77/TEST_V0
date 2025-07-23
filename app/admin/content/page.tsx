"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, Search, CheckCircle, Clock, ArrowUp, ArrowDown } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface Section {
  id: number
  title: string
  key: string
  status: string
  updated: string
  description: string
  icon: string
}

export default function AdminContentPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Загружаем секции при монтировании компонента
  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/content")
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      } else {
        toast.error("Ошибка загрузки секций")
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
      toast.error("Ошибка загрузки секций")
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = async (sectionId: number) => {
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "toggle-status",
          sectionId: sectionId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        
        // Обновляем локальное состояние
        setSections(sections.map(section => 
          section.id === sectionId 
            ? { ...section, status: data.section.status, updated: data.section.updated }
            : section
        ))
        
        // Показываем уведомление о необходимости обновления страницы
        toast.info("Изменения применены. Обновите главную страницу, чтобы увидеть результат.", {
          duration: 4000
          })
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Ошибка изменения статуса")
      }
    } catch (error) {
      console.error("Error toggling section status:", error)
      toast.error("Ошибка изменения статуса")
    }
  }

  const moveSection = async (sectionId: number, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sections.length) return

    const newSections = [...sections]
    const [movedSection] = newSections.splice(currentIndex, 1)
    newSections.splice(newIndex, 0, movedSection)

    setSections(newSections)

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update-order",
          sections: newSections,
        }),
      })

      if (response.ok) {
        toast.success("Порядок секций обновлен")
      } else {
        toast.error("Ошибка обновления порядка")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Ошибка обновления порядка")
    }
  }

  const previewSection = (sectionKey: string) => {
    // Открываем главную страницу с якорем на секцию
    window.open(`/#${sectionKey}`, '_blank')
  }

  // Фильтрация секций по поисковому запросу
  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка секций...</p>
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
            <p className="text-gray-600">Включайте и отключайте секции на главной странице</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => window.open('/', '_blank')}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              Просмотр главной
            </Button>
            <Button 
              size="sm" 
              onClick={() => window.open('/', '_blank')}
              variant="default"
            >
              <Eye className="h-4 w-4 mr-2" />
              Обновить главную
          </Button>
          </div>
        </div>

        {/* Поиск */}
        <Card className="border border-gray-200">
          <CardContent className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск секций..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Список секций */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Секции главной страницы ({filteredSections.length})</CardTitle>
            <CardDescription>
              Управляйте отображением секций на главной странице сайта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredSections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{section.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{section.title}</h3>
                      <p className="text-xs text-gray-500">{section.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={section.status === "published" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {section.status === "published" ? "Включено" : "Отключено"}
                        </Badge>
                        <span className="text-xs text-gray-500">Обновлено: {section.updated}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Кнопки перемещения */}
                      <Button
                        variant="ghost"
                        size="sm"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                        className="h-7 w-7 p-0"
                      >
                      <ArrowUp className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                        className="h-7 w-7 p-0"
                      >
                      <ArrowDown className="h-3 w-3" />
                      </Button>
                      
                    {/* Кнопка предпросмотра */}
                      <Button
                        variant="ghost"
                        size="sm"
                      onClick={() => previewSection(section.key)}
                        className="h-7 w-7 p-0"
                      >
                      <Eye className="h-3 w-3" />
                      </Button>
                      
                    {/* Переключатель */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={section.status === "published"}
                        onCheckedChange={() => toggleSection(section.id)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <span className="text-xs text-gray-500">
                        {section.status === "published" ? "Вкл" : "Выкл"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredSections.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Секции не найдены</p>
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
                  {sections.filter(s => s.status === 'published').length}
                </div>
                <div className="text-xs text-gray-600">Включено</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  {sections.filter(s => s.status === 'draft').length}
                </div>
                <div className="text-xs text-gray-600">Отключено</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {sections.length}
                </div>
                <div className="text-xs text-gray-600">Всего секций</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Инструкция */}
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-blue-900 mb-2">Как это работает:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Включено</strong> - секция отображается на главной странице</li>
              <li>• <strong>Отключено</strong> - секция скрыта с главной страницы</li>
              <li>• <strong>Стрелки</strong> - изменяют порядок отображения секций</li>
              <li>• <strong>Глаз</strong> - предпросмотр секции на главной странице</li>
              <li>• Изменения применяются мгновенно после переключения</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

