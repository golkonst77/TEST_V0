"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Send, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Mail,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Campaign {
  id: string
  subject: string
  content: string
  status: 'draft' | 'scheduled' | 'sent'
  scheduled_at: string | null
  sent_at: string | null
  sent_count: number
  failed_count: number
  created_at: string
  updated_at: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/newsletter/campaigns')
      const data = await response.json()
      
      if (response.ok) {
        setCampaigns(data.campaigns || [])
      } else {
        toast.error(data.error || 'Ошибка загрузки кампаний')
      }
    } catch (error) {
      toast.error('Ошибка загрузки кампаний')
    } finally {
      setLoading(false)
    }
  }

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Вы уверены, что хотите отправить эту рассылку?')) {
      return
    }

    setSendingId(campaignId)
    try {
      const response = await fetch(`/api/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Рассылка отправлена! Доставлено: ${data.sent_count}, Ошибок: ${data.failed_count}`)
        fetchCampaigns()
      } else {
        toast.error(data.error || 'Ошибка отправки рассылки')
      }
    } catch (error) {
      toast.error('Ошибка отправки рассылки')
    } finally {
      setSendingId(null)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту кампанию?')) {
      return
    }

    try {
      const response = await fetch(`/api/newsletter/campaigns/${campaignId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Кампания удалена')
        fetchCampaigns()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Ошибка удаления кампании')
      }
    } catch (error) {
      toast.error('Ошибка удаления кампании')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Черновик</Badge>
      case 'scheduled':
        return <Badge variant="outline">Запланирована</Badge>
      case 'sent':
        return <Badge variant="default">Отправлена</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Кампании рассылок" description="Загрузка...">
        <div className="p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Загрузка кампаний...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Кампании рассылок" 
      description="Управление email рассылками"
      actions={
        <Link href="/admin/newsletter/campaigns/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать кампанию
          </Button>
        </Link>
      }
    >
      <div className="p-6 space-y-6">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Нет кампаний рассылок
              </h3>
              <p className="text-gray-600 mb-4">
                Создайте первую кампанию для отправки новостей подписчикам
              </p>
              <Link href="/admin/newsletter/campaigns/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать кампанию
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{campaign.subject}</CardTitle>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Создана: {formatDate(campaign.created_at)}
                          </span>
                          {campaign.sent_at && (
                            <span className="flex items-center gap-1">
                              <Send className="h-3 w-3" />
                              Отправлена: {formatDate(campaign.sent_at)}
                            </span>
                          )}
                        </div>
                        {campaign.status === 'sent' && (
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Доставлено: {campaign.sent_count}
                            </span>
                            {campaign.failed_count > 0 && (
                              <span className="flex items-center gap-1 text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                Ошибок: {campaign.failed_count}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {campaign.status !== 'sent' && (
                        <Button
                          size="sm"
                          onClick={() => handleSendCampaign(campaign.id)}
                          disabled={sendingId === campaign.id}
                        >
                          {sendingId === campaign.id ? (
                            <>
                              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Отправка...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-2" />
                              Отправить
                            </>
                          )}
                        </Button>
                      )}
                      <Link href={`/admin/newsletter/campaigns/${campaign.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-2" />
                          Редактировать
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">{campaign.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 