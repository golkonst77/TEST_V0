"use client"

import { useContactForm } from "./use-contact-form"
import { normalizeQuizMode } from "@/lib/quiz-mode"
import { useState } from "react"

export const useCruiseClick = () => {
  const { openQuiz, openSimpleForm } = useContactForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [quizUrl, setQuizUrl] = useState<string | null>(null)

  const handleCruiseClick = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" })
      const settings = await res.json()
      const mode = normalizeQuizMode(settings.quiz_mode)

      if (mode === "disabled") {
        openSimpleForm()
        return
      }

      if (mode === "custom") {
        openQuiz()
        return
      }

      if (settings.quiz_url) {
        let url = settings.quiz_url
        if (url.startsWith("#popup:marquiz_")) {
          const quizId = url.split("_")[1]
          url = `https://quiz.marquiz.ru/${quizId}`
        }
        setQuizUrl(url)
        setModalOpen(true)
        return
      }

      openQuiz()
    } catch {
      openQuiz()
    }
  }

  return { handleCruiseClick, modalOpen, setModalOpen, quizUrl }
}
