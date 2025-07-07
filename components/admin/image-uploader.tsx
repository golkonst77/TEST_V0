"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Copy, Check, X } from "lucide-react"

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
  acceptPdf?: boolean
}

export function ImageUploader({ onImageSelect, multiple = false, maxFiles = 10, acceptPdf = false }: ImageUploaderProps) {
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

    // Проверяем тип файлов
    const allowedTypes = acceptPdf 
      ? ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"]
      : ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

    const invalidFiles = fileArray.filter(file => !allowedTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      toast({
        title: "Ошибка",
        description: `Неподдерживаемый тип файла: ${invalidFiles.map(f => f.name).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Проверяем размер файлов (максимум 5MB на файл)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = fileArray.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      toast({
        title: "Ошибка",
        description: `Файлы слишком большие (максимум 5MB): ${oversizedFiles.map(f => f.name).join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Загружаем файлы
    fileArray.forEach(async (file) => {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Ошибка загрузки файла")
        }

        if (onImageSelect) {
          onImageSelect(result.url)
        }

        toast({
          title: "Успешно",
          description: `Файл ${file.name} загружен`,
        })
      } catch (error) {
        console.error("Ошибка загрузки:", error)
        toast({
          title: "Ошибка",
          description: `Не удалось загрузить файл ${file.name}`,
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    })
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
        <CardTitle>Загрузка {acceptPdf ? "файлов" : "изображений"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Зона загрузки */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center
            ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${uploading ? "opacity-50" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            multiple={multiple}
            accept={acceptPdf ? ".jpg,.jpeg,.png,.gif,.webp,.pdf" : ".jpg,.jpeg,.png,.gif,.webp"}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span>Загрузка...</span>
                </div>
              ) : (
                <>
                  <p>
                    Перетащите {multiple ? "файлы" : "файл"} сюда или{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      выберите на компьютере
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {acceptPdf 
                      ? "JPG, PNG, GIF, WEBP или PDF до 5MB"
                      : "JPG, PNG, GIF или WEBP до 5MB"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Загруженные файлы */}
        {uploadedFiles.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Загруженные файлы</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {uploadedFiles.map((file, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video relative">
                    {file.type === "application/pdf" ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                      />
                    )}
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
