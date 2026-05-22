"use client"

import { QuizModal } from "./quiz-modal"
import { SimpleContactFormModal } from "./simple-contact-form-modal"
import { MarquizExternalModal } from "./marquiz-external-modal"

export function ContactForm() {
  return (
    <>
      <QuizModal />
      <SimpleContactFormModal />
      <MarquizExternalModal />
    </>
  )
}
