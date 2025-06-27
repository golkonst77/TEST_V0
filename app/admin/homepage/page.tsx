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
import { ArrowLeft, Save, Eye, RefreshCw } from "lucide-react"
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
  const [lastSaved, setLastSaved] = useState<string>("")

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfig()
    }
  }, [isAuthenticated])

  const fetchConfig = async () => {
    console.log("Загрузка конфигурации главной страницы...")
    try {
      const response = await fetch("/api/admin/homepage")
      console.log("Ответ сервера:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Полученные данные:", data)
        setConfig(data.hero)
      } else {
        console.error("Ошибка ответа сервера:", response.status)
      }
    } catch (error) {
      console.error("Ошибка загрузки конфигурации:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    if (!config) return

    console.log("Сохранение конфигурации:", config)
    setSaving(true)

    try {
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero: config }),
      })

      console.log("Ответ при сохранении:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Результат сохранения:", result)
        setLastSaved(new Date().toLocaleTimeString())
        alert("✅ Настройки главной страницы сохранены!")
      } else {
        console.error("Ошибка сохранения:", response.status)
        alert("❌ Ошибка сохранения")
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error)
      alert("❌ Ошибка сохранения")
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (path: string, value: any) => {
    if (!config) return

    console.log(`Обновление ${path}:`, value)
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

    console.log(`Обновление элемента ${index}, поле ${field}:`, value)
    const newFeatures = [...config.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setConfig({ ...config, features: newFeatures })
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Загрузка редактора...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="mb-4">Необходимо войти в систему</p>
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
          <p className="mb-4">Не удалось загрузить настройки</p>
          <Button onClick={fetchConfig}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка редактора */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад в админку
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Редактор главной страницы</h1>
                {lastSaved && <p className="text-sm text-gray-500">Последнее сохранение: {lastSaved}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Предпросмотр
                </Button>
              </Link>
              <Button onClick={saveConfig} disabled={saving} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">📝 Контент</TabsTrigger>
            <TabsTrigger value="features">🎯 Элементы</TabsTrigger>
            <TabsTrigger value="design">🎨 Дизайн</TabsTrigger>
            <TabsTrigger value="layout">📐 Расположение</TabsTrigger>
          </TabsList>

          {/* Вкладка Контент */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основной контент</CardTitle>
                <CardDescription>Редактирование текстов главной страницы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Бейдж */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.badge.show}
                      onCheckedChange={(checked) => updateConfig("badge.show", checked)}
                    />
                    <Label className="font-medium">Показывать бейдж</Label>
                  </div>
                  {config.badge.show && (
                    <div>
                      <Label htmlFor="badge-text">Текст бейджа</Label>
                      <Input
                        id="badge-text"
                        value={config.badge.text}
                        onChange={(e) => updateConfig("badge.text", e.target.value)}
                        placeholder="Защищаем ваш бизнес..."
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                {/* Заголовок */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title-text">Основной заголовок</Label>
                    <Input
                      id="title-text"
                      value={config.title.text}
                      onChange={(e) => updateConfig("title.text", e.target.value)}
                      placeholder="Ваш личный"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="highlight-text">Выделенное слово</Label>
                    <Input
                      id="highlight-text"
                      value={config.title.highlightText}
                      onChange={(e) => updateConfig("title.highlightText", e.target.value)}
                      placeholder="щит"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Описание */}
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => updateConfig("description", e.target.value)}
                    placeholder="Пока вы строите свою империю..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {/* Кнопка */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.button.show}
                      onCheckedChange={(checked) => updateConfig("button.show", checked)}
                    />
                    <Label className="font-medium">Показывать кнопку</Label>
                  </div>
                  {config.button.show && (
                    <div>
                      <Label htmlFor="button-text">Текст кнопки</Label>
                      <Input
                        id="button-text"
                        value={config.button.text}
                        onChange={(e) => updateConfig("button.text", e.target.value)}
                        placeholder="Хочу на круиз без штрафов"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка Элементы */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Элементы страницы</CardTitle>
                <CardDescription>Настройка иконок и блоков</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {config.features.map((feature, index) => (
                  <Card key={feature.id} className="p-4 border-l-4 border-l-blue-500">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lg">
                          {feature.title} ({feature.id})
                        </h4>
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
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Цвет</Label>
                            <Select
                              value={feature.color}
                              onValueChange={(value) => updateFeature(index, "color", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="red">🔴 Красный</SelectItem>
                                <SelectItem value="orange">🟠 Оранжевый</SelectItem>
                                <SelectItem value="green">🟢 Зеленый</SelectItem>
                                <SelectItem value="blue">🔵 Синий</SelectItem>
                                <SelectItem value="purple">🟣 Фиолетовый</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label>Описание</Label>
                            <Textarea
                              value={feature.description}
                              onChange={(e) => updateFeature(index, "description", e.target.value)}
                              rows={2}
                              className="mt-1"
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

          {/* Вкладка Дизайн */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Дизайн и фон</CardTitle>
                <CardDescription>Настройка внешнего вида</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bg-image">URL фонового изображения</Label>
                  <Input
                    id="bg-image"
                    value={config.background.image}
                    onChange={(e) => updateConfig("background.image", e.target.value)}
                    placeholder="/hero-bg.jpg"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Текущее изображение: {config.background.image}</p>
                </div>

                <div>
                  <Label>Прозрачность overlay: {config.background.overlay}%</Label>
                  <Slider
                    value={[config.background.overlay]}
                    onValueChange={(value) => updateConfig("background.overlay", value[0])}
                    max={100}
                    step={5}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Прозрачный</span>
                    <span>Непрозрачный</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка Расположение */}
          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Расположение элементов</CardTitle>
                <CardDescription>Настройка отступов и позиционирования</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Выравнивание</Label>
                  <Select
                    value={config.layout.alignment}
                    onValueChange={(value) => updateConfig("layout.alignment", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">⬅️ Слева</SelectItem>
                      <SelectItem value="center">⬆️ По центру</SelectItem>
                      <SelectItem value="right">➡️ Справа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Отступ слева: {config.layout.marginLeft}px</Label>
                  <Slider
                    value={[config.layout.marginLeft]}
                    onValueChange={(value) => updateConfig("layout.marginLeft", value[0])}
                    max={300}
                    step={10}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label>Отступ сверху: {config.layout.marginTop}px</Label>
                  <Slider
                    value={[config.layout.marginTop]}
                    onValueChange={(value) => updateConfig("layout.marginTop", value[0])}
                    max={200}
                    step={10}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label>Отступ снизу: {config.layout.marginBottom}px</Label>
                  <Slider
                    value={[config.layout.marginBottom]}
                    onValueChange={(value) => updateConfig("layout.marginBottom", value[0])}
                    max={200}
                    step={10}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label>Внутренние отступы: {config.layout.paddingX}px</Label>
                  <Slider
                    value={[config.layout.paddingX]}
                    onValueChange={(value) => updateConfig("layout.paddingX", value[0])}
                    max={100}
                    step={5}
                    className="w-full mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Отладочная информация */}
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">🔧 Отладочная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-2">
              <p>
                <strong>Заголовок:</strong> {config.title.text} "{config.title.highlightText}"
              </p>
              <p>
                <strong>Кнопка:</strong> {config.button.show ? config.button.text : "Скрыта"}
              </p>
              <p>
                <strong>Отступ слева:</strong> {config.layout.marginLeft}px
              </p>
              <p>
                <strong>Активных элементов:</strong> {config.features.filter((f) => f.show).length} из{" "}
                {config.features.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
