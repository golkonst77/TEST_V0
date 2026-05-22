"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MediaFile {
  name: string
  url: string
  size: number
}

interface MediaPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
  selectedUrl?: string
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedUrl,
}: MediaPickerDialogProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!open) return

    const fetchFiles = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/admin/media")
        const data = await response.json()
        setFiles(data.files || [])
      } catch (error) {
        console.error("MediaPicker: failed to load files", error)
        setFiles([])
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [open])

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Выбор из медиафайлов</DialogTitle>
          <DialogDescription>
            Выберите изображение, которое уже загружено на сервер
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск файлов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px]">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">Загрузка файлов...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              {searchTerm ? "Файлы не найдены" : "Нет загруженных изображений"}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredFiles.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => {
                    onSelect(file.url)
                    onOpenChange(false)
                  }}
                  className={`rounded-lg border overflow-hidden text-left transition hover:border-blue-500 hover:shadow-sm ${
                    selectedUrl === file.url ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                  }`}
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={`${file.url}?v=${file.size}`}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
