import { Dialog, DialogContent } from "./dialog"
import { useState } from "react"

export function CruiseQuizModal({ open, onOpenChange, quizUrl }: { open: boolean, onOpenChange: (v: boolean) => void, quizUrl: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <style>{`
        .cruise-quiz-modal[data-state="open"] {
          max-width: 100vw !important;
          width: 100vw !important;
          min-width: 0 !important;
          left: 0 !important;
          right: 0 !important;
          top: 0 !important;
          transform: none !important;
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          min-height: 0 !important;
          overflow-y: auto !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
        }
        .cruise-quiz-modal-iframe {
          display: block !important;
          width: 100vw !important;
          height: 100vh !important;
          min-height: 0 !important;
          min-width: 0 !important;
          border: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }
      `}</style>
      <DialogContent
        className="cruise-quiz-modal"
        style={{
          maxWidth: '100vw',
          minWidth: 0,
          width: '100vw',
          height: '100vh',
          minHeight: 0,
          left: 0,
          right: 0,
          margin: 0,
          transform: 'none',
          padding: 0,
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          background: '#fff',
        }}
      >
        <iframe
          src={quizUrl}
          width="100vw"
          height="100vh"
          frameBorder="0"
          allowFullScreen
          className="cruise-quiz-modal-iframe"
          title="Квиз Marquiz"
          style={{ minHeight: 0, height: '100vh', width: '100vw', display: 'block', border: 'none', borderRadius: 0, margin: 0, padding: 0, background: '#fff' }}
        />
      </DialogContent>
    </Dialog>
  )
} 