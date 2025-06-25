import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ПБ</span>
              </div>
              <span className="font-bold text-xl">ПростоБюро</span>
            </div>
            <p className="text-gray-400 mb-4">
              Ваш надежный партнер в области бухгалтерского учета и налогового планирования
            </p>
            <div className="flex space-x-4">
              <Link href="https://t.me/prostoburo" className="text-gray-400 hover:text-white">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="https://m.vk.com/buh_urist?from=groups" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.9-1.49.4v1.608c0 .432-.138.69-1.276.69-1.966 0-4.644-1.193-6.36-3.428C4.304 11.13 3.568 8.28 3.568 7.648c0-.414.138-.69.966-.69h1.744c.69 0 .966.276 1.241 1.172.69 2.07 1.863 3.428 2.346 3.428.276 0 .414-.138.414-.9V9.936c-.069-1.241-.725-1.345-.725-1.793 0-.345.276-.69.725-.69h2.76c.588 0 .795.276.795.966v2.898c0 .588.276.795.414.795.276 0 .588-.207 1.172-.795 1.241-1.379 2.139-3.566 2.139-3.566.138-.345.414-.69 1.103-.69h1.744c.828 0 1.01.414.828.966-.414 1.24-2.484 4.062-2.484 4.062-.276.414-.207.588 0 .966.207.276 1.103 1.103 1.655 1.793.552.69.966 1.379.69 1.793z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Услуги</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/services/accounting" className="hover:text-white">
                  Бухгалтерия
                </Link>
              </li>
              <li>
                <Link href="/services/payroll" className="hover:text-white">
                  Зарплата и кадры
                </Link>
              </li>
              <li>
                <Link href="/services/legal" className="hover:text-white">
                  Юридическое сопровождение
                </Link>
              </li>
              <li>
                <Link href="/services/registration" className="hover:text-white">
                  Регистрация фирм
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Компания</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/about/team" className="hover:text-white">
                  Команда
                </Link>
              </li>
              <li>
                <Link href="/about/advantages" className="hover:text-white">
                  Преимущества
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Контакты</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Калуга, ул. Дзержинского 37, офис 20</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+79533301777" className="hover:text-white">
                  +7 953 330-17-77
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:urist40@gmail.com" className="hover:text-white">
                  urist40@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 ПростоБюро. Все права защищены.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
