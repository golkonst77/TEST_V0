"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Menu, X, ChevronDown } from "lucide-react"
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

const MENU_ITEMS = [
  { id: 'pricing', title: 'Тарифы', href: '/#pricing', isAnchor: true },
  { id: 'faq', title: 'FAQ', href: '/#faq', isAnchor: true },
  { id: 'calculator', title: 'Калькулятор', href: '/#calculator', isAnchor: true },
  { id: 'reviews', title: 'Отзывы', href: '/#reviews', isAnchor: true },
  {
    id: "ausn-risk",
    title: "АУСН / Риски",
    href: "#",
    isAnchor: false,
    type: "dropdown",
    children: [
      { id: "ausn", title: "АУСН", href: "/ausn", isAnchor: false },
      { id: "risk", title: "Риски", href: "/risk", isAnchor: false },
    ],
  },
  { id: 'contacts', title: 'Контакты', href: '/#contacts', isAnchor: true },
]

interface HeaderMenuItem {
  id: string
  title: string
  href: string
  show?: boolean
  type?: "link" | "dropdown"
  isAnchor?: boolean
  children?: HeaderMenuItem[]
}

export const Header = () => {
  const { handleCruiseClick, modalOpen, setModalOpen, quizUrl } = useCruiseClick()
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [settings, setSettings] = useState<any>(null)
  const [dynamicMenuItems, setDynamicMenuItems] = useState<HeaderMenuItem[] | null>(null)
  const [ctaText, setCtaText] = useState("Получить консультацию")
  const router = useRouter()
  const pathname = usePathname()
  const { isSectionVisible } = useHomepageSections()
  const deviceType = useDeviceType()
  const phone = settings?.phone?.trim() || ""
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined

  useEffect(() => {
    const controller = new AbortController()
    const fetchSettings = async () => {
      try {
        const [settingsResponse, headerConfigResponse] = await Promise.all([
          fetch('/api/settings', {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch('/api/header-config', {
            cache: "no-store",
            signal: controller.signal,
          }),
        ])
        if (settingsResponse.ok) {
          const data = await settingsResponse.json()
          setSettings(data)
        }
        if (headerConfigResponse.ok) {
          const headerData = await headerConfigResponse.json()
          const mapMenuItem = (item: any): HeaderMenuItem => ({
            id: String(item.id),
            title: String(item.title || ""),
            href: String(item.href || "#"),
            show: item.show !== false,
            type: item.type === "dropdown" ? "dropdown" : "link",
            isAnchor: String(item.href || "").startsWith("/#"),
            children: Array.isArray(item.children)
              ? item.children
                  .filter((child: any) => child && child.show !== false)
                  .map(mapMenuItem)
              : undefined,
          })

          const menu = Array.isArray(headerData?.menuItems)
            ? headerData.menuItems
                .filter((item: any) => item && item.show !== false)
                .map(mapMenuItem)
            : null
          if (menu && menu.length > 0) {
            setDynamicMenuItems(menu)
          }
          if (typeof headerData?.ctaText === "string" && headerData.ctaText.trim().length > 0) {
            setCtaText(headerData.ctaText)
          }
        }
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error('Error fetching settings:', error)
        }
      }
    }
    fetchSettings()
    return () => controller.abort()
  }, [])

  // Фильтруем пункты меню на основе настроек видимости секций
  const menuSource = dynamicMenuItems && dynamicMenuItems.length > 0 ? dynamicMenuItems : MENU_ITEMS
  const visibleMenuItems = menuSource.filter(item => {
    if (item.type === "dropdown") return (item as any).show !== false
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
    if (item.type === "dropdown" && Array.isArray(item.children)) {
      const isOpen = openDropdownId === item.id
      return (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => setOpenDropdownId(item.id)}
          onMouseLeave={() => setOpenDropdownId((prev) => (prev === item.id ? null : prev))}
        >
          <button
            type="button"
            onClick={() => setOpenDropdownId((prev) => (prev === item.id ? null : item.id))}
            className="rounded-lg px-4 py-2 font-medium bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200 hover:text-blue-700 shadow-sm inline-flex items-center gap-1"
            aria-expanded={isOpen}
            aria-haspopup="menu"
          >
            {item.title}
            <ChevronDown className="h-4 w-4" />
          </button>
          <div
            className={`absolute left-0 top-full mt-1 min-w-[180px] rounded-lg border bg-white shadow-lg z-[70] ${isOpen ? "block" : "hidden group-hover:block"}`}
            role="menu"
          >
            {item.children.filter((child: HeaderMenuItem) => child.show !== false).map((child: HeaderMenuItem) => (
              <Link
                key={child.id}
                href={child.href}
                onClick={() => setOpenDropdownId(null)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      )
    }
    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={(e) => {
          setOpenDropdownId(null)
          handleMenuClick(item)(e)
        }}
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
              href={phoneHref}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{phone}</span>
            </a>
            <a
              href="https://t.me/prostoburo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Telegram"
            >
              <MessageCircle className="h-4 w-4 text-blue-500 hover:text-blue-600 transition-colors" />
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center">
            <Button
              onClick={handleCruiseClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
                         <nav className="space-y-2">
               {visibleMenuItems.map((item) => (
                 item.type === "dropdown" && Array.isArray(item.children) ? (
                  <div key={item.id} className="px-4 py-2 text-gray-700 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOpenDropdownId((prev) => (prev === item.id ? null : item.id))}
                      className="w-full text-left font-medium mb-2 inline-flex items-center justify-between"
                      aria-expanded={openDropdownId === item.id}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className={`pl-2 space-y-1 ${openDropdownId === item.id ? "block" : "hidden"}`}>
                      {item.children.filter((child) => (child as any).show !== false).map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                 ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {item.title}
                  </Link>
                 )
               ))}
              <div className="pt-4 border-t">
                <a
                  href={phoneHref}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{phone}</span>
                </a>
                <a
                  href="https://t.me/prostoburo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Telegram"
                >
                  <MessageCircle className="h-4 w-4 text-blue-500 hover:text-blue-600 transition-colors" />
                </a>
                <Button
                  onClick={() => {
                    handleCruiseClick()
                    setMobileMenuOpen(false)
                    setOpenDropdownId(null)
                  }}
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {ctaText}
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
