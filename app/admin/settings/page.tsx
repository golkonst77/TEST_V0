"use client"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import classNames from "classnames"

export default function AdminSettingsPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    phone: "",
    email: "",
    address: "",
    telegram: "",
    vk: "",
    maintenanceMode: false,
    analyticsEnabled: true,
    quiz_mode: "custom",
    quiz_url: "",
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{[k:string]:string}>({})

  // Загрузка настроек при открытии страницы
  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings()
    }
  }, [isAuthenticated])

  const fetchSettings = async () => {
    try {
      console.log("Fetching settings...")
      const response = await fetch("/api/admin/settings")
      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Loaded settings:", data)
        setSettings({
          siteName: data.sitename || "",
          siteDescription: data.sitedescription || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          telegram: data.telegram || "",
          vk: data.vk || "",
          maintenanceMode: data.maintenancemode ?? false,
          analyticsEnabled: data.analyticsenabled ?? true,
          quiz_mode: data.quiz_mode || "custom",
          quiz_url: data.quiz_url || "",
        })
        setMessage("Настройки загружены")
      } else {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        setMessage("Ошибка загрузки настроек")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      setMessage("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    setFieldErrors({})
    // Валидация обязательных полей
    const errors: {[k:string]:string} = {}
    if (!settings.siteName?.trim()) errors.siteName = "Заполните название сайта"
    if (!settings.phone?.trim()) errors.phone = "Заполните телефон"
    if (!settings.email?.trim()) errors.email = "Заполните email"
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      setMessage("❌ Заполните обязательные поля: " + Object.values(errors).join(", "))
      setSaving(false)
      return
    }
    try {
      console.log("Saving settings:", settings)

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      console.log("Save response status:", response.status)
      const data = await response.json()
      console.log("Save response data:", data)

      if (response.ok) {
        setMessage("✅ " + (data.message || "Настройки сохранены"))
        // Обновляем локальные настройки
        if (data.settings) {
          setSettings(data.settings)
        }
      } else {
        setMessage("❌ " + (data.error || "Не удалось сохранить настройки"))
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage("❌ Ошибка подключения к серверу")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
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
    <div className="container py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Настройки сайта</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Сохранение...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </>
          )}
        </Button>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.includes("✅")
              ? "bg-green-100 text-green-800"
              : message.includes("❌")
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
            <CardDescription>Базовые настройки сайта</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Название сайта *</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="ПростоБюро"
                className={classNames(fieldErrors.siteName && "border-red-500")}
              />
              {fieldErrors.siteName && <div className="text-xs text-red-500 mt-1">{fieldErrors.siteName}</div>}
            </div>
            <div>
              <Label htmlFor="siteDescription">Описание сайта</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Профессиональные бухгалтерские услуги"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
            <CardDescription>Контакты для связи с клиентами</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Телефон * (текущий: {settings.phone})</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => {
                  console.log("Phone changed to:", e.target.value)
                  setSettings({ ...settings, phone: e.target.value })
                }}
                placeholder="+7 953 330-17-77"
                className={classNames(fieldErrors.phone && "border-red-500")}
              />
              {fieldErrors.phone && <div className="text-xs text-red-500 mt-1">{fieldErrors.phone}</div>}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="info@prostoburo.ru"
                className={classNames(fieldErrors.email && "border-red-500")}
              />
              {fieldErrors.email && <div className="text-xs text-red-500 mt-1">{fieldErrors.email}</div>}
            </div>
            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="г. Москва, ул. Примерная, д. 1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Социальные сети</CardTitle>
            <CardDescription>Ссылки на профили в социальных сетях</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                value={settings.telegram}
                onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
                placeholder="https://t.me/prostoburo"
              />
            </div>
            <div>
              <Label htmlFor="vk">VKontakte</Label>
              <Input
                id="vk"
                value={settings.vk}
                onChange={(e) => setSettings({ ...settings, vk: e.target.value })}
                placeholder="https://m.vk.com/buh_urist?from=groups"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Системные настройки</CardTitle>
            <CardDescription>Технические параметры сайта</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Режим обслуживания</Label>
                <p className="text-sm text-gray-500">Временно закрыть сайт для посетителей</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Аналитика</Label>
                <p className="text-sm text-gray-500">Включить сбор статистики посещений</p>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, analyticsEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Квиз на главной</CardTitle>
            <CardDescription>Управляйте поведением кнопки "Хочу на круиз"</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Режим кнопки</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="quiz_mode"
                    value="custom"
                    checked={settings.quiz_mode === "custom"}
                    onChange={() => setSettings({ ...settings, quiz_mode: "custom" })}
                  />
                  Наш квиз
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="quiz_mode"
                    value="external"
                    checked={settings.quiz_mode === "external"}
                    onChange={() => setSettings({ ...settings, quiz_mode: "external" })}
                  />
                  Внешний квиз/Marquiz
                </label>
              </div>
            </div>
            {settings.quiz_mode === "external" && (
              <div>
                <Label htmlFor="quiz_url">Ссылка или hash для внешнего квиза</Label>
                <Input
                  id="quiz_url"
                  value={settings.quiz_url || ""}
                  onChange={e => setSettings({ ...settings, quiz_url: e.target.value })}
                  placeholder="#popup:marquiz_685a59bddc273b0019e372cd или https://..."
                />
                <div className="text-xs text-gray-500 mt-1">Для Marquiz: #popup:marquiz_...<br/>Для обычной ссылки: https://...</div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Отладочная информация:</h3>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">{JSON.stringify(settings, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
