"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

export default function PolicyPage() {
  const [policyText, setPolicyText] = useState("")

  useEffect(() => {
    fetch("/policy.md")
      .then(res => res.text())
      .then(setPolicyText)
      .catch(() => setPolicyText("Ошибка загрузки политики."))
  }, [])

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 text-gray-800">
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        <ReactMarkdown>{policyText}</ReactMarkdown>
      </div>
    </main>
  )
} 