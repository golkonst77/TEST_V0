"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, Eye, Upload, Image, Trash2 } from "lucide-react"

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
  const [config, setConfig] = useState<HeroConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>("")
  const [imageKey, setImageKey] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchConfig()
  }, [])

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
        setLastSaved(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error)
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

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log("Homepage: Uploading background image:", file.name)
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Homepage: Upload result:", data)
        
        // Обновляем состояние с новым URL изображения
        updateConfig("background.image", data.url)
        
        // Принудительно обновляем состояние для отображения
        setConfig(prev => prev ? {
          ...prev,
          background: {
            ...prev.background,
            image: data.url
          }
        } : prev)
        
        // Принудительно обновляем изображение
        setImageKey(prev => prev + 1)
        
        toast({
          title: "Изображение загружено!",
          description: "Фоновое изображение успешно загружено",
        })
        
        // Автосохранение через 500мс
        setTimeout(async () => {
          try {
            const saveResponse = await fetch("/api/admin/homepage", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                hero: {
                  ...config,
                  background: {
                    ...config?.background,
                    image: data.url
                  }
                }
              }),
            })
            
            if (saveResponse.ok) {
              setLastSaved(new Date().toLocaleTimeString())
              console.log("Homepage: Auto-saved after image upload")
            }
          } catch (error) {
            console.error("Homepage: Auto-save failed:", error)
          }
        }, 500)
        
      } else {
        const errorData = await response.json()
        console.error("Homepage: Upload error:", errorData)
        toast({
          title: "Ошибка",
          description: errorData.error || "Ошибка при загрузке изображения",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Homepage: Upload exception:', error)
      toast({
        title: "Ошибка",
        description: "Ошибка при загрузке изображения",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Редактор главной страницы" description="Настройка содержимого главной страницы">
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Загрузка редактора...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!config) {
    return (
      <AdminLayout title="Редактор главной страницы" description="Настройка содержимого главной страницы">
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Ошибка загрузки</h2>
          <p className="text-sm text-gray-600 mb-4">Не удалось загрузить настройки</p>
          <Button onClick={fetchConfig} size="sm">Попробовать снова</Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Редактор главной страницы" 
      description={lastSaved ? `Последнее сохранение: ${lastSaved}` : "Настройка содержимого главной страницы"}
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Просмотр
            </a>
          </Button>
          <Button onClick={saveConfig} disabled={saving} size="sm">
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
            <TabsTrigger value="features">Преимущества</TabsTrigger>
            <TabsTrigger value="layout">Оформление</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Основной контент</CardTitle>
                <CardDescription className="text-sm">Заголовки, описание и кнопки</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="badge-show" className="text-sm">Показывать бейдж</Label>
                  <Switch
                    id="badge-show"
                    checked={config.badge.show}
                    onCheckedChange={(checked) => updateConfig("badge.show", checked)}
                  />
                </div>
                {config.badge.show && (
                  <div>
                    <Label htmlFor="badge-text" className="text-sm">Текст бейджа</Label>
                    <Input
                      id="badge-text"
                      value={config.badge.text}
                      onChange={(e) => updateConfig("badge.text", e.target.value)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="title-text" className="text-sm">Основной заголовок</Label>
                  <Input
                    id="title-text"
                    value={config.title.text}
                    onChange={(e) => updateConfig("title.text", e.target.value)}
                    className="h-8 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="title-highlight" className="text-sm">Выделенное слово</Label>
                  <Input
                    id="title-highlight"
                    value={config.title.highlightText}
                    onChange={(e) => updateConfig("title.highlightText", e.target.value)}
                    className="h-8 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm">Описание</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => updateConfig("description", e.target.value)}
                    rows={3}
                    className="text-sm mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="button-show" className="text-sm">Показывать кнопку</Label>
                  <Switch
                    id="button-show"
                    checked={config.button.show}
                    onCheckedChange={(checked) => updateConfig("button.show", checked)}
                  />
                </div>
                {config.button.show && (
                  <div>
                    <Label htmlFor="button-text" className="text-sm">Текст кнопки</Label>
                    <Input
                      id="button-text"
                      value={config.button.text}
                      onChange={(e) => updateConfig("button.text", e.target.value)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Преимущества</CardTitle>
                <CardDescription className="text-sm">Настройка блоков преимуществ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.features.map((feature, index) => (
                  <Card key={feature.id} className="border border-gray-100">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{feature.title}</Label>
                        <Switch
                          checked={feature.show}
                          onCheckedChange={(checked) => updateFeature(index, "show", checked)}
                        />
                      </div>
                      {feature.show && (
                        <>
                          <div>
                            <Label className="text-xs">Заголовок</Label>
                            <Input
                              value={feature.title}
                              onChange={(e) => updateFeature(index, "title", e.target.value)}
                              className="h-7 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Описание</Label>
                            <Input
                              value={feature.description}
                              onChange={(e) => updateFeature(index, "description", e.target.value)}
                              className="h-7 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Цвет</Label>
                            <Select value={feature.color} onValueChange={(value) => updateFeature(index, "color", value)}>
                              <SelectTrigger className="h-7 text-sm mt-1">
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
                        </>
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
                <CardTitle className="text-base">Фоновое изображение</CardTitle>
                <CardDescription className="text-sm">Настройка фона главной страницы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Фоновое изображение</Label>
                  <div className="mt-2 space-y-3">
                    {config.background.image && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Image className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Текущее изображение</p>
                          <p className="text-xs text-gray-500">{config.background.image}</p>
                        </div>
                        <img 
                          src={`${config.background.image}?v=${imageKey}`} 
                          alt="Фон" 
                          className="h-16 w-24 object-cover rounded border"
                          key={`${config.background.image}-${imageKey}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateConfig("background.image", "")}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('background-upload')?.click()}
                        className="flex items-center space-x-2"
                        disabled={uploadingImage}
                      >
                        <Upload className="h-4 w-4" />
                        <span>{uploadingImage ? "Загрузка..." : "Загрузить изображение"}</span>
                      </Button>
                      <input
                        id="background-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload(file)
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Прямая ссылка на изображение</Label>
                      <Input
                        value={config.background.image}
                        onChange={(e) => updateConfig("background.image", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="h-8 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Затемнение фона: {config.background.overlay}%</Label>
                  <Slider
                    value={[config.background.overlay]}
                    onValueChange={([value]) => updateConfig("background.overlay", value)}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Прозрачно</span>
                    <span>Темно</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Расположение и отступы</CardTitle>
                <CardDescription className="text-sm">Настройка позиционирования контента</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Выравнивание</Label>
                  <Select value={config.layout.alignment} onValueChange={(value) => updateConfig("layout.alignment", value)}>
                    <SelectTrigger className="h-8 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Слева</SelectItem>
                      <SelectItem value="center">По центру</SelectItem>
                      <SelectItem value="right">Справа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Отступ слева: {config.layout.marginLeft}px</Label>
                  <Slider
                    value={[config.layout.marginLeft]}
                    onValueChange={([value]) => updateConfig("layout.marginLeft", value)}
                    max={200}
                    step={10}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm">Отступ сверху: {config.layout.marginTop}px</Label>
                  <Slider
                    value={[config.layout.marginTop]}
                    onValueChange={([value]) => updateConfig("layout.marginTop", value)}
                    max={100}
                    step={10}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm">Отступ снизу: {config.layout.marginBottom}px</Label>
                  <Slider
                    value={[config.layout.marginBottom]}
                    onValueChange={([value]) => updateConfig("layout.marginBottom", value)}
                    max={100}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
