"use client"

import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye, RotateCcw, Plus, Trash2, GripVertical } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface MenuItem {
  id: string
  title: string
  href: string
  show: boolean
  type: "link" | "dropdown"
  children?: MenuItem[]
}

interface HeaderConfig {
  logo: {
    text: string
    show: boolean
  }
  phone: {
    number: string
    show: boolean
  }
  social: {
    telegram: string
    vk: string
    show: boolean
  }
  ctaButton: {
    text: string
    show: boolean
  }
  menuItems: MenuItem[]
  layout: {
    sticky: boolean
    background: "white" | "transparent" | "colored"
    height: number
  }
}

const defaultConfig: HeaderConfig = {
  logo: {
    text: "ПростоБюро",
    show: true,
  },
  phone: {
    number: "+7 953 330-17-77",
    show: true,
  },
  social: {
    telegram: "https://t.me/prostoburo",
    vk: "https://m.vk.com/buh_urist?from=groups",
    show: true,
  },
  ctaButton: {
    text: "Получить скидку",
    show: true,
  },
  menuItems: [
    {
      id: "services",
      title: "Услуги",
      href: "/services",
      show: true,
      type: "dropdown",
      children: [
        { id: "accounting", title: "Бухгалтерия", href: "/services/accounting", show: true, type: "link" },
        { id: "payroll", title: "Зарплата и кадры", href: "/services/payroll", show: true, type: "link" },
        { id: "legal", title: "Юридическое сопровождение", href: "/services/legal", show: true, type: "link" },
        { id: "registration", title: "Регистрация фирм", href: "/services/registration", show: true, type: "link" },
      ],
    },
    {
      id: "pricing",
      title: "Тарифы",
      href: "/pricing",
      show: true,
      type: "dropdown",
      children: [
        { id: "ip", title: "Для ИП", href: "/pricing/ip", show: true, type: "link" },
        { id: "ooo", title: "Для ООО", href: "/pricing/ooo", show: true, type: "link" },
      ],
    },
    { id: "calculator", title: "Калькулятор", href: "/calculator", show: true, type: "link" },
    { id: "about", title: "О компании", href: "/about", show: true, type: "link" },
    { id: "blog", title: "Блог", href: "/blog", show: true, type: "link" },
    { id: "contacts", title: "Контакты", href: "/contacts", show: true, type: "link" },
  ],
  layout: {
    sticky: true,
    background: "white",
    height: 64,
  },
}

