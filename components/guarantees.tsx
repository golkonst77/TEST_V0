"use client"

import { Shield, Clock, Lock, Users, ChevronRight } from "lucide-react"
import { useContactForm } from "@/hooks/use-contact-form"

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Знакомимся с бизнесом",
    description: "Смотрим налоги, документы и текущие задачи.",
  },
  {
    number: "02",
    title: "Проверяем учёт",
    description: "Проверяем риски и текущее состояние учёта.",
  },
  {
    number: "03",
    title: "Настраиваем передачу документов",
    description: "Настраиваем обмен документами и нужные сервисы.",
  },
  {
    number: "04",
    title: "Закрепляем команду",
    description: "Закрепляем специалиста и рабочие контакты.",
  },
  {
    number: "05",
    title: "Ведём сопровождение",
    description: "Ведём отчётность, налоги и бухгалтерские задачи.",
  },
] as const

const COMMITMENTS = [
  {
    icon: Shield,
    title: "Ответственность по договору",
    description: "Условия и сроки фиксируем в договоре.",
  },
  {
    icon: Clock,
    title: "Отчётность в срок",
    description: "Следим за сроками и важными датами.",
  },
  {
    icon: Lock,
    title: "Конфиденциальность",
    description: "Не передаём данные третьим лицам.",
  },
  {
    icon: Users,
    title: "Закреплённый специалист",
    description: "У клиента есть закреплённый контакт.",
  },
] as const

export function Guarantees() {
  const { openContactForm } = useContactForm()

  return (
    <section
      id="about"
      className="py-16 md:py-24 bg-gradient-to-b from-white via-stone-50/60 to-white border-b border-stone-100/80"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 mb-5">
            Берём бухгалтерию под контроль поэтапно
          </h2>
          <p className="text-base md:text-lg text-stone-500 leading-relaxed max-w-[720px] mx-auto">
            Проверяем текущее состояние учёта, настраиваем передачу документов и закрепляем
            команду сопровождения.
          </p>
        </header>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5 mb-20 md:mb-28 list-none p-0 m-0">
          {PROCESS_STEPS.map((step) => (
            <li
              key={step.number}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm border-t-2 border-t-indigo-500/40 h-full transition-[transform,box-shadow,border-color] duration-300 ease-out md:hover:-translate-y-0.5 md:hover:border-indigo-200 md:hover:shadow-md"
            >
              <div className="flex flex-col flex-1 p-4 md:p-5 pt-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium mb-4 w-fit">
                  {step.number}
                  <ChevronRight
                    className="hidden xl:block h-3 w-3 opacity-45 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
                <h3 className="text-[15px] md:text-base font-medium text-stone-900 mb-2.5 leading-tight text-balance max-w-[11.5rem] sm:max-w-none">
                  {step.title}
                </h3>
                <p className="text-sm font-normal text-stone-600 leading-[1.55] mt-auto">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mb-12 md:mb-14">
          <h3 className="text-xl md:text-2xl font-bold text-center text-stone-900 mb-7 md:mb-9 tracking-tight">
            Что фиксируем в работе
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {COMMITMENTS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-stone-200/90 bg-gradient-to-br from-white to-indigo-50/30 p-4 md:p-4 shadow-sm shadow-stone-200/40 h-full transition-[box-shadow,border-color] duration-300 ease-out md:hover:border-indigo-100 md:hover:shadow-md md:hover:shadow-indigo-100/25"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-3 shrink-0 ring-1 ring-indigo-100/80">
                  <item.icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                </div>
                <h4 className="text-[15px] font-medium text-stone-900 mb-1.5 leading-tight text-balance">
                  {item.title}
                </h4>
                <p className="text-sm font-normal text-stone-600 leading-[1.5]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/70 p-6 md:p-8 text-center max-w-3xl mx-auto shadow-sm shadow-indigo-100/30 ring-1 ring-inset ring-white/70">
          <p className="text-sm md:text-base text-stone-600 leading-relaxed mb-6">
            Переход можно начать с короткой консультации: посмотрим текущую ситуацию и подскажем,
            как безопасно передать учёт.
          </p>
          <button
            type="button"
            onClick={openContactForm}
            className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-md md:hover:-translate-y-px transition-[transform,background-color,box-shadow] duration-300 ease-out"
          >
            Обсудить переход
          </button>
        </div>
      </div>
    </section>
  )
}
