"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Copy, Check } from "lucide-react"

interface UploadedFile {
  url: string
  fileName: string
  originalName: string
  size: number
  type: string
}

interface ImageUploaderProps {
  onImageSelect?: (url: string) => void
  multiple?: boolean
  maxFiles?: number
}

export function ImageUploader({ onImageSelect, multiple = false, maxFiles = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)

    if (!multiple && fileArray.length > 1) {
      toast({
        title: "Ошибка",
        description: "Можно загрузить только один файл",
        variant: "destructive",
      })
      return
    }

    if (fileArray.length > maxFiles) {
      toast({
        title: "Ошибка",
        description: `Максимум ${maxFiles} файлов за раз`,
        variant: "destructive",
      })
      return
    }

    uploadFiles(fileArray)
  }

  const uploadFiles = async (files: File[]) => {
    setUploading(true)
    const newUploadedFiles: UploadedFile[] = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          newUploadedFiles.push(result)

          if (onImageSelect) {
            onImageSelect(result.url)
          }
        } else {
          toast({
            title: "Ошибка загрузки",
            description: result.error || "Не удалось загрузить файл",
            variant: "destructive",
          })
        }
      }

      if (newUploadedFiles.length > 0) {
        setUploadedFiles((prev) => [...newUploadedFiles, ...prev])
        toast({
          title: "Успешно загружено",
          description: `Загружено ${newUploadedFiles.length} файл(ов)`,
        })
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при загрузке",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Загрузка изображений</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Зона загрузки */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">Перетащите изображения сюда</p>
          <p className="text-sm text-gray-500 mb-4">или нажмите кнопку для выбора файлов</p>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} variant="outline">
            {uploading ? "Загрузка..." : "Выбрать файлы"}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-2">Поддерживаются: JPG, PNG, GIF, WebP (максимум 5MB)</p>
        </div>

        {/* Загруженные файлы */}
        {uploadedFiles.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Загруженные изображения</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {uploadedFiles.map((file, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(file.url)} className="flex-1">
                        {copiedUrl === file.url ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        URL
                      </Button>
                      {onImageSelect && (
                        <Button size="sm" onClick={() => onImageSelect(file.url)} className="flex-1">
                          Выбрать
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
