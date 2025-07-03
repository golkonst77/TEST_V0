"use client"

import { create } from "zustand"

interface ContactFormStore {
  isOpen: boolean
  openContactForm: () => void
  closeContactForm: () => void
}

export const useContactForm = create<ContactFormStore>((set) => ({
  isOpen: false,
  openContactForm: () => set({ isOpen: true }),
  closeContactForm: () => set({ isOpen: false }),
}))