export default function HeaderEditor() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/admin/header")
        if (response.ok) {
          const data = await response.json()
          setConfig(data.header || defaultConfig)
        }
      } catch (error) {
        console.error("Error fetching config:", error)
        setConfig(defaultConfig)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchConfig()
    }
  }, [isAuthenticated])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ header: config }),
      })

      if (response.ok) {
        toast.success("Настройки шапки сохранены!")
      } else {
        toast.error("Ошибка при сохранении настроек")
      }
    } catch (error) {
      console.error("Error saving config:", error)
      toast.error("Ошибка при сохранении настроек")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    toast.info("Настройки сброшены к значениям по умолчанию")
  }

  const updateConfig = (path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split(".")
      let current: any = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newConfig
    })
  }

  const updateMenuItem = (index: number, field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      title: "Новый пункт",
      href: "/new-page",
      show: true,
      type: "link",
    }
    setConfig((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem],
    }))
  }

  const removeMenuItem = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index),
    }))
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Редактор шапки сайта</h1>
            <p className="text-gray-600">Настройка меню, логотипа и элементов навигации</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Предпросмотр
            </Link>
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Левая колонка - Основные элементы */}
        <div className="space-y-6">
          {/* Логотип */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Логотип</CardTitle>
              <CardDescription>Настройка логотипа и названия компании</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch checked={config.logo.show} onCheckedChange={(checked) => updateConfig("logo.show", checked)} />
                <Label>Показывать логотип</Label>
              </div>
              {config.logo.show && (
                <div>
                  <Label htmlFor="logo-text">Название компании</Label>
                  <Input
                    id="logo-text"
                    value={config.logo.text}
                    onChange={(e) => updateConfig("logo.text", e.target.value)}
                    placeholder="ПростоБюро"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Телефон */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Контактный телефон</CardTitle>
              <CardDescription>Номер телефона в шапке сайта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.phone.show}
                  onCheckedChange={(checked) => updateConfig("phone.show", checked)}
                />
                <Label>Показывать телефон</Label>
              </div>
              {config.phone.show && (
                <div>
                  <Label htmlFor="phone-number">Номер телефона</Label>
                  <Input
                    id="phone-number"
                    value={config.phone.number}
                    onChange={(e) => updateConfig("phone.number", e.target.value)}
                    placeholder="+7 953 330-17-77"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Социальные сети */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Социальные сети</CardTitle>
              <CardDescription>Ссылки на социальные сети</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.social.show}
                  onCheckedChange={(checked) => updateConfig("social.show", checked)}
                />
                <Label>Показывать социальные сети</Label>
              </div>
              {config.social.show && (
                <>
                  <div>
                    <Label htmlFor="telegram-link">Ссылка на Telegram</Label>
                    <Input
                      id="telegram-link"
                      value={config.social.telegram}
                      onChange={(e) => updateConfig("social.telegram", e.target.value)}
                      placeholder="https://t.me/prostoburo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vk-link">Ссылка на VK</Label>
                    <Input
                      id="vk-link"
                      value={config.social.vk}
                      onChange={(e) => updateConfig("social.vk", e.target.value)}
                      placeholder="https://m.vk.com/buh_urist"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* CTA кнопка */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Кнопка призыва к действию</CardTitle>
              <CardDescription>Основная кнопка в шапке</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.ctaButton.show}
                  onCheckedChange={(checked) => updateConfig("ctaButton.show", checked)}
                />
                <Label>Показывать кнопку</Label>
              </div>
              {config.ctaButton.show && (
                <div>
                  <Label htmlFor="cta-text">Текст кнопки</Label>
                  <Input
                    id="cta-text"
                    value={config.ctaButton.text}
                    onChange={(e) => updateConfig("ctaButton.text", e.target.value)}
                    placeholder="Получить скидку"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - Меню и дизайн */}
        <div className="space-y-6">
          {/* Настройки дизайна */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Дизайн шапки</CardTitle>
              <CardDescription>Внешний вид и поведение</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.layout.sticky}
                  onCheckedChange={(checked) => updateConfig("layout.sticky", checked)}
                />
                <Label>Закрепить шапку при скролле</Label>
              </div>
              <div>
                <Label>Фон шапки</Label>
                <Select
                  value={config.layout.background}
                  onValueChange={(value) => updateConfig("layout.background", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">Белый</SelectItem>
                    <SelectItem value="transparent">Прозрачный</SelectItem>
                    <SelectItem value="colored">Цветной</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Высота шапки: {config.layout.height}px</Label>
                <Input
                  type="number"
                  value={config.layout.height}
                  onChange={(e) => updateConfig("layout.height", Number.parseInt(e.target.value) || 64)}
                  min={48}
                  max={120}
                />
              </div>
            </CardContent>
          </Card>

          {/* Пункты меню */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Пункты меню
                <Button onClick={addMenuItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </CardTitle>
              <CardDescription>Настройка навигационного меню</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.menuItems.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <h4 className="font-medium">{item.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={item.show}
                        onCheckedChange={(checked) => updateMenuItem(index, "show", checked)}
                      />
                      <Button onClick={() => removeMenuItem(index)} size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {item.show && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Название</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => updateMenuItem(index, "title", e.target.value)}
                            placeholder="Название пункта"
                          />
                        </div>
                        <div>
                          <Label>Ссылка</Label>
                          <Input
                            value={item.href}
                            onChange={(e) => updateMenuItem(index, "href", e.target.value)}
                            placeholder="/page"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Тип</Label>
                        <Select
                          value={item.type}
                          onValueChange={(value: "link" | "dropdown") => updateMenuItem(index, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">Обычная ссылка</SelectItem>
                            <SelectItem value="dropdown">Выпадающее меню</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
