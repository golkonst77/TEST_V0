import { Shield, Clock, MessageCircle } from "lucide-react"

export default function TrustBlock() {
  return (
    <section className="bg-white/60">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-blue-500">
                <Shield className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Работаем по договору</div>
                <div className="text-sm text-gray-600 mt-1">Фиксируем сроки и ответственность</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-blue-500">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Всегда на связи</div>
                <div className="text-sm text-gray-600 mt-1">Отвечаем в течение дня</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-blue-500">
                <Clock className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Не пропадаем</div>
                <div className="text-sm text-gray-600 mt-1">Сопровождаем бизнес постоянно</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

