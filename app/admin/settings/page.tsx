"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import { useState, useEffect } from "react"

export default function AdminSettingsPage() {
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

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
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
        setMessage("Ошибка загрузки настроек")
      }
    } catch (error) {
      setMessage("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("Настройки сохранены")
        if (data.settings) {
          setSettings(data.settings)
        }
      } else {
        setMessage("Не удалось сохранить настройки")
      }
    } catch (error) {
      setMessage("Ошибка подключения к серверу")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Настройки сайта" description="Основные параметры и конфигурация">
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка настроек...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Настройки сайта" 
      description="Основные параметры и конфигурация"
      actions={
        <Button onClick={handleSave} disabled={saving} size="sm">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {message && (
          <div className={`p-3 rounded border text-sm ${
            message.includes("сохранены") || message.includes("загружены")
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}>
            {message}
          </div>
        )}

        {/* Основная информация */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Основная информация</CardTitle>
            <CardDescription className="text-sm">Базовые настройки сайта и компании</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="text-sm">Название сайта</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="ПростоБюро"
                className="h-8 text-sm mt-1"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription" className="text-sm">Описание сайта</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Профессиональные бухгалтерские услуги"
                rows={2}
                className="text-sm mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Контактная информация */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Контактная информация</CardTitle>
            <CardDescription className="text-sm">Телефон, email и адрес компании</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm">Телефон</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+7 953 777 77 77"
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="golkonst@gmail.com"
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-sm">Адрес</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Калуга"
                className="h-8 text-sm mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Социальные сети */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Социальные сети</CardTitle>
            <CardDescription className="text-sm">Ссылки на профили в социальных сетях</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telegram" className="text-sm">Telegram</Label>
                <Input
                  id="telegram"
                  value={settings.telegram}
                  onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
                  placeholder="@prostoburo"
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vk" className="text-sm">ВКонтакте</Label>
                <Input
                  id="vk"
                  value={settings.vk}
                  onChange={(e) => setSettings({ ...settings, vk: e.target.value })}
                  placeholder="vk.com/buh_urist"
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки квиза */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Настройки квиза</CardTitle>
            <CardDescription className="text-sm">Конфигурация квиза на главной странице</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quiz_mode" className="text-sm">Режим квиза</Label>
              <Select value={settings.quiz_mode} onValueChange={(value) => setSettings({ ...settings, quiz_mode: value })}>
                <SelectTrigger className="h-8 text-sm mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Собственный</SelectItem>
                  <SelectItem value="external">Внешний сервис</SelectItem>
                  <SelectItem value="disabled">Отключен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quiz_url" className="text-sm">URL квиза</Label>
              <Input
                id="quiz_url"
                value={settings.quiz_url}
                onChange={(e) => setSettings({ ...settings, quiz_url: e.target.value })}
                placeholder="#popup:marquiz_685a59bddc273b0019e372cd"
                className="h-8 text-sm mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Системные настройки */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Системные настройки</CardTitle>
            <CardDescription className="text-sm">Режим обслуживания и аналитика</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Режим обслуживания</Label>
                <p className="text-xs text-gray-600">Временно закрыть сайт для посетителей</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Аналитика</Label>
                <p className="text-xs text-gray-600">Включить сбор статистики посещений</p>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, analyticsEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
