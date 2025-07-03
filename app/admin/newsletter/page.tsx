"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Mail, 
  Users, 
  Download, 
  Search, 
  Calendar,
  Send,
  Plus,
  TrendingUp,
  Activity,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
  created_at: string
}

interface Stats {
  total_subscribers: number
  active_subscribers: number
  subscribers_this_month: number
  total_campaigns: number
  sent_campaigns: number
  draft_campaigns: number
  scheduled_campaigns: number
}

interface SendsayStatus {
  connected: boolean
  total_subscribers: number
  active_subscribers: number
  inactive_subscribers: number
  mode: 'sendsay' | 'simulation'
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [sendsayStatus, setSendsayStatus] = useState<SendsayStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchData()
    fetchSendsayStatus()
  }, [])

  const fetchData = async () => {
    try {
      // Получаем подписчиков
      const subscribersResponse = await fetch('/api/newsletter')
      const subscribersData = await subscribersResponse.json()
      
      if (subscribersResponse.ok) {
        setSubscribers(subscribersData.subscribers || [])
        setStats(subscribersData.stats || null)
      }

      // Получаем статистику кампаний
      const campaignsResponse = await fetch('/api/newsletter/campaigns')
      const campaignsData = await campaignsResponse.json()
      
      if (campaignsResponse.ok) {
        setStats(prev => ({
          ...prev,
          total_campaigns: campaignsData.campaigns?.length || 0
        }))
      }
    } catch (error) {
      toast.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const fetchSendsayStatus = async () => {
    try {
      const response = await fetch('/api/newsletter/sync-sendsay')
      const data = await response.json()
      setSendsayStatus(data)
    } catch (error) {
      console.error('Ошибка получения статуса Sendsay:', error)
    }
  }

  const syncWithSendsay = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/newsletter/sync-sendsay', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`Синхронизация завершена: обработано ${data.total}, успешно ${data.synced}, ошибок ${data.errors}`)
        fetchSendsayStatus()
      } else {
        alert(`Ошибка синхронизации: ${data.error}`)
      }
    } catch (error) {
      console.error('Ошибка синхронизации:', error)
      alert('Ошибка синхронизации с Sendsay')
    } finally {
      setSyncing(false)
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Дата подписки', 'Статус'],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleDateString('ru-RU'),
        sub.is_active ? 'Активен' : 'Неактивен'
      ])
    ]
    
    const csvString = csvContent.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Рассылка" description="Загрузка...">
        <div className="p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Рассылка" 
      description="Управление подписчиками и email рассылками"
      actions={
        <div className="flex gap-2">
          <Link href="/admin/newsletter/campaigns">
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Кампании
            </Button>
          </Link>
          <Link href="/admin/newsletter/campaigns/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Создать рассылку
            </Button>
          </Link>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Sendsay Status Card */}
        {sendsayStatus && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Интеграция Sendsay
                </CardTitle>
                <Badge variant={sendsayStatus.connected ? "default" : "secondary"}>
                  {sendsayStatus.mode === 'simulation' ? 'Режим симуляции' : 'Sendsay API'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {sendsayStatus.connected ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {sendsayStatus.connected ? 'Подключено' : 'Режим разработки'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Активных: {sendsayStatus.active_subscribers} | 
                    Неактивных: {sendsayStatus.inactive_subscribers}
                  </div>
                </div>
                <Button 
                  onClick={syncWithSendsay} 
                  disabled={syncing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Синхронизация...' : 'Синхронизировать'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего подписчиков</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total_subscribers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Активных</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.active_subscribers || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">За этот месяц</p>
                  <p className="text-2xl font-bold text-purple-600">{stats?.subscribers_this_month || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Кампаний</p>
                  <p className="text-2xl font-bold text-orange-600">{stats?.total_campaigns || 0}</p>
                </div>
                <Mail className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Управление рассылками
              </CardTitle>
              <CardDescription>
                Создавайте и отправляйте email кампании подписчикам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Link href="/admin/newsletter/campaigns">
                  <Button variant="outline" size="sm">
                    Все кампании
                  </Button>
                </Link>
                <Link href="/admin/newsletter/campaigns/new">
                  <Button size="sm">
                    Создать рассылку
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Подписчики
              </CardTitle>
              <CardDescription>
                Управляйте списком подписчиков рассылки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Экспорт в CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Список подписчиков */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Подписчики</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Поиск по email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? 'Подписчики не найдены' : 'Нет подписчиков'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{subscriber.email}</p>
                        <p className="text-sm text-gray-500">
                          Подписан: {formatDate(subscriber.subscribed_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                      {subscriber.is_active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 