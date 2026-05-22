"use client"

import { create } from "zustand"

export type ContactFormType = "quiz" | "simple"

interface ContactFormStore {
  isOpen: boolean
  formType: ContactFormType
  marquizOpen: boolean
  marquizUrl: string | null
  openContactForm: (formType?: ContactFormType) => void
  openQuiz: () => void
  openSimpleForm: () => void
  openMarquiz: (url: string) => void
  closeContactForm: () => void
  closeMarquiz: () => void
}

export const useContactForm = create<ContactFormStore>((set) => ({
  isOpen: false,
  formType: "quiz",
  marquizOpen: false,
  marquizUrl: null,
  openContactForm: (formType = "quiz") => set({ isOpen: true, formType, marquizOpen: false, marquizUrl: null }),
  openQuiz: () => set({ isOpen: true, formType: "quiz", marquizOpen: false, marquizUrl: null }),
  openSimpleForm: () => set({ isOpen: true, formType: "simple", marquizOpen: false, marquizUrl: null }),
  openMarquiz: (url) => set({ marquizOpen: true, marquizUrl: url, isOpen: false }),
  closeContactForm: () => set({ isOpen: false }),
  closeMarquiz: () => set({ marquizOpen: false, marquizUrl: null }),
}))
