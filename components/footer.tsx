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
    <footer className="bg-gray-100 py-10">
      <div className="container mx-auto px-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="text-gray-600 text-sm leading-relaxed">
            Мы - команда профессионалов, стремящихся предоставить лучшие решения для вашего бизнеса.
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <a
              href="https://t.me/prostoburo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0.1"/>
                <path d="M17.472 7.768a.6.6 0 0 0-.64-.08l-9.6 4.2a.6.6 0 0 0 .04 1.12l2.56.72 1.04 3.12a.6.6 0 0 0 1.08.12l1.44-2.08 2.56 1.92a.6.6 0 0 0 .96-.32l1.6-7.2a.6.6 0 0 0-.44-.72ZM10.4 13.44l-.64-1.92 5.36-3.36-4.72 5.28Zm1.2 2.08-.8-2.4 1.12.8-.32 1.6Zm1.36-2.08-1.12-.8 4.16-4.64-3.04 5.44Z" fill="currentColor"/>
              </svg>
              Задать вопрос
            </a>
          </div>
          <div className="text-sm text-gray-500 md:text-right space-y-2">
            <div>ООО "ПростоБюро", ИНН: 4027132996, ОГРН: 1174027006592</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="underline hover:text-blue-600 transition-colors">Политика конфиденциальности</button>
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

        <div className="text-xs text-gray-500 leading-relaxed">
          Используем cookie для корректной работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием.
        </div>

        <div className="text-xs text-gray-500">
          Персональные данные обрабатываются в соответствии с ФЗ-152.
        </div>

        <div className="pt-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-500">
          <div>&copy; {new Date().getFullYear()} ООО "ПростоБюро"</div>
          <div className="inline-flex items-center gap-2">
            <span className="font-semibold tracking-wide text-gray-500">GØL</span>
            <span>Сайт создан GØL Design Studio</span>
          </div>
        </div>

        <VersionInfo className="pt-1" />
      </div>
    </footer>
  )
}

export default Footer
