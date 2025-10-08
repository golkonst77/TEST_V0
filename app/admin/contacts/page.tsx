"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"
import { useState, useEffect } from "react"

interface ContactInfo {
  phone: string
  email: string
  address: string
  telegram: string
  vk: string
  working_hours: {
    monday_friday: string
    saturday: string
    sunday: string
  }
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactInfo>({
    phone: "",
    email: "",
    address: "",
    telegram: "",
    vk: "",
    working_hours: {
      monday_friday: "9:00 - 18:00",
      saturday: "10:00 - 15:00",
      sunday: "Выходной"
    }
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Получаем данные из settings
        const settingsResponse = await fetch("/api/admin/settings")
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setContacts({
            phone: settingsData.phone || "",
            email: settingsData.email || "",
            address: settingsData.address || "",
            telegram: settingsData.telegram || "",
            vk: settingsData.vk || "",
            working_hours: settingsData.working_hours || {
              monday_friday: "9:00 - 18:00",
              saturday: "10:00 - 15:00",
              sunday: "Выходной"
            }
          })
        }

        // Получаем данные из settings для синхронизации
        const headerResponse = await fetch("/api/admin/settings")
        if (headerResponse.ok) {
          const headerData = await headerResponse.json()
          const header = headerData.header
          if (header) {
            setContacts(prev => ({
              ...prev,
              phone: header.phone?.number || prev.phone,
              telegram: header.social?.telegram || prev.telegram,
              vk: header.social?.vk || prev.vk
            }))
          }
        }

        setMessage("Контактная информация загружена")
      } catch (error) {
        setMessage("Ошибка загрузки контактной информации")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    
    try {
      // Сохраняем в настройки
      const settingsResponse = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: contacts.phone,
          email: contacts.email,
          address: contacts.address,
          telegram: contacts.telegram,
          vk: contacts.vk,
          working_hours: contacts.working_hours
        }),
      })

      // Синхронизируем с header
      const headerResponse = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          header: {
            phone: {
              number: contacts.phone,
              show: true
            },
            social: {
              telegram: contacts.telegram,
              vk: contacts.vk,
              show: true
            }
          }
        }),
      })

      if (settingsResponse.ok && headerResponse.ok) {
        setMessage("Контактная информация сохранена")
      } else {
        setMessage("Не удалось сохранить контактную информацию")
      }
    } catch (error) {
      setMessage("Ошибка подключения к серверу")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Контактная информация" description="Управление контактами компании">
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка контактной информации...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Контактная информация" 
      description="Управление контактами компании"
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
            message.includes("сохранена") || message.includes("загружена")
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}>
            {message}
          </div>
        )}

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
                  value={contacts.phone}
                  onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                  placeholder="+7 953 777 77 77"
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contacts.email}
                  onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                  placeholder="info@prostoburo.ru"
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-sm">Адрес</Label>
              <Input
                id="address"
                value={contacts.address}
                onChange={(e) => setContacts({ ...contacts, address: e.target.value })}
                placeholder="г. Москва"
                className="h-8 text-sm mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Время работы */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Время работы</CardTitle>
            <CardDescription className="text-sm">Рабочие часы для отображения в контактах</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="monday-friday" className="text-sm">Понедельник - Пятница</Label>
              <Input
                id="monday-friday"
                value={contacts.working_hours.monday_friday}
                onChange={(e) => setContacts({ 
                  ...contacts, 
                  working_hours: { 
                    ...contacts.working_hours, 
                    monday_friday: e.target.value 
                  } 
                })}
                placeholder="9:00 - 18:00"
                className="h-8 text-sm mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="saturday" className="text-sm">Суббота</Label>
                <Input
                  id="saturday"
                  value={contacts.working_hours.saturday}
                  onChange={(e) => setContacts({ 
                    ...contacts, 
                    working_hours: { 
                      ...contacts.working_hours, 
                      saturday: e.target.value 
                    } 
                  })}
                  placeholder="10:00 - 15:00"
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sunday" className="text-sm">Воскресенье</Label>
                <Input
                  id="sunday"
                  value={contacts.working_hours.sunday}
                  onChange={(e) => setContacts({ 
                    ...contacts, 
                    working_hours: { 
                      ...contacts.working_hours, 
                      sunday: e.target.value 
                    } 
                  })}
                  placeholder="Выходной"
                  className="h-8 text-sm mt-1"
                />
              </div>
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
                  value={contacts.telegram}
                  onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })}
                  placeholder="https://t.me/prostoburo"
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vk" className="text-sm">ВКонтакте</Label>
                <Input
                  id="vk"
                  value={contacts.vk}
                  onChange={(e) => setContacts({ ...contacts, vk: e.target.value })}
                  placeholder="https://vk.com/buh_urist"
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 