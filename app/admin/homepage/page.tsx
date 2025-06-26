"use client"

import { useAdminAuth } from "@/hooks/use-admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, Eye, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"

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
    alignment: "left" | "center" | "right"
    maxWidth: string
  }
}

const defaultConfig: HeroConfig = {
  badge: {
    text: "Защищаем ваш бизнес от налоговых рисков",
    show: true,
  },
  title: {
    text: "Ваш личный",
    highlightText: "щит",
  },
  description:
    "Пока вы строите свою империю, мы защищаем её тылы от проверок, штрафов и бумажной волокиты. Спокойно занимайтесь завоеванием мира.",
  button: {
    text: "Хочу на круиз без штрафов",
    show: true,
  },
  features: [
    {
      id: "expensive",
      title: "Дорого",
      description: "Штрафы и пени съедают прибыль",
      icon: "DollarSign",
      color: "red",
      show: true,
    },
    {
      id: "scary",
      title: "Страшно",
      description: "Проверки и бумажная волокита",
      icon: "AlertTriangle",
      color: "orange",
      show: true,
    },
    {
      id: "perfect",
      title: "Идеально",
      description: "Спокойствие и рост бизнеса",
      icon: "CheckCircle",
      color: "green",
      show: true,
    },
  ],
  background: {
    image: "/hero-bg.jpg",
    overlay: 30,
  },
  layout: {
    alignment: "left",
    maxWidth: "max-w-2xl",
  },
}

export default function HomepageEditor() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const [config, setConfig] = useState<HeroConfig>(defaultConfig)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/homepage")
        if (response.ok) {
          const data = await response.json()
          setConfig(data.hero || defaultConfig)
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
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hero: config }),
      })

      if (response.ok) {
        toast.success("Настройки главной страницы сохранены!")
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

  const updateFeature = (index: number, field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? { ...feature, [field]: value } : feature)),
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
    <div className="container py-8 max-w-4xl">
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Редактор главной страницы</h1>
            <p className="text-gray-600">Настройка контента и расположения элементов</p>
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
        {/* Левая колонка - Контент */}
        <div className="space-y-6">
          {/* Бейдж */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Верхний бейдж</CardTitle>
              <CardDescription>Небольшая плашка над заголовком</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    placeholder="Текст бейджа"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Заголовок */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Заголовок</CardTitle>
              <CardDescription>Основной заголовок страницы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title-text">Основной текст</Label>
                <Input
                  id="title-text"
                  value={config.title.text}
                  onChange={(e) => updateConfig("title.text", e.target.value)}
                  placeholder="Ваш личный"
                />
              </div>
              <div>
                <Label htmlFor="title-highlight">Выделенное слово</Label>
                <Input
                  id="title-highlight"
                  value={config.title.highlightText}
                  onChange={(e) => updateConfig("title.highlightText", e.target.value)}
                  placeholder="щит"
                />
              </div>
            </CardContent>
          </Card>

          {/* Описание */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Описание</CardTitle>
              <CardDescription>Подзаголовок под основным заголовком</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={config.description}
                onChange={(e) => updateConfig("description", e.target.value)}
                placeholder="Описание услуг..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Кнопка */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Кнопка призыва к действию</CardTitle>
              <CardDescription>Основная кнопка на странице</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - Дизайн и элементы */}
        <div className="space-y-6">
          {/* Расположение */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Расположение</CardTitle>
              <CardDescription>Выравнивание и ширина контента</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Выравнивание</Label>
                <Select
                  value={config.layout.alignment}
                  onValueChange={(value: "left" | "center" | "right") => updateConfig("layout.alignment", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">По левому краю</SelectItem>
                    <SelectItem value="center">По центру</SelectItem>
                    <SelectItem value="right">По правому краю</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Максимальная ширина</Label>
                <Select
                  value={config.layout.maxWidth}
                  onValueChange={(value) => updateConfig("layout.maxWidth", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="max-w-xl">Узкая (max-w-xl)</SelectItem>
                    <SelectItem value="max-w-2xl">Средняя (max-w-2xl)</SelectItem>
                    <SelectItem value="max-w-4xl">Широкая (max-w-4xl)</SelectItem>
                    <SelectItem value="max-w-6xl">Очень широкая (max-w-6xl)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Фон */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Фоновое изображение</CardTitle>
              <CardDescription>Настройка фона страницы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bg-image">URL изображения</Label>
                <Input
                  id="bg-image"
                  value={config.background.image}
                  onChange={(e) => updateConfig("background.image", e.target.value)}
                  placeholder="/hero-bg.jpg"
                />
              </div>
              <div>
                <Label>Прозрачность overlay: {config.background.overlay}%</Label>
                <Slider
                  value={[config.background.overlay]}
                  onValueChange={(value) => updateConfig("background.overlay", value[0])}
                  max={80}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Элементы-иконки */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Элементы с иконками</CardTitle>
              <CardDescription>Блоки "Дорого", "Страшно", "Идеально"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {config.features.map((feature, index) => (
                <div key={feature.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{feature.title}</h4>
                    <Switch
                      checked={feature.show}
                      onCheckedChange={(checked) => updateFeature(index, "show", checked)}
                    />
                  </div>
                  {feature.show && (
                    <>
                      <div>
                        <Label>Заголовок</Label>
                        <Input value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} />
                      </div>
                      <div>
                        <Label>Описание</Label>
                        <Input
                          value={feature.description}
                          onChange={(e) => updateFeature(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Иконка</Label>
                          <Select value={feature.icon} onValueChange={(value) => updateFeature(index, "icon", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DollarSign">Доллар</SelectItem>
                              <SelectItem value="AlertTriangle">Треугольник</SelectItem>
                              <SelectItem value="CheckCircle">Галочка</SelectItem>
                              <SelectItem value="Shield">Щит</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Цвет</Label>
                          <Select value={feature.color} onValueChange={(value) => updateFeature(index, "color", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="red">Красный</SelectItem>
                              <SelectItem value="orange">Оранжевый</SelectItem>
                              <SelectItem value="green">Зеленый</SelectItem>
                              <SelectItem value="blue">Синий</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
