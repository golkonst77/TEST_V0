'use client'

import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { VersionInfo } from "./version-info"

export function Footer() {
  const [open, setOpen] = useState(false)
  const [policyText, setPolicyText] = useState("")

  useEffect(() => {
    fetch("/policy.md")
      .then(res => res.text())
      .then(setPolicyText)
      .catch(() => setPolicyText("Ошибка загрузки политики."))
  }, [])

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
            <h4 className="text-lg font-semibold mb-4">Поддержка</h4>
            <ul>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/prostoburo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M17.472 7.768a.6.6 0 0 0-.64-.08l-9.6 4.2a.6.6 0 0 0 .04 1.12l2.56.72 1.04 3.12a.6.6 0 0 0 1.08.12l1.44-2.08 2.56 1.92a.6.6 0 0 0 .96-.32l1.6-7.2a.6.6 0 0 0-.44-.72ZM10.4 13.44l-.64-1.92 5.36-3.36-4.72 5.28Zm1.2 2.08-.8-2.4 1.12.8-.32 1.6Zm1.36-2.08-1.12-.8 4.16-4.64-3.04 5.44Z" fill="currentColor"/>
                  </svg>
                  Задать вопрос
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-end md:items-end text-right">
            <div className="text-gray-500">&copy; {new Date().getFullYear()} Все права защищены.</div>
            <div className="mt-2 text-gray-400 text-xs">ООО "ПростоБюро", ИНН: 4027132996. ОГРН: 1174027006592.</div>
            <div className="mt-2 text-gray-400 text-xs">Сайт создан Golkonst. В тесном сотрудничестве с AI.</div>
            <div className="mt-2 text-gray-400 text-xs">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="underline hover:text-blue-600">Политика конфиденциальности</button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Политика конфиденциальности</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto text-left text-sm">
                    <ReactMarkdown>{policyText}</ReactMarkdown>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 text-gray-800 py-4 px-2 text-center rounded">
          <div className="font-bold mb-1 text-sm">НАШ САЙТ ИСПОЛЬЗУЕТ ФАЙЛЫ COOKIE.</div>
          <div className="text-xs leading-snug">
            Продолжая использовать этот сайт, вы соглашаетесь на их использование. Запретить обработку Cookies можно в настройках Вашего браузера.<br />
            Для получения дополнительной информации, пожалуйста, ознакомьтесь с нашей{' '}
            <a href="/policy" className="underline hover:text-blue-400">Политикой конфиденциальности</a>.
          </div>
        </div>
      </div>
      
      {/* Версия приложения */}
      <VersionInfo />
    </footer>
  )
}

export default Footer
