"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { useAdminAuth } from "@/hooks/use-admin-auth"

interface HeroConfig {
  badge: {
    text: string
    show: boolean
  }
  title: {
    text: string
    highlightText: string
  }
  description: string
  button: {
    text: string
    show: boolean
  }
  features: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
    show: boolean
  }>
  background: {
    image: string
    overlay: number
  }
  layout: {
    alignment: string
    maxWidth: string
    marginLeft: number
    marginTop: number
    marginBottom: number
    paddingX: number
  }
}

export default function HomepageEditor() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [config, setConfig] = useState<HeroConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfig()
    }
  }, [isAuthenticated])

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/admin/homepage")
      if (response.ok) {
        const data = await response.json()
        setConfig(data.hero)
      }
    } catch (error) {
      console.error("Ошибка загрузки конфигурации:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    if (!config) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero: config }),
      })

      if (response.ok) {
        alert("Настройки сохранены!")
      } else {
        alert("Ошибка сохранения")
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка сохранения")
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (path: string, value: any) => {
    if (!config) return

    const newConfig = { ...config }
    const keys = path.split(".")
    let current: any = newConfig

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setConfig(newConfig)
  }

  const updateFeature = (index: number, field: string, value: any) => {
    if (!config) return

    const newFeatures = [...config.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setConfig({ ...config, features: newFeatures })
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <Link href="/admin/login">
            <Button>Войти в систему</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ошибка загрузки</h1>
          <Button onClick={fetchConfig}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад в админку
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Редактор главной страницы</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Предпросмотр
                </Button>
              </Link>
              <Button onClick={saveConfig} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="features">Элементы</TabsTrigger>
            <TabsTrigger value="design">Дизайн</TabsTrigger>
            <TabsTrigger value="layout">Расположение</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основной контент</CardTitle>
                <CardDescription>Редактирование текстов главной страницы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.badge.show}
                      onCheckedChange={(checked) => updateConfig("badge.show", checked)}
                    />
                    <Label>Показывать бейдж</Label>
                  </div>
                  {config.badge.show && (
                    <div>
                      <Label htmlFor="badge-text">Текст бейджа</Label>
                      <Input
                        id="badge-text"
                        value={config.badge.text}
                        onChange={(e) => updateConfig("badge.text", e.target.value)}
                        placeholder="Защищаем ваш бизнес..."
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title-text">Основной заголовок</Label>
                  <Input
                    id="title-text"
                    value={config.title.text}
                    onChange={(e) => updateConfig("title.text", e.target.value)}
                    placeholder="Ваш личный"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlight-text">Выделенное слово</Label>
                  <Input
                    id="highlight-text"
                    value={config.title.highlightText}
                    onChange={(e) => updateConfig("title.highlightText", e.target.value)}
                    placeholder="щит"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => updateConfig("description", e.target.value)}
                    placeholder="Пока вы строите свою империю..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.button.show}
                      onCheckedChange={(checked) => updateConfig("button.show", checked)}
                    />
                    <Label>Показывать кнопку</Label>
                  </div>
                  {config.button.show && (
                    <div>
                      <Label htmlFor="button-text">Текст кнопки</Label>
                      <Input
                        id="button-text"
                        value={config.button.text}
                        onChange={(e) => updateConfig("button.text", e.target.value)}
                        placeholder="Хочу на круиз без штрафов"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Элементы страницы</CardTitle>
                <CardDescription>Настройка иконок и блоков</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {config.features.map((feature, index) => (
                  <Card key={feature.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Элемент {index + 1}</h4>
                        <Switch
                          checked={feature.show}
                          onCheckedChange={(checked) => updateFeature(index, "show", checked)}
                        />
                      </div>

                      {feature.show && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Заголовок</Label>
                            <Input
                              value={feature.title}
                              onChange={(e) => updateFeature(index, "title", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Цвет</Label>
                            <Select
                              value={feature.color}
                              onValueChange={(value) => updateFeature(index, "color", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="red">Красный</SelectItem>
                                <SelectItem value="orange">Оранжевый</SelectItem>
                                <SelectItem value="green">Зеленый</SelectItem>
                                <SelectItem value="blue">Синий</SelectItem>
                                <SelectItem value="purple">Фиолетовый</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label>Описание</Label>
                            <Textarea
                              value={feature.description}
                              onChange={(e) => updateFeature(index, "description", e.target.value)}
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Дизайн и фон</CardTitle>
                <CardDescription>Настройка внешнего вида</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bg-image">URL фонового изображения</Label>
                  <Input
                    id="bg-image"
                    value={config.background.image}
                    onChange={(e) => updateConfig("background.image", e.target.value)}
                    placeholder="/hero-bg.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Прозрачность overlay: {config.background.overlay}%</Label>
                  <Slider
                    value={[config.background.overlay]}
                    onValueChange={(value) => updateConfig("background.overlay", value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Расположение элементов</CardTitle>
                <CardDescription>Настройка отступов и позиционирования</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Выравнивание</Label>
                  <Select
                    value={config.layout.alignment}
                    onValueChange={(value) => updateConfig("layout.alignment", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Слева</SelectItem>
                      <SelectItem value="center">По центру</SelectItem>
                      <SelectItem value="right">Справа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Отступ слева: {config.layout.marginLeft}px</Label>
                  <Slider
                    value={[config.layout.marginLeft]}
                    onValueChange={(value) => updateConfig("layout.marginLeft", value[0])}
                    max={300}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Отступ сверху: {config.layout.marginTop}px</Label>
                  <Slider
                    value={[config.layout.marginTop]}
                    onValueChange={(value) => updateConfig("layout.marginTop", value[0])}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Отступ снизу: {config.layout.marginBottom}px</Label>
                  <Slider
                    value={[config.layout.marginBottom]}
                    onValueChange={(value) => updateConfig("layout.marginBottom", value[0])}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Внутренние отступы: {config.layout.paddingX}px</Label>
                  <Slider
                    value={[config.layout.paddingX]}
                    onValueChange={(value) => updateConfig("layout.paddingX", value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
