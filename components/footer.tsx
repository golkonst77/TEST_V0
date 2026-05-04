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
    fetch("/policy.md", { cache: "no-store" })
      .then(res => res.text())
      .then(setPolicyText)
      .catch(() => setPolicyText("Ошибка загрузки политики."))
  }, [])

  return (
    <footer className="bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">О нас</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Помогаем бизнесу вести бухгалтерию без ошибок и лишних затрат
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">Поддержка</h4>
            <div className="flex flex-col gap-1.5 text-sm">
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <a
                href="https://t.me/prostoburo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Задать вопрос
              </a>
            </div>
          </div>
          <div className="space-y-2 md:text-right">
            <h4 className="text-sm font-semibold text-gray-800">Реквизиты</h4>
            <div className="text-sm text-gray-600">ООО "ПростоБюро", ИНН: 4027132996, ОГРН: 1174027006592</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="text-sm text-gray-600 underline hover:text-blue-600 transition-colors">Политика конфиденциальности</button>
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

        <div className="mt-4 text-xs text-gray-500 leading-relaxed">
          Используем cookie. Персональные данные обрабатываются по ФЗ-152
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
          <div className="inline-flex items-center flex-wrap gap-1">
            <span>&copy; 2026 ООО "ПростоБюро"</span>
            <span>·</span>
            <VersionInfo inline showDate={false} />
          </div>
          <div>
            <span>Сайт создан </span>
            <span className="font-medium text-gray-600">GØL Design Studio</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
