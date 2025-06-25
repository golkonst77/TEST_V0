"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, CheckCircle, DollarSign, AlertTriangle } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"

export function Hero() {
  const { openContactForm } = useContactForm()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border bg-white/50 px-4 py-2 text-sm backdrop-blur">
            <Shield className="mr-2 h-4 w-4 text-blue-600" />
            Защищаем ваш бизнес от налоговых рисков
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Ваш личный{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">"щит"</span> от
            налоговой
          </h1>

          <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
            Пока вы строите свою империю, мы защищаем её тылы от проверок, штрафов и бумажной волокиты. Спокойно
            занимайтесь завоеванием мира.
          </p>

          {/* Visual illustrations */}
          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Дорого</h3>
                <p className="text-sm text-gray-600">Штрафы и пени съедают прибыль</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Страшно</h3>
                <p className="text-sm text-gray-600">Проверки и бумажная волокита</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Идеально</h3>
                <p className="text-sm text-gray-600">Спокойствие и рост бизнеса</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              onClick={openContactForm}
            >
              Получить скидку до 50%
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Рассчитать стоимость
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Штрафов по нашей вине</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Поддержка клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
