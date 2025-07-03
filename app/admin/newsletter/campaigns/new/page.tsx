"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    scheduled_at: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject.trim() || !formData.content.trim()) {
      toast.error('Заполните все обязательные поля')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: formData.subject.trim(),
          content: formData.content.trim(),
          scheduled_at: formData.scheduled_at || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Кампания создана успешно')
        router.push('/admin/newsletter/campaigns')
      } else {
        toast.error(data.error || 'Ошибка создания кампании')
      }
    } catch (error) {
      toast.error('Ошибка создания кампании')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <AdminLayout 
      title="Создать кампанию" 
      description="Создание новой email рассылки"
      showBackButton={true}
      backHref="/admin/newsletter/campaigns"
    >
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Новая кампания рассылки</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Тема письма <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="Введите тему письма"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Содержание письма <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Введите содержание письма..."
                  rows={10}
                  required
                />
                <p className="text-sm text-gray-500">
                  Поддерживается обычный текст. HTML-разметка будет добавлена автоматически.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled_at">
                  Запланировать отправку (необязательно)
                </Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => handleChange('scheduled_at', e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Если не указано, кампания будет сохранена как черновик
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Создание...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Создать кампанию
                    </>
                  )}
                </Button>
                <Link href="/admin/newsletter/campaigns">
                  <Button variant="outline" type="button">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Отмена
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Предварительный просмотр</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <strong>Тема:</strong> {formData.subject || 'Без темы'}
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {formData.content || 'Содержание письма появится здесь...'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 