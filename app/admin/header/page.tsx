"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, RotateCcw, Plus, Trash2, Upload, Image } from "lucide-react"
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
    type: "text" | "image"
    imageUrl?: string
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
    type: "text",
    imageUrl: "",
  },
  phone: {
    number: "+7 953 777 77 77",
    show: true,
  },
  social: {
    telegram: "@prostoburo",
    vk: "vk.com/buh_urist",
    show: true,
  },
  ctaButton: {
    text: "Получить скидку",
    show: true,
  },
  menuItems: [
    { id: "calculator", title: "Калькулятор", href: "/calculator", show: true, type: "link" },
    { id: "pricing", title: "Тарифы", href: "/pricing", show: true, type: "link" },
    { id: "contacts", title: "Контакты", href: "/contacts", show: true, type: "link" },
  ],
  layout: {
    sticky: true,
    background: "white",
    height: 64,
  },
}

export default function HeaderEditor() {
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/admin/header")
        if (response.ok) {
          const data = await response.json()
          console.log("HeaderEditor: Fetched config:", data)
          setConfig(data.header || defaultConfig)
        }
      } catch (error) {
        console.error("Error fetching config:", error)
        setConfig(defaultConfig)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("HeaderEditor: Saving config:", config)
      const response = await fetch("/api/admin/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ header: config }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("HeaderEditor: Save result:", result)
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
    console.log("HeaderEditor: Updating config path:", path, "value:", value)
    setConfig((prev) => {
      const newConfig = { ...prev }
      const keys = path.split(".")
      let current: any = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      console.log("HeaderEditor: New config:", newConfig)
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

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log("HeaderEditor: Uploading logo file:", file.name)
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log("HeaderEditor: Upload result:", data)
        updateConfig("logo.imageUrl", data.url)
        toast.success("Логотип загружен!")
        
        // Автосохранение после загрузки
        setTimeout(() => {
          handleSave()
        }, 500)
      } else {
        const errorData = await response.json()
        console.error("HeaderEditor: Upload error:", errorData)
        toast.error(errorData.error || "Ошибка при загрузке логотипа")
      }
    } catch (error) {
      console.error('HeaderEditor: Upload exception:', error)
      toast.error("Ошибка при загрузке логотипа")
    } finally {
      setUploadingLogo(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Редактор шапки сайта" description="Настройка навигации и элементов шапки">
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка редактора...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Редактор шапки сайта" 
      description="Настройка навигации и элементов шапки"
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Сброс
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Просмотр
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="menu">Меню</TabsTrigger>
            <TabsTrigger value="layout">Оформление</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Логотип и контакты</CardTitle>
                <CardDescription className="text-sm">Основные элементы шапки</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-show" className="text-sm">Показывать логотип</Label>
                  <Switch
                    id="logo-show"
                    checked={config.logo.show}
                    onCheckedChange={(checked) => updateConfig("logo.show", checked)}
                  />
                </div>
                {config.logo.show && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Тип логотипа</Label>
                      <Select value={config.logo.type} onValueChange={(value) => updateConfig("logo.type", value)}>
                        <SelectTrigger className="h-8 text-sm mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Текстовый</SelectItem>
                          <SelectItem value="image">Изображение</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {config.logo.type === "text" ? (
                      <div>
                        <Label htmlFor="logo-text" className="text-sm">Текст логотипа</Label>
                        <Input
                          id="logo-text"
                          value={config.logo.text}
                          onChange={(e) => updateConfig("logo.text", e.target.value)}
                          className="h-8 text-sm mt-1"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-sm">Изображение логотипа</Label>
                        <div className="mt-2 space-y-3">
                          {config.logo.imageUrl && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Image className="h-5 w-5 text-gray-400" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Текущий логотип</p>
                                <p className="text-xs text-gray-500">{config.logo.imageUrl}</p>
                              </div>
                              <img 
                                src={config.logo.imageUrl} 
                                alt="Логотип" 
                                className="h-10 w-10 object-contain rounded border"
                              />
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('logo-upload')?.click()}
                              className="flex items-center space-x-2"
                              disabled={uploadingLogo}
                            >
                              <Upload className="h-4 w-4" />
                              <span>{uploadingLogo ? "Загрузка..." : "Загрузить логотип"}</span>
                            </Button>
                            <input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleLogoUpload(file)
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone-show" className="text-sm">Показывать телефон</Label>
                  <Switch
                    id="phone-show"
                    checked={config.phone.show}
                    onCheckedChange={(checked) => updateConfig("phone.show", checked)}
                  />
                </div>
                {config.phone.show && (
                  <div>
                    <Label htmlFor="phone-number" className="text-sm">Номер телефона</Label>
                    <Input
                      id="phone-number"
                      value={config.phone.number}
                      onChange={(e) => updateConfig("phone.number", e.target.value)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label htmlFor="social-show" className="text-sm">Показывать соцсети</Label>
                  <Switch
                    id="social-show"
                    checked={config.social.show}
                    onCheckedChange={(checked) => updateConfig("social.show", checked)}
                  />
                </div>
                {config.social.show && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telegram" className="text-sm">Telegram</Label>
                      <Input
                        id="telegram"
                        value={config.social.telegram}
                        onChange={(e) => updateConfig("social.telegram", e.target.value)}
                        className="h-8 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vk" className="text-sm">ВКонтакте</Label>
                      <Input
                        id="vk"
                        value={config.social.vk}
                        onChange={(e) => updateConfig("social.vk", e.target.value)}
                        className="h-8 text-sm mt-1"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label htmlFor="cta-show" className="text-sm">Показывать кнопку CTA</Label>
                  <Switch
                    id="cta-show"
                    checked={config.ctaButton.show}
                    onCheckedChange={(checked) => updateConfig("ctaButton.show", checked)}
                  />
                </div>
                {config.ctaButton.show && (
                  <div>
                    <Label htmlFor="cta-text" className="text-sm">Текст кнопки</Label>
                    <Input
                      id="cta-text"
                      value={config.ctaButton.text}
                      onChange={(e) => updateConfig("ctaButton.text", e.target.value)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Пункты меню
                  <Button onClick={addMenuItem} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </CardTitle>
                <CardDescription className="text-sm">Настройка навигационного меню</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.menuItems.map((item, index) => (
                  <Card key={item.id} className="border border-gray-100">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{item.title}</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.show}
                            onCheckedChange={(checked) => updateMenuItem(index, "show", checked)}
                          />
                          <Button
                            onClick={() => removeMenuItem(index)}
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {item.show && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Название</Label>
                            <Input
                              value={item.title}
                              onChange={(e) => updateMenuItem(index, "title", e.target.value)}
                              className="h-7 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Ссылка</Label>
                            <Input
                              value={item.href}
                              onChange={(e) => updateMenuItem(index, "href", e.target.value)}
                              className="h-7 text-sm mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Внешний вид</CardTitle>
                <CardDescription className="text-sm">Настройка стилей и поведения шапки</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sticky" className="text-sm">Закрепленная шапка</Label>
                  <Switch
                    id="sticky"
                    checked={config.layout.sticky}
                    onCheckedChange={(checked) => updateConfig("layout.sticky", checked)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Фон шапки</Label>
                  <Select value={config.layout.background} onValueChange={(value) => updateConfig("layout.background", value)}>
                    <SelectTrigger className="h-8 text-sm mt-1">
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
                  <Label className="text-sm">Высота шапки</Label>
                  <Select value={config.layout.height.toString()} onValueChange={(value) => updateConfig("layout.height", parseInt(value))}>
                    <SelectTrigger className="h-8 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="56">Компактная (56px)</SelectItem>
                      <SelectItem value="64">Обычная (64px)</SelectItem>
                      <SelectItem value="72">Большая (72px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
