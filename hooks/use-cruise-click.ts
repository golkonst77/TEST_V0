"use client"

import { useContactForm } from "./use-contact-form"
import { normalizeQuizMode } from "@/lib/quiz-mode"

function readQuizMode(settings: Record<string, unknown>): ReturnType<typeof normalizeQuizMode> {
  const raw = settings.quiz_mode ?? settings.quizMode
  return normalizeQuizMode(typeof raw === "string" ? raw : null)
}

export const useCruiseClick = () => {
  const { openQuiz, openSimpleForm, openMarquiz } = useContactForm()

  const handleCruiseClick = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" })
      if (!res.ok) {
        console.error("Failed to load settings for CTA:", res.status)
        return
      }

      const settings = (await res.json()) as Record<string, unknown>
      const mode = readQuizMode(settings)

      if (mode === "disabled") {
        openSimpleForm()
        return
      }

      if (mode === "custom") {
        openQuiz()
        return
      }

      const quizUrl = typeof settings.quiz_url === "string" ? settings.quiz_url : ""
      if (quizUrl) {
        let url = quizUrl
        if (url.startsWith("#popup:marquiz_")) {
          const quizId = url.split("_")[1]
          url = `https://quiz.marquiz.ru/${quizId}`
        }
        openMarquiz(url)
        return
      }

      openQuiz()
    } catch (error) {
      console.error("CTA settings error:", error)
    }
  }

  return { handleCruiseClick }
}
