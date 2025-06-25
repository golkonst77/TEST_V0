"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, Phone, MessageCircle } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"

export function Header() {
  const { openContactForm } = useContactForm()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ПБ</span>
            </div>
            <span className="font-bold text-xl">ПростоБюро</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Услуги</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4">
                  <Link
                    href="/services/accounting"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Бухгалтерия</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Полное ведение учета, отчетность, консультации
                    </p>
                  </Link>
                  <Link
                    href="/services/payroll"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Зарплата и кадры</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Расчет зарплаты, кадровое делопроизводство
                    </p>
                  </Link>
                  <Link
                    href="/services/legal"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Юридическое сопровождение</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Налоговые споры, проверки, консультации
                    </p>
                  </Link>
                  <Link
                    href="/services/registration"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Регистрация фирм</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Регистрация ИП и ООО, изменения в ЕГРЮЛ
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Тарифы</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[300px] gap-3 p-4">
                  <Link
                    href="/pricing/ip"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Для ИП</div>
                    <p className="text-sm leading-snug text-muted-foreground">
                      Тарифы для индивидуальных предпринимателей
                    </p>
                  </Link>
                  <Link
                    href="/pricing/ooo"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Для ООО</div>
                    <p className="text-sm leading-snug text-muted-foreground">Тарифы для организаций</p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <Link
              href="/calculator"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Калькулятор
            </Link>
            <Link
              href="/about"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              О компании
            </Link>
            <Link
              href="/blog"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Блог
            </Link>
            <Link
              href="/contacts"
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Контакты
            </Link>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>+7 953 330-17-77</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="https://t.me/prostoburo" className="p-2 hover:bg-gray-100 rounded-full">
              <MessageCircle className="h-4 w-4" />
            </Link>
            <Link href="https://m.vk.com/buh_urist?from=groups" className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.4v1.608c0 .432-.138.69-1.276.69-1.966 0-4.644-1.193-6.36-3.428C4.304 11.13 3.568 8.28 3.568 7.648c0-.414.138-.69.966-.69h1.744c.69 0 .966.276 1.241 1.172.69 2.07 1.863 3.428 2.346 3.428.276 0 .414-.138.414-.9V9.936c-.069-1.241-.725-1.345-.725-1.793 0-.345.276-.69.725-.69h2.76c.588 0 .795.276.795.966v2.898c0 .588.276.795.414.795.276 0 .588-.207 1.172-.795 1.241-1.379 2.139-3.566 2.139-3.566.138-.345.414-.69 1.103-.69h1.744c.828 0 1.01.414.828.966-.414 1.24-2.484 4.062-2.484 4.062-.276.414-.207.588 0 .966.207.276 1.103 1.103 1.655 1.793.552.69.966 1.379.69 1.793z" />
              </svg>
            </Link>
          </div>
          <Button
            onClick={openContactForm}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Получить скидку
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                <Link href="/services" className="text-lg font-semibold">
                  Услуги
                </Link>
                <Link href="/pricing" className="text-lg font-semibold">
                  Тарифы
                </Link>
                <Link href="/calculator" className="text-lg font-semibold">
                  Калькулятор
                </Link>
                <Link href="/about" className="text-lg font-semibold">
                  О компании
                </Link>
                <Link href="/blog" className="text-lg font-semibold">
                  Блог
                </Link>
                <Link href="/contacts" className="text-lg font-semibold">
                  Контакты
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
