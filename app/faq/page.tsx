import { FAQ } from "@/components/faq"

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="w-full max-w-none md:max-w-4xl mx-auto py-10 md:py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-stone-900 tracking-tight">
          Часто задаваемые вопросы
        </h1>
        <p className="text-center text-stone-600 mb-6 max-w-xl mx-auto">
          Бухгалтерские услуги, ИП, ООО и сопровождение — ответы, которые помогают принять решение
        </p>
        <FAQ showHeader={false} />
      </div>
    </main>
  )
}

