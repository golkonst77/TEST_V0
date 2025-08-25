"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, FileJson } from 'lucide-react'

export function ImportYandexReviewsJSON() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [generateName, setGenerateName] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [genResult, setGenResult] = useState<any>(null)

  useEffect(() => {
    void refresh()
  }, [])

  async function refresh() {
    try {
      const res = await fetch('/api/list-local-json-files')
      const data = await res.json()
      const list = Array.isArray(data.files) ? data.files : []
      setFiles(list)
      if (!selectedFile && list.length) setSelectedFile(list[0])
    } catch (e) {
      setFiles([])
    }
  }

  async function handleImport() {
    if (!selectedFile) return
    setLoading(true)
    setImportResult(null)
    try {
      const res = await fetch('/api/import-yandex-reviews-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonFile: selectedFile })
      })
      const data = await res.json()
      setImportResult(data)
    } catch (e: any) {
      setImportResult({ success: false, message: e?.message || String(e) })
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    if (!generateName) return
    setGenLoading(true)
    setGenResult(null)
    try {
      // ожидаем, что generateName это HTML из public
      const res = await fetch('/api/generate-yandex-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlFile: generateName })
      })
      const data = await res.json()
      setGenResult(data)
      await refresh()
      if (data?.file) setSelectedFile(data.file)
    } catch (e: any) {
      setGenResult({ success: false, message: e?.message || String(e) })
    } finally {
      setGenLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select onValueChange={setSelectedFile} value={selectedFile}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Выберите JSON-файл" />
          </SelectTrigger>
          <SelectContent>
            {files.length === 0 ? (
              <SelectItem value="" disabled>Нет JSON файлов в public/</SelectItem>
            ) : (
              files.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button onClick={handleImport} disabled={!selectedFile || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Импортировать JSON
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Имя HTML в public (например: file.html)" value={generateName} onChange={(e) => setGenerateName(e.target.value)} />
        <Button variant="outline" onClick={handleGenerate} disabled={!generateName || genLoading}>
          {genLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileJson className="mr-2 h-4 w-4" />}
          Сгенерировать JSON
        </Button>
      </div>

      {genResult && (
        <div className={`p-3 rounded text-sm ${genResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {genResult.message}
          {genResult.file ? <div>Файл: {genResult.file}</div> : null}
        </div>
      )}

      {importResult && (
        <div className={`p-3 rounded text-sm ${importResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {importResult.message || (importResult.success ? 'Готово' : 'Ошибка')}
          {typeof importResult.imported === 'number' ? <div>Импортировано: {importResult.imported}</div> : null}
          {typeof importResult.skipped === 'number' ? <div>Пропущено: {importResult.skipped}</div> : null}
          {Array.isArray(importResult.errors) && importResult.errors.length ? (
            <ul className="list-disc list-inside mt-1">
              {importResult.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardDescription } from '@/components/ui/card'

export function ImportYandexReviewsJSON() {
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    fetch('/api/list-local-json-files')
      .then(r => r.json())
      .then(d => setFiles(d.files || []))
      .catch(() => setFiles([]))
  }, [])

  async function handleImport() {
    if (!selected) {
      setResult({ success: false, message: 'Выберите JSON-файл' })
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/import-yandex-reviews-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonFile: selected })
      })
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setResult({ success: false, message: e.message || 'Ошибка импорта' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <CardDescription>Импорт отзывов из заранее подготовленного JSON</CardDescription>
      <div className="flex gap-2 items-center">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Выберите JSON-файл из public" />
          </SelectTrigger>
          <SelectContent>
            {files.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleImport} disabled={loading}>
          {loading ? 'Импорт...' : 'Импортировать JSON'}
        </Button>
      </div>
      {result && (
        <div className="text-sm">
          {result.success ? (
            <div className="text-green-600">Успех: импортировано {result.imported}, пропущено {result.skipped}</div>
          ) : (
            <div className="text-red-600">Ошибка: {result.message || result.error}</div>
          )}
        </div>
      )}
    </div>
  )
}


