import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">О нас</h4>
            <p className="text-gray-600">
              Мы - команда профессионалов, стремящихся предоставить лучшие решения для вашего бизнеса.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Компания</h4>
            <ul>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Вход в админку
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Поддержка</h4>
            <ul>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Поддержка
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">&copy; {new Date().getFullYear()} Все права защищены.</div>
      </div>
    </footer>
  )
}

export default Footer
