"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Trash2, Search, Copy, Check, Upload } from "lucide-react"

interface MediaFile {
  name: string
  url: string
  size: number
  uploadDate: string
  modifiedDate: string
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    const filtered = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredFiles(filtered)
  }, [files, searchTerm])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/admin/media")
      const data = await response.json()
      setFiles(data.files || [])
    } catch (error) {
      console.error("Ошибка загрузки файлов:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список файлов",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteFile = async (fileName: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот файл?")) {
      return
    }

    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      })

      const result = await response.json()

      if (result.success) {
        setFiles(files.filter((file) => file.name !== fileName))
        toast({
          title: "Файл удален",
          description: "Файл успешно удален",
        })
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось удалить файл",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Ошибка удаления файла:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении файла",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      toast({
        title: "Скопировано",
        description: "URL изображения скопирован в буфер обмена",
      })

      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать URL",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AdminLayout 
      title="Медиафайлы" 
      description="Управление изображениями и файлами"
      actions={
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Загрузить файлы
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {/* Загрузка файлов */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Загрузка файлов</CardTitle>
            <CardDescription className="text-sm">Загрузите изображения и другие медиафайлы</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader multiple={true} maxFiles={10} onImageSelect={() => fetchFiles()} />
          </CardContent>
        </Card>

        {/* Поиск */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск файлов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Список файлов */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Загруженные файлы ({filteredFiles.length})</CardTitle>
            <CardDescription className="text-sm">Управление медиафайлами</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Загрузка файлов...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">{searchTerm ? "Файлы не найдены" : "Нет загруженных файлов"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file.name} className="border border-gray-200 overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-gray-900 truncate">{file.name}</h3>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>Размер: {formatFileSize(file.size)}</p>
                          <p>Загружен: {formatDate(file.uploadDate)}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(file.url)}
                            className="h-7 w-7 p-0"
                          >
                            {copiedUrl === file.url ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteFile(file.name)}
                            className="h-7 w-7 p-0 text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{files.length}</div>
              <div className="text-xs text-gray-600">Всего файлов</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
              </div>
              <div className="text-xs text-gray-600">Общий размер</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {files.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length}
              </div>
              <div className="text-xs text-gray-600">Изображений</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {files.filter(f => !f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length}
              </div>
              <div className="text-xs text-gray-600">Других файлов</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
