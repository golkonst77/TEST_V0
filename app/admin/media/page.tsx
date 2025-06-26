"use client"

import { useState, useEffect } from "react"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ImageUploader } from "@/components/admin/image-uploader"
import { ArrowLeft, Trash2, Search, Copy, Check } from "lucide-react"
import Link from "next/link"

interface MediaFile {
  name: string
  url: string
  size: number
  uploadDate: string
  modifiedDate: string
}

export default function AdminMediaPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [files, setFiles] = useState<MediaFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles()
    }
  }, [isAuthenticated])

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

  return (
    <div className="container py-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Медиафайлы</h1>
          <p className="text-gray-600 mt-2">Управление изображениями и файлами</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {/* Загрузка файлов */}
        <ImageUploader multiple={true} maxFiles={10} onImageSelect={() => fetchFiles()} />

        {/* Поиск */}
        <Card>
          <CardHeader>
            <CardTitle>Загруженные файлы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск файлов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Загрузка файлов...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{searchTerm ? "Файлы не найдены" : "Нет загруженных файлов"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file.name} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                      </p>
                      <div className="flex space-x-1 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(file.url)}
                          className="flex-1"
                        >
                          {copiedUrl === file.url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteFile(file.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
