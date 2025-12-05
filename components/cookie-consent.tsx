'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import ReactMarkdown from "react-markdown"

interface ConsentSettings {
  essential: boolean
  analytics: boolean
  marketing: boolean
  timestamp?: string
  version?: string
}

interface CookieConsentProps {
  ymId?: string
}

export function CookieConsent({ ymId = '45860892' }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [policyText, setPolicyText] = useState("")
  const [settings, setSettings] = useState<ConsentSettings>({
    essential: true,
    analytics: false, // ВАЖНО: opt-in согласие по требованию ФЗ-152
    marketing: false,
  })

  useEffect(() => {
    // Проверяем наличие сохраненного согласия
    const consent = getConsent()
    if (!consent) {
      setShowBanner(true)
    } else {
      // Загружаем Яндекс.Метрику если есть согласие
      if (consent.analytics) {
        loadYandexMetrika()
      }
    }
  }, [])

  // Загружаем текст политики конфиденциальности
  useEffect(() => {
    fetch("/policy.md")
      .then(res => res.text())
      .then(setPolicyText)
      .catch(() => setPolicyText("Ошибка загрузки политики."))
  }, [])

  const getConsent = (): ConsentSettings | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('cookie_consent')
    return stored ? JSON.parse(stored) : null
  }

  const setConsent = async (consents: ConsentSettings) => {
    const timestamp = new Date().toISOString()
    const data = {
      ...consents,
      timestamp,
      version: '1.0'
    }
    localStorage.setItem('cookie_consent', JSON.stringify(data))
    setCookie('cookie_consent_accepted', 'true', 365)
    
    console.log('📋 Согласие сохранено локально:', data)

    // Отправляем согласие на сервер для записи в БД
    try {
      const response = await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.saved) {
          console.log('✅ Согласие сохранено на сервере, ID:', result.id)
        } else {
          console.log('⚠️ Согласие принято, но сохранение на сервере отложено')
        }
      }
    } catch (error) {
      console.log('⚠️ Не удалось отправить согласие на сервер:', error)
      // Не показываем ошибку пользователю - согласие уже сохранено локально
    }
  }

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Strict`
  }

  const loadYandexMetrika = () => {
    if (typeof window === 'undefined') return
    
    // Проверяем, не загружена ли уже метрика
    if ((window as any).ym) {
      console.log('✅ Яндекс.Метрика уже загружена')
      return
    }

    // Вставляем скрипт Яндекс.Метрики
    const script = document.createElement('script')
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
      ym(${ymId}, "init", {
        defer: true,
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `
    document.head.appendChild(script)
    console.log('✅ Яндекс.Метрика загружена с согласием пользователя')
  }

  const acceptAll = async () => {
    // Сохраняем согласие на основе выбора пользователя в баннере
    const consents = {
      essential: true,
      analytics: settings.analytics, // Берём из state чекбокса
      marketing: settings.marketing
    }
    await setConsent(consents)
    setShowBanner(false)
    if (settings.analytics) {
    loadYandexMetrika()
    }
  }

  const rejectAll = async () => {
    const consents = {
      essential: true,
      analytics: false,
      marketing: false
    }
    await setConsent(consents)
    setShowBanner(false)
    setShowModal(false)
    console.log('✅ Аналитика отключена')
  }

  const openModal = () => {
    const consent = getConsent() || {
      essential: true,
      analytics: false, // opt-in по умолчанию
      marketing: false
    }
    setSettings(consent)
    setShowModal(true)
  }

  const saveSettings = async () => {
    await setConsent(settings)
    setShowBanner(false)
    setShowModal(false)
    if (settings.analytics) {
      loadYandexMetrika()
    }
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#2180A2] shadow-[0_-4px_12px_rgba(0,0,0,0.1)] p-5 z-[9999] animate-slide-up">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-5 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <div className="font-semibold text-base text-[#134252] mb-2">
              🍪 Согласие на обработку данных и аналитику
            </div>
              <div className="text-sm text-gray-600 leading-relaxed mb-3">
              Мы используем <strong>Яндекс.Метрику</strong> и cookie-файлы для анализа работы сайта, 
              улучшения услуг и соблюдения требований законодательства РФ.
              <br />
              Подробнее см.{' '}
                <button 
                  onClick={() => setShowPolicyModal(true)}
                className="text-[#2180A2] font-medium hover:text-[#1d748f] hover:underline transition-colors"
              >
                Политику конфиденциальности
                </button>.
              </div>
              
              {/* Чекбокс для явного согласия */}
              <label className="flex items-start gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={settings.analytics}
                  onChange={(e) => setSettings({...settings, analytics: e.target.checked})}
                  className="mt-0.5 w-4 h-4 text-[#2180A2] bg-gray-100 border-gray-300 rounded focus:ring-[#2180A2] focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Я согласен на использование аналитических cookies (Яндекс.Метрика) для улучшения работы сайта
                </span>
              </label>
            </div>
            
            <div className="flex gap-2 flex-wrap items-start">
            <button
              onClick={acceptAll}
              className="px-5 py-2.5 bg-[#2180A2] text-white rounded-md text-sm font-medium hover:bg-[#1d748f] transition-all whitespace-nowrap"
            >
                Сохранить выбор
            </button>
            <button
              onClick={openModal}
              className="px-5 py-2.5 bg-transparent text-[#2180A2] border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 hover:border-[#2180A2] transition-all whitespace-nowrap"
            >
              ⚙ Настройки
            </button>
            <button
              onClick={rejectAll}
              className="px-5 py-2.5 bg-transparent text-gray-600 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 transition-all whitespace-nowrap"
            >
              Отклонить
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto p-8 animate-slide-down">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold text-[#134252]">Управление согласиями</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-400 hover:text-[#134252] transition-colors bg-none border-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Consent Items */}
            <div className="space-y-5">
              {/* Essential */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#134252] text-[15px]">
                    ✓ Необходимые cookies (обязательны)
                  </span>
                  <label className="relative inline-block w-[50px] h-7">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="opacity-0 w-0 h-0"
                    />
                    <span className="absolute cursor-not-allowed top-0 left-0 right-0 bottom-0 bg-gray-400 rounded-full transition-all before:content-[''] before:absolute before:h-[22px] before:w-[22px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all" />
                  </label>
                </div>
                <div className="text-[13px] text-gray-600 leading-relaxed">
                  Обеспечивают безопасность, аутентификацию и функциональность сайта. 
                  Эти файлы обрабатываются всегда по требованиям законодательства.
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#134252] text-[15px]">
                    📊 Яндекс.Метрика (аналитика)
                  </span>
                  <label className="relative inline-block w-[50px] h-7">
                    <input
                      type="checkbox"
                      checked={settings.analytics}
                      onChange={(e) => setSettings({...settings, analytics: e.target.checked})}
                      className="opacity-0 w-0 h-0 peer"
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all peer-checked:bg-[#2180A2] before:content-[''] before:absolute before:h-[22px] before:w-[22px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-[22px]" />
                  </label>
                </div>
                <div className="text-[13px] text-gray-600 leading-relaxed">
                  Позволяет анализировать поведение пользователей, улучшать контент и услуги. 
                  Обработка в соответствии с{' '}
                  <a 
                    href="https://yandex.ru/legal/confidential/" 
                    className="text-[#2180A2] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    политикой Яндекса
                  </a>.
                </div>
              </div>

              {/* Marketing */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#134252] text-[15px]">
                    📧 Маркетинговые cookies
                  </span>
                  <label className="relative inline-block w-[50px] h-7">
                    <input
                      type="checkbox"
                      checked={settings.marketing}
                      onChange={(e) => setSettings({...settings, marketing: e.target.checked})}
                      className="opacity-0 w-0 h-0 peer"
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all peer-checked:bg-[#2180A2] before:content-[''] before:absolute before:h-[22px] before:w-[22px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-[22px]" />
                  </label>
                </div>
                <div className="text-[13px] text-gray-600 leading-relaxed">
                  Используются для отправки персонализированных предложений, 
                  рекламных сообщений и отслеживания эффективности кампаний.
                </div>
              </div>

              {/* Legal Notice */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-[#2180A2]">
                <p className="text-[13px] text-gray-800 m-0">
                  <strong>По ФЗ-152 "О персональных данных":</strong> Вы можете отозвать согласие в любой момент, 
                  отправив запрос на{' '}
                  <a 
                    href="mailto:urist40@gmail.com" 
                    className="text-[#2180A2] hover:underline"
                  >
                    urist40@gmail.com
                  </a>.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={rejectAll}
                className="flex-1 px-5 py-2.5 bg-transparent text-gray-600 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 transition-all"
              >
                Отклонить все
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 px-5 py-2.5 bg-[#2180A2] text-white rounded-md text-sm font-medium hover:bg-[#1d748f] transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Modal */}
      <Dialog open={showPolicyModal} onOpenChange={setShowPolicyModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Политика конфиденциальности</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto text-left text-sm">
            <ReactMarkdown>{policyText}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

