"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Menu, X, ChevronDown } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"
import { useCruiseClick } from "@/hooks/use-cruise-click"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, FileText, Loader2 } from "lucide-react"
import { Logo } from "./logo"
import { ReCAPTCHAComponent } from "./recaptcha"
import { useRouter, usePathname } from "next/navigation"
import { useHomepageSections } from "@/hooks/use-homepage-sections"
import { useDeviceType } from "@/hooks/use-device-type"
import { VersionBadge } from "./version-badge"

const MENU_ITEMS = [
  { id: 'services', title: 'Услуги', href: '/#services', isAnchor: true },
  { id: 'technologies', title: 'Технологии', href: '/#technologies', isAnchor: true },
  { id: 'pricing', title: 'Тарифы', href: '/#pricing', isAnchor: true },
  { id: 'faq', title: 'FAQ', href: '/#faq', isAnchor: true },
  { id: 'calculator', title: 'Калькулятор', href: '/#calculator', isAnchor: true },
  { id: 'reviews', title: 'Отзывы', href: '/#reviews', isAnchor: true },
  { id: 'contacts', title: 'Контакты', href: '/#contacts', isAnchor: true },
]

export const Header = () => {
  const { openContactForm } = useContactForm()
  const { handleCruiseClick, modalOpen, setModalOpen, quizUrl } = useCruiseClick()
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { isSectionVisible } = useHomepageSections()
  const deviceType = useDeviceType()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  // Фильтруем пункты меню на основе настроек видимости секций
  const visibleMenuItems = MENU_ITEMS.filter(item => {
    // Преобразуем тип устройства в формат для видимости секций
    const deviceTypeForVisibility = deviceType === 'tablet' ? 'desktop' : deviceType
    return isSectionVisible(item.id, deviceTypeForVisibility)
  })

  const handleMenuClick = (item: any) => (e: React.MouseEvent) => {
    if (item.isAnchor) {
      if (pathname !== "/") {
        e.preventDefault()
        router.push(item.href)
      }
    }
  }

  const renderMenuItem = (item: any) => {
    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={handleMenuClick(item)}
        className="rounded-lg px-4 py-2 font-medium bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200 hover:text-blue-700 shadow-sm"
      >
        {item.title}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-2">
            {visibleMenuItems.map(renderMenuItem)}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Открыть меню"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Right side widgets */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Быстрые контакты: телефон, Telegram, VK */}
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79533301777'}`}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{settings?.phone || '+7953 330-17-77'}</span>
            </a>
            <a
              href="https://t.me/prostoburo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xl:inline">Telegram</span>
            </a>
          </div>

          {/* CTA Button and Version */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCruiseClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Получить скидку
            </Button>
            <VersionBadge />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
                         <nav className="space-y-2">
               {visibleMenuItems.map((item) => (
                 <Link
                   key={item.id}
                   href={item.href}
                   onClick={() => setMobileMenuOpen(false)}
                   className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   {item.title}
                 </Link>
               ))}
              <div className="pt-4 border-t">
                <a
                  href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79533301777'}`}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{settings?.phone || '+7953 330-17-77'}</span>
                </a>
                <a
                  href="https://t.me/prostoburo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Telegram</span>
                </a>
                <Button
                  onClick={() => {
                    handleCruiseClick()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Получить скидку
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
