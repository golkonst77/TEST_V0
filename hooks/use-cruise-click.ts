import { useContactForm } from "./use-contact-form"
import { useState } from "react"

export const useCruiseClick = () => {
  const { openContactForm } = useContactForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [quizUrl, setQuizUrl] = useState<string | null>(null)

  const handleCruiseClick = async () => {
    try {
      const res = await fetch("/api/settings")
      const settings = await res.json()
      console.log("[CRUISE] settings:", settings)
      
      if (settings.quiz_mode === "custom") {
        openContactForm()
      } else if (settings.quiz_mode === "external" && settings.quiz_url) {
        let url = settings.quiz_url
        if (url.startsWith("#popup:marquiz_")) {
          const quizId = url.split("_")[1]
          url = `https://quiz.marquiz.ru/${quizId}`
        }
        setQuizUrl(url)
        setModalOpen(true)
      } else {
        openContactForm()
      }
    } catch (error) {
      openContactForm()
    }
  }

  return { handleCruiseClick, modalOpen, setModalOpen, quizUrl }
} 