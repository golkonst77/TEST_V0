'use client'

import React from 'react'

export function AIDocuments() {
  const services = [
    {
      id: '1c',
      title: '1С:Предприятие',
      subtitle: 'Облачная и локальная версии',
      description: 'Автоматизация всех учетных процессов',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="8" fill="#DC2626"/>
          <text x="24" y="32" textAnchor="middle" className="fill-white font-bold text-lg">1С</text>
        </svg>
      ),
      color: 'border-red-200 hover:border-red-300 bg-white/95 backdrop-blur-sm'
    },
    {
      id: 'diadok',
      title: 'Контур.Диадок',
      subtitle: 'Электронный документооборот',
      description: 'Экономия на бумаге и почте',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="8" fill="#059669"/>
          <path d="M12 16h24v16H12z" fill="white" stroke="#059669" strokeWidth="2"/>
          <path d="m16 20 8 4 8-4" stroke="#059669" strokeWidth="2" fill="none"/>
          <circle cx="38" cy="14" r="4" fill="#22C55E"/>
          <path d="m36 14 2 2 4-4" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      color: 'border-green-200 hover:border-green-300 bg-white/95 backdrop-blur-sm'
    },
    {
      id: 'banks',
      title: 'Банковские интеграции',
      subtitle: 'Тинькофф, Сбер, Альфа-Банк',
      description: 'Автоматическая загрузка выписок',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="8" fill="#2563EB"/>
          <rect x="8" y="16" width="32" height="20" rx="4" fill="white"/>
          <rect x="8" y="20" width="32" height="4" fill="#2563EB"/>
          <circle cx="14" cy="28" r="2" fill="#2563EB"/>
          <rect x="20" y="26" width="16" height="4" rx="2" fill="#E5E7EB"/>
        </svg>
      ),
      color: 'border-blue-200 hover:border-blue-300 bg-white/95 backdrop-blur-sm'
    },
    {
      id: 'signature',
      title: 'КЭП и ЭЦП',
      subtitle: 'Квалифицированная электронная подпись',
      description: 'Безопасная сдача отчетности',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="8" fill="#7C3AED"/>
          <path d="M16 20v-4a8 8 0 1 1 16 0v4" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="12" y="20" width="24" height="16" rx="4" fill="white"/>
          <circle cx="24" cy="28" r="3" fill="#7C3AED"/>
          <path d="M24 31v3" stroke="#7C3AED" strokeWidth="2"/>
        </svg>
      ),
      color: 'border-purple-200 hover:border-purple-300 bg-white/95 backdrop-blur-sm'
    }
  ]

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Автоматизация рутины',
      description: 'Ваши банковские выписки загружаются автоматически — никакого ручного ввода'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Мгновенная отчетность',
      description: 'Сдаем все в ФНС, ПФР, ФСС онлайн в день готовности'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Круглосуточный доступ',
      description: 'Ваши финансы всегда под рукой в Личном кабинете или облаке 1С'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Ноль арифметических ошибок',
      description: 'Автоматические расчеты зарплаты и налогов'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Безопасное хранение',
      description: 'Облачное хранение документов по стандартам 1С'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'ИИ-обработка документов',
      description: 'Автоматическая обработка и анализ документов с помощью искусственного интеллекта'
    }
  ]

  return (
    <section 
      className="py-16 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 58, 138, 0.85)), url('/tax-audit-bg.jpg')`
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100/20 backdrop-blur-sm rounded-full mb-6 border border-blue-200/30">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Сопровождение налоговых проверок
          </h2>
          <p className="text-xl text-blue-100 mb-4">
            Автоматическая обработка и анализ документов с помощью искусственного интеллекта
          </p>
          <p className="text-lg text-blue-200 max-w-4xl mx-auto">
            Наша система на базе ИИ автоматически распознает, классифицирует и обрабатывает ваши документы, 
            значительно ускоряя процесс ведения учета и снижая вероятность ошибок.
          </p>
          <button className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Узнать подробнее
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Карточки сервисов */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`${service.color} rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {service.subtitle}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительные возможности */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-blue-300 border border-blue-200/30">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-blue-100">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 