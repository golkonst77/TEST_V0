"use client"
/**
 * @file: import-yandex-reviews.tsx
 * @description: Компонент для импорта отзывов из локального HTML-файла Яндекс.Карт в Supabase
 * @dependencies: shadcn/ui, Tailwind, fetch API, endpoints /api/list-local-reviews-files и /api/import-yandex-reviews
 * @created: 2024-06-09
 */
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ImportResult {
  success?: boolean
  imported?: number
  skipped?: number
  errors?: string[]
  error?: string
}

export function ImportYandexReviews() {
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/list-local-reviews-files')
      .then(r => r.json())
      .then(data => {
        if (data.files) setFiles(data.files)
        else setError('Не удалось получить список файлов')
      })
      .catch(() => setError('Ошибка загрузки списка файлов'))
  }, [])

  function handleImport() {
    if (!selected) return
    setLoading(true)
    setResult(null)
    setError(null)
    fetch('/api/import-yandex-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ htmlFile: selected })
    })
      .then(r => r.json())
      .then(data => setResult(data))
      .catch(() => setError('Ошибка импорта'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Импорт отзывов с Яндекс.Карт (HTML)</h2>
      <div className="mb-4">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите HTML-файл" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {files.map(f => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleImport} disabled={!selected || loading} className="w-full">
        {loading ? 'Импорт...' : 'Импортировать отзывы'}
      </Button>
      {result && (
        <div className="mt-4 text-sm">
          {result.success ? (
            <div className="text-green-600">
              ✅ Импортировано: {result.imported} <br />
              Пропущено (дубли): {result.skipped}
              {result.errors && result.errors.length > 0 && (
                <div className="text-red-500 mt-2">Ошибки: <pre>{result.errors.join('\n')}</pre></div>
              )}
            </div>
          ) : (
            <div className="text-red-600">❌ {result.error || 'Ошибка импорта'}</div>
          )}
        </div>
      )}
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
    </div>
  )
} 