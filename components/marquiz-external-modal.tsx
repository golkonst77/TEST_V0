"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useContactForm } from "@/hooks/use-contact-form"

export function MarquizExternalModal() {
  const { marquizOpen, marquizUrl, closeMarquiz } = useContactForm()

  return (
    <Dialog open={marquizOpen} onOpenChange={(open) => !open && closeMarquiz()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 overflow-hidden">
        {marquizUrl ? (
          <iframe
            src={marquizUrl}
            className="h-full w-full border-0"
            title="Marquiz"
            allow="clipboard-write"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
