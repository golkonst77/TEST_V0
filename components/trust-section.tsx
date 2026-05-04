"use client"

const TRUST_CARDS = [
  {
    title: "Работаем по договору",
    description: "Фиксируем объём работ, сроки и ответственность.",
  },
  {
    title: "Контролируем отчётность",
    description: "Следим за сроками и сдаём отчёты вовремя.",
  },
  {
    title: "Всегда на связи",
    description: "Отвечаем быстро в Telegram или по телефону.",
  },
  {
    title: "Понятный учёт",
    description: "Вы всегда видите, что происходит и за что платите.",
  },
] as const

export function TrustSection() {
  const bgVariants = ["bg-[#FFF8F0]", "bg-[#F5E6D6]", "bg-[#E9D8C3]"] as const

  return (
    <section className="py-8 md:py-12 bg-white border-b border-gray-100" id="trust">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
            Почему нам доверяют бухгалтерию
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Коротко о том, как мы работаем и что вы получаете
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TRUST_CARDS.map((card, idx) => {
            const cardBg = bgVariants[idx % 3]
            return (
              <div
                key={card.title}
                className={`${cardBg} rounded-xl shadow-md p-4 md:p-6 flex flex-col justify-start text-left`}
              >
                <div className="w-full bg-white rounded-lg py-2 mb-3 text-sm md:text-base font-bold text-gray-900 flex items-center justify-center min-h-[40px] shadow-none sm:shadow-[8px_8px_0_#000] px-2 text-center">
                  {card.title}
                </div>
                <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{card.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
