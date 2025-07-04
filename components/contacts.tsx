'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useContactForm } from "@/hooks/use-contact-form"
import { useCruiseClick } from "@/hooks/use-cruise-click"

interface Settings {
  phone: string
  email: string
  address: string
  telegram: string
  working_hours?: {
    monday_friday?: string
    saturday?: string
    sunday?: string
  }
}

export function Contacts() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const { openContactForm } = useContactForm()
  const { handleCruiseClick } = useCruiseClick()

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Ошибка загрузки настроек:', err))
  }, [])

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      value: settings?.phone || '+7953 777 77 77',
      href: `tel:${settings?.phone?.replace(/\s/g, '') || '+79537777777'}`,
      color: 'text-blue-400'
    },
    {
      icon: Mail,
      title: 'Email',
      value: settings?.email || 'golkonst@gmail.com',
      href: `mailto:${settings?.email || 'golkonst@gmail.com'}`,
      color: 'text-green-400'
    },
    {
      icon: MapPin,
      title: 'Адрес',
      value: settings?.address || 'Калуга',
      href: '#map',
      color: 'text-red-400'
    },
    {
      icon: MessageCircle,
      title: 'Telegram',
      value: settings?.telegram || '@prostoburo',
      href: `https://t.me/${settings?.telegram?.replace('@', '') || 'prostoburo'}`,
      color: 'text-cyan-400'
    }
  ]

  const workingHours = [
    { 
      day: 'Понедельник - Пятница', 
      time: settings?.working_hours?.monday_friday || '9:00 - 18:00' 
    },
    { 
      day: 'Суббота', 
      time: settings?.working_hours?.saturday || '10:00 - 15:00' 
    },
    { 
      day: 'Воскресенье', 
      time: settings?.working_hours?.sunday || 'Выходной' 
    }
  ]

  return (
    <section id="contacts" className="py-20 bg-gray-600 text-white">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Свяжитесь с нами
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Готовы обсудить ваш вопрос? Мы всегда на связи и готовы помочь
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Контактная информация */}
          <div className="space-y-8">
            {/* Контакты */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="group p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-blue-500"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-700 group-hover:bg-gray-600 ${contact.color}`}>
                      <contact.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-200">{contact.title}</h3>
                      <p className="text-gray-400 group-hover:text-white transition-colors">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Время работы */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-700">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold">Время работы</h3>
              </div>
              <div className="space-y-2">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-300">{schedule.day}</span>
                    <span className="text-white font-medium">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Быстрая связь */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Нужна срочная консультация?</h3>
              <p className="text-blue-100 mb-4">
                Оставьте заявку, и мы свяжемся с вами в течение 15 минут
              </p>
              <button 
                onClick={handleCruiseClick}
                className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Получить консультацию
              </button>
            </div>
          </div>

          {/* Карта */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-400" />
                  Как нас найти
                </h3>
                <p className="text-gray-400 text-sm mt-1">Наш офис находится в Калуге, удобная транспортная доступность</p>
              </div>
              <div id="map" className="relative">
                <a 
                  href="https://yandex.ru/maps/org/prosto_byuro/180493814174/?utm_medium=mapframe&utm_source=maps" 
                  style={{color:"#eee", fontSize:"12px", position:"absolute", top:"0px", zIndex: 10}}
                >
                  Просто Бюро
                </a>
                <a 
                  href="https://yandex.ru/maps/6/kaluga/category/accountants/184105392/?utm_medium=mapframe&utm_source=maps" 
                  style={{color:"#eee", fontSize:"12px", position:"absolute", top:"14px", zIndex: 10}}
                >
                  Бухгалтерские услуги в Калуге
                </a>
                <a 
                  href="https://yandex.ru/maps/6/kaluga/category/legal_services/184105630/?utm_medium=mapframe&utm_source=maps" 
                  style={{color:"#eee", fontSize:"12px", position:"absolute", top:"28px", zIndex: 10}}
                >
                  Юридические услуги в Калуге
                </a>
                <iframe 
                  src="https://yandex.ru/map-widget/v1/?ll=36.258698%2C54.512174&mode=search&oid=180493814174&ol=biz&sctx=ZAAAAAgBEAAaKAoSCY7pCUs8HkJAEQagUbr0N0tAEhIJj3IwmwDDvj8RkUdwI2WLpD8iBgABAgMEBSgKOABA5KINSAFiKHJlbGV2X3JhbmtpbmdfbDFfZm9ybXVsYT1sMV9kYzgwMzIyMV9leHBqAnJ1nQHNzMw9oAEAqAEAvQFbz5MXwgEGnpOUsqAFggIV0L%2FRgNC%2B0YHRgtC%2BINCx0Y7RgNC%2BigIAkgIAmgIMZGVza3RvcC1tYXBz&sll=36.258698%2C54.512174&sspn=0.120163%2C0.040052&text=%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%20%D0%B1%D1%8E%D1%80%D0%BE&z=14" 
                  width="100%" 
                  height="400" 
                  frameBorder="0" 
                  allowFullScreen={true} 
                  style={{position:"relative"}}
                  className="w-full rounded-lg"
                  title="Карта офиса Просто Бюро в Калуге"
                />
              </div>
              
              {/* Информация под картой */}
              <div className="p-4 bg-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Калуга, Россия</span>
                  <a 
                    href="https://yandex.ru/maps/org/prosto_byuro/180493814174/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Показать на карте →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Быстрый ответ</h3>
              <p className="text-gray-400 text-sm">
                Отвечаем на звонки и сообщения в течение 15 минут в рабочее время
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Удобное общение</h3>
              <p className="text-gray-400 text-sm">
                Предпочитаете мессенджеры? Мы активно используем Telegram и WhatsApp
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Гибкий график</h3>
              <p className="text-gray-400 text-sm">
                Можем встретиться в удобное для вас время, включая выходные
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 