"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Trash2, Search, Copy, Check, Upload, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Checklist {
  id: string
  name: string
  file_url: string
  quiz_result: string // 'ip', 'ooo', или 'both'
  is_active: boolean
  created_at: string
  updated_at: string
}

export function ChecklistManager() {
  const { toast } = useToast()
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newName, setNewName] = useState("")
  const [newQuizResult, setNewQuizResult] = useState<string>("both")

  // Загрузка списка чек-листов
  const fetchChecklists = async () => {
    try {
      const response = await fetch("/api/admin/checklists")
      if (!response.ok) throw new Error("Ошибка загрузки чек-листов")
      const data = await response.json()
      setChecklists(data.checklists)
    } catch (error) {
      console.error("Ошибка загрузки чек-листов:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить чек-листы",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChecklists()
  }, [])

  // Обработка загрузки файла
  const handleFileUpload = async (url: string) => {
    if (!newName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название чек-листа",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      // url содержит только имя файла, которое мы сохраняем в БД
      const response = await fetch("/api/admin/checklists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          file_url: url, // Сохраняем только имя файла
          quiz_result: newQuizResult,
        }),
      })

      if (!response.ok) throw new Error("Ошибка сохранения чек-листа")

      toast({
        title: "Успешно",
        description: "Чек-лист добавлен",
      })

      setNewName("")
      setNewQuizResult("both")
      fetchChecklists()
    } catch (error) {
      console.error("Ошибка сохранения чек-листа:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить чек-лист",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Удаление чек-листа
  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот чек-лист?")) return

    try {
      const response = await fetch(`/api/admin/checklists/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Ошибка удаления чек-листа")

      toast({
        title: "Успешно",
        description: "Чек-лист удален",
      })

      fetchChecklists()
    } catch (error) {
      console.error("Ошибка удаления чек-листа:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить чек-лист",
        variant: "destructive",
      })
    }
  }

  // Обновление привязки к результату квиза
  const handleQuizResultChange = async (id: string, quiz_result: string) => {
    try {
      const response = await fetch(`/api/admin/checklists/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz_result }),
      })

      if (!response.ok) throw new Error("Ошибка обновления чек-листа")

      toast({
        title: "Успешно",
        description: "Чек-лист обновлен",
      })

      fetchChecklists()
    } catch (error) {
      console.error("Ошибка обновления чек-листа:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить чек-лист",
        variant: "destructive",
      })
    }
  }

  // Установка активного чек-листа
  const handleSetActive = async (id: string) => {
    try {
      const response = await fetch("/api/admin/checklists", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checklistId: id }),
      })

      if (!response.ok) throw new Error("Ошибка установки активного чек-листа")

      toast({
        title: "Успешно",
        description: "Активный чек-лист обновлен",
      })

      fetchChecklists()
    } catch (error) {
      console.error("Ошибка установки активного чек-листа:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось установить активный чек-лист",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Форма добавления нового чек-листа */}
      <Card>
        <CardHeader>
          <CardTitle>Добавить чек-лист</CardTitle>
          <CardDescription>Загрузите PDF файл и укажите для какого типа бизнеса он предназначен</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название чек-листа</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Например: Как избежать блокировки счета"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz_result">Для кого предназначен</Label>
            <Select value={newQuizResult} onValueChange={setNewQuizResult}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="ip">Только для ИП</SelectItem>
                <SelectItem value="ooo">Только для ООО</SelectItem>
                <SelectItem value="both">Для всех</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>PDF файл</Label>
            <ImageUploader
              onImageSelect={handleFileUpload}
              multiple={false}
              acceptPdf={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Список существующих чек-листов */}
      <Card>
        <CardHeader>
          <CardTitle>Существующие чек-листы</CardTitle>
          <CardDescription>Управление загруженными чек-листами. Только один чек-лист может быть активным.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checklists.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Нет загруженных чек-листов
              </div>
            ) : (
              checklists.map((checklist) => (
                <Card key={checklist.id} className={`p-4 ${checklist.is_active ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{checklist.name}</div>
                        {checklist.is_active && (
                          <div className="flex items-center gap-1 text-blue-600 text-sm">
                            <Star className="h-4 w-4 fill-current" />
                            <span>Активный</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Загружен: {new Date(checklist.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select
                        value={checklist.quiz_result}
                        onValueChange={(value) => handleQuizResultChange(checklist.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="ip">Только для ИП</SelectItem>
                          <SelectItem value="ooo">Только для ООО</SelectItem>
                          <SelectItem value="both">Для всех</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {!checklist.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetActive(checklist.id)}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Сделать активным
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(checklist.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 