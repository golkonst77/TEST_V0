"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-react"
import { useState, useEffect } from "react"

interface EnvironmentInfo {
  nodeEnv: string
  appUrl: string
  supabaseUrl: string
  supabaseKey: string
  supabaseServiceKey: string
  adminEmail: string
  yandexMetrikaId: string
  recaptchaSiteKey: string
  sendsayApiKey: string
  timestamp: string
}

export default function EnvironmentPage() {
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSecrets, setShowSecrets] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const fetchEnvironmentInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/environment")
      if (response.ok) {
        const data = await response.json()
        setEnvInfo(data)
      } else {
        console.error("Failed to fetch environment info")
      }
    } catch (error) {
      console.error("Error fetching environment info:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnvironmentInfo()
  }, [])

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const maskSecret = (secret: string, show: boolean) => {
    if (!secret) return "Не настроено"
    if (show) return secret
    return secret.substring(0, 8) + "..." + secret.substring(secret.length - 4)
  }

  const getStatusBadge = (value: string) => {
    if (!value || value === "Не настроено") {
      return <Badge variant="destructive">Не настроено</Badge>
    }
    return <Badge variant="default">Настроено</Badge>
  }

  if (loading) {
    return (
      <AdminLayout title="Переменные окружения" description="Просмотр конфигурации приложения">
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка информации о среде...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Переменные окружения" description="Просмотр конфигурации приложения">
      <div className="p-6 space-y-6">
        {/* Заголовок с кнопками */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Переменные окружения</h1>
            <p className="text-gray-600">Текущая конфигурация приложения</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showSecrets ? "Скрыть секреты" : "Показать секреты"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEnvironmentInfo}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" />
              Обновить
            </Button>
          </div>
        </div>

        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
            <CardDescription>Базовые настройки приложения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">NODE_ENV</span>
                  {getStatusBadge(envInfo?.nodeEnv || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {envInfo?.nodeEnv || "Не настроено"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.nodeEnv || "", "nodeEnv")}
                  >
                    {copiedField === "nodeEnv" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">NEXT_PUBLIC_APP_URL</span>
                  {getStatusBadge(envInfo?.appUrl || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {envInfo?.appUrl || "Не настроено"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.appUrl || "", "appUrl")}
                  >
                    {copiedField === "appUrl" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ADMIN_EMAIL</span>
                  {getStatusBadge(envInfo?.adminEmail || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {envInfo?.adminEmail || "Не настроено"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.adminEmail || "", "adminEmail")}
                  >
                    {copiedField === "adminEmail" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Время обновления</span>
                  <Badge variant="outline">Информация</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {envInfo?.timestamp ? new Date(envInfo.timestamp).toLocaleString('ru-RU') : "Неизвестно"}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supabase конфигурация */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase конфигурация</CardTitle>
            <CardDescription>Настройки базы данных</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL</span>
                  {getStatusBadge(envInfo?.supabaseUrl || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {envInfo?.supabaseUrl || "Не настроено"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.supabaseUrl || "", "supabaseUrl")}
                  >
                    {copiedField === "supabaseUrl" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  {getStatusBadge(envInfo?.supabaseKey || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {maskSecret(envInfo?.supabaseKey || "", showSecrets)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.supabaseKey || "", "supabaseKey")}
                  >
                    {copiedField === "supabaseKey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">SUPABASE_SERVICE_ROLE_KEY</span>
                  {getStatusBadge(envInfo?.supabaseServiceKey || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {maskSecret(envInfo?.supabaseServiceKey || "", showSecrets)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.supabaseServiceKey || "", "supabaseServiceKey")}
                  >
                    {copiedField === "supabaseServiceKey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Внешние сервисы */}
        <Card>
          <CardHeader>
            <CardTitle>Внешние сервисы</CardTitle>
            <CardDescription>Интеграции с внешними API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Yandex Metrika ID</span>
                  {getStatusBadge(envInfo?.yandexMetrikaId || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {envInfo?.yandexMetrikaId || "Не настроено"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.yandexMetrikaId || "", "yandexMetrikaId")}
                  >
                    {copiedField === "yandexMetrikaId" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">reCAPTCHA Site Key</span>
                  {getStatusBadge(envInfo?.recaptchaSiteKey || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {maskSecret(envInfo?.recaptchaSiteKey || "", showSecrets)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.recaptchaSiteKey || "", "recaptchaSiteKey")}
                  >
                    {copiedField === "recaptchaSiteKey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sendsay API Key</span>
                  {getStatusBadge(envInfo?.sendsayApiKey || "")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {maskSecret(envInfo?.sendsayApiKey || "", showSecrets)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(envInfo?.sendsayApiKey || "", "sendsayApiKey")}
                  >
                    {copiedField === "sendsayApiKey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Предупреждение о безопасности */}
        {showSecrets && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">⚠️ Предупреждение о безопасности</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                Вы просматриваете секретные ключи. Не делитесь этой информацией с посторонними лицами 
                и не сохраняйте скриншоты этой страницы.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
