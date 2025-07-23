import { FAQ } from "@/components/faq"

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">Часто задаваемые вопросы</h1>
        <FAQ />
      </div>
    </main>
  )
} 