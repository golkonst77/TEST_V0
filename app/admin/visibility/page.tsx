"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff, Monitor, Smartphone, Save, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface SectionConfig {
  desktop: 'published' | 'draft'
  mobile: 'published' | 'draft'
}

interface SectionsConfig {
  [key: string]: SectionConfig
}

interface SectionInfo {
  key: string
  title: string
  description: string
  icon: string
}

const SECTIONS_INFO: SectionInfo[] = [
  { key: 'hero', title: 'Главный баннер', description: 'Основной блок с заголовком и призывом к действию', icon: '🏠' },
  { key: 'about', title: 'О компании', description: 'Информация о компании и её преимуществах', icon: 'ℹ️' },
  { key: 'services', title: 'Услуги', description: 'Список предоставляемых услуг', icon: '🛠️' },
  { key: 'calculator', title: 'Калькулятор', description: 'Интерактивный калькулятор стоимости услуг', icon: '🧮' },
  { key: 'pricing', title: 'Тарифы', description: 'Тарифные планы и цены', icon: '💰' },
  { key: 'reviews', title: 'Отзывы', description: 'Отзывы клиентов о компании', icon: '⭐' },
  { key: 'guarantees', title: 'Гарантии', description: 'Гарантии качества и безопасности', icon: '🛡️' },
  { key: 'faq', title: 'FAQ', description: 'Часто задаваемые вопросы', icon: '❓' },
  { key: 'news', title: 'Новости', description: 'Последние новости и обновления', icon: '📰' },
  { key: 'contacts', title: 'Контакты', description: 'Контактная информация и форма связи', icon: '📞' },
  { key: 'technologies', title: 'Технологии', description: 'Используемые технологии и инструменты', icon: '⚙️' },
  { key: 'ai-documents', title: 'AI Документы', description: 'Искусственный интеллект для работы с документами', icon: '🤖' },
  { key: 'ausn-blob', title: 'Плашка АУСН', description: 'Плавающая кнопка “АУСН”', icon: '🟣' },
  { key: 'risk-blob', title: 'Плашка Риски', description: 'Плавающая кнопка “Риски дробления”', icon: '🟪' },
]

export default function AdminVisibilityPage() {
  const [sectionsConfig, setSectionsConfig] = useState<SectionsConfig>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSectionsConfig()
  }, [])

  const fetchSectionsConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/homepage-sections", { cache: "no-store" })
      if (response.ok) {
        const config = await response.json()
        setSectionsConfig(config)
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить настройки видимости",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching sections config:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки видимости",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSectionVisibility = (sectionKey: string, deviceType: 'desktop' | 'mobile') => {
    setSectionsConfig(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [deviceType]: prev[sectionKey]?.[deviceType] === 'published' ? 'draft' : 'published'
      }
    }))
  }

  const saveConfig = async () => {
    console.log("VISIBILITY SAVE START")
    setSaving(true)
    setSaveError(null)
    try {
      console.log("VISIBILITY SAVE PAYLOAD", sectionsConfig)
      const response = await fetch("/api/admin/visibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sectionsConfig),
      })

      const data = await response.json().catch(() => null)
      console.log("VISIBILITY SAVE RESPONSE", data)

      const success = response.ok && data?.success !== false
      if (success) {
        const savedAt = typeof data?.savedAt === "string" ? data.savedAt : null
        setLastSaved(savedAt ? new Date(savedAt).toLocaleTimeString() : new Date().toLocaleTimeString())
        toast({
          title: "Сохранено",
          description: "Видимость секций сохранена",
        })
        return
      }

      const message =
        (typeof data?.message === "string" && data.message) ||
        (typeof data?.error === "string" && data.error) ||
        "Не удалось сохранить настройки"
      setSaveError(message)
      toast({
        title: "Ошибка сохранения",
        description: message,
        variant: "destructive",
      })
    } catch (error) {
      console.error("VISIBILITY SAVE ERROR", error)
      setSaveError("Ошибка соединения с сервером")
      toast({
        title: "Ошибка соединения с сервером",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getSectionConfig = (sectionKey: string): SectionConfig => {
    return sectionsConfig[sectionKey] || { desktop: 'published', mobile: 'published' }
  }

  const getSectionInfo = (sectionKey: string): SectionInfo | undefined => {
    return SECTIONS_INFO.find(section => section.key === sectionKey)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление видимостью секций</h1>
            <p className="text-gray-600 mt-1">
              Настройте отображение секций для мобильных устройств и десктопа
            </p>
          </div>
          <Button
            onClick={saveConfig}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Сохраняем..." : "Сохранить"}
          </Button>
          {lastSaved ? <span className="text-xs text-gray-600">Сохранено в {lastSaved}</span> : null}
        </div>

        {/* Основная карточка с настройками */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Настройки видимости секций
            </CardTitle>
            <CardDescription>
              Включите или отключите отображение секций для разных типов устройств
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SECTIONS_INFO.map((sectionInfo) => {
                const config = getSectionConfig(sectionInfo.key)
                const isDesktopVisible = config.desktop === 'published'
                const isMobileVisible = config.mobile === 'published'

                return (
                  <div
                    key={sectionInfo.key}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{sectionInfo.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{sectionInfo.title}</h3>
                        <p className="text-xs text-gray-500">{sectionInfo.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      {/* Заголовки колонок */}
                      <div className="flex items-center space-x-6 text-xs font-medium text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-3 w-3" />
                          <span>Десктоп</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-3 w-3" />
                          <span>Мобильные</span>
                        </div>
                      </div>
                      
                      {/* Переключатели */}
                      <div className="flex items-center space-x-6">
                        {/* Десктоп */}
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={isDesktopVisible}
                            onCheckedChange={() => toggleSectionVisibility(sectionInfo.key, 'desktop')}
                            className="data-[state=checked]:bg-blue-600"
                          />
                          <Badge
                            variant={isDesktopVisible ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {isDesktopVisible ? "Вкл" : "Выкл"}
                          </Badge>
                        </div>

                        {/* Мобильные */}
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={isMobileVisible}
                            onCheckedChange={() => toggleSectionVisibility(sectionInfo.key, 'mobile')}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Badge
                            variant={isMobileVisible ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {isMobileVisible ? "Вкл" : "Выкл"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {Object.values(sectionsConfig).filter(config => config.desktop === 'published').length}
                </div>
                <div className="text-xs text-gray-600">Десктоп: Включено</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {Object.values(sectionsConfig).filter(config => config.mobile === 'published').length}
                </div>
                <div className="text-xs text-gray-600">Мобильные: Включено</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  {Object.values(sectionsConfig).filter(config => config.desktop === 'draft').length}
                </div>
                <div className="text-xs text-gray-600">Десктоп: Отключено</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardContent className="pb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">
                  {Object.values(sectionsConfig).filter(config => config.mobile === 'draft').length}
                </div>
                <div className="text-xs text-gray-600">Мобильные: Отключено</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Инструкция */}
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-blue-900 mb-2">Как это работает:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>🖥️ Десктоп</strong> (синий переключатель) - настройки для компьютеров и планшетов (ширина экрана ≥ 1024px)</li>
              <li>• <strong>📱 Мобильные</strong> (зеленый переключатель) - настройки для смартфонов (ширина экрана &lt; 1024px)</li>
              <li>• <strong>Вкл</strong> - секция отображается на соответствующем типе устройств</li>
              <li>• <strong>Выкл</strong> - секция скрыта на соответствующем типе устройств</li>
              <li>• Изменения применяются мгновенно после сохранения</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
