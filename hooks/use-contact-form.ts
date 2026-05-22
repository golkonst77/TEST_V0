"use client"

import { create } from "zustand"

export type ContactFormType = "quiz" | "simple"

interface ContactFormStore {
  isOpen: boolean
  formType: ContactFormType
  openContactForm: (formType?: ContactFormType) => void
  openQuiz: () => void
  openSimpleForm: () => void
  closeContactForm: () => void
}

export const useContactForm = create<ContactFormStore>((set) => ({
  isOpen: false,
  formType: "quiz",
  openContactForm: (formType = "quiz") => set({ isOpen: true, formType }),
  openQuiz: () => set({ isOpen: true, formType: "quiz" }),
  openSimpleForm: () => set({ isOpen: true, formType: "simple" }),
  closeContactForm: () => set({ isOpen: false }),
}))
