"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  HelpCircle,
  ArrowLeftRight,
  ShieldCheck,
  FolderOpen,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react"
import { QuizModal } from "@/components/quiz-modal"
import { useCruiseClick } from "@/hooks/use-cruise-click"

type FaqItem = {
  question: string
  answer: string
}

type FaqGroup = {
  id: string
  title: string
  icon: LucideIcon
  items: FaqItem[]
}

const faqGroups: FaqGroup[] = [
  {
    id: "transfer",
    title: "Передача бухгалтерии",
    icon: ArrowLeftRight,
    items: [
      {
        question: "Можно ли перейти к вам от другого бухгалтера?",
        answer:
          "Да, такие переходы — обычная практика. Мы запрашиваем базу документов и остатки, проверяем, как вёлся учёт, и аккуратно подключаемся к работе. Вам не нужно разбираться в технических деталях — мы проведём передачу дел по шагам.",
      },
      {
        question: "Что делать, если бухгалтерия раньше велась с ошибками?",
        answer:
          "Сначала делаем диагностику: смотрим отчётность, остатки и риски. Затем предлагаем план — восстановление учёта, корректировки, выравнивание сроков. Дальше выстраиваем нормальное сопровождение, чтобы ошибки не повторялись.",
      },
      {
        question: "Можно ли подключиться не с начала года?",
        answer:
          "Да, подключиться можно в любой момент. При необходимости восстановим учёт за прошлые периоды и приведём отчётность в порядок. Сроки и объём работ согласуем заранее, чтобы вы понимали план и бюджет.",
      },
      {
        question: "Нужно ли приезжать в офис?",
        answer:
          "В большинстве случаев — нет. Всё можно решить удалённо: документы, вопросы, согласования. Если нужна личная встреча или подписание бумаг — договоримся о визите. Для аутсорсинга бухгалтерии это стандартный и удобный формат.",
      },
    ],
  },
  {
    id: "work",
    title: "Работа и ответственность",
    icon: ShieldCheck,
    items: [
      {
        question: "Кто будет вести нашу бухгалтерию?",
        answer:
          "За вами закрепляется ответственный специалист, который знает вашу ситуацию. При необходимости подключаются коллеги по узким вопросам — отчётность, кадры, налоги. Вы всегда понимаете, к кому обратиться, без «перекидывания» между людьми.",
      },
      {
        question: "Помогаете ли вы при требованиях ФНС?",
        answer:
          "Да. Разбираем требование, готовим ответ и комплект документов, объясняем сроки и порядок действий. Если ситуация сложная, подключаем дополнительную проверку учёта. Цель — спокойно пройти коммуникацию с инспекцией без лишней паники.",
      },
      {
        question: "Заключаете ли вы договор и несёте ли ответственность?",
        answer:
          "Да, работаем по договору на бухгалтерское сопровождение. В нём — перечень услуг, сроки, порядок взаимодействия и зона ответственности сторон. Это основа доверия: понятные правила и защита интересов клиента.",
      },
      {
        question: "Как быстро можно получить ответ бухгалтера?",
        answer:
          "Рабочие вопросы обычно закрываем в течение рабочего дня в мессенджере или по почте. Срочные темы по срокам и налогам берём в приоритет. Регламент ответов фиксируем в договорённостях, чтобы вы знали, чего ожидать.",
      },
    ],
  },
  {
    id: "documents",
    title: "Документы и процессы",
    icon: FolderOpen,
    items: [
      {
        question: "Как происходит обмен документами?",
        answer:
          "Документы принимаем в удобном для вас формате: мессенджер, почта, облако или электронный документооборот. Согласуем простой регламент: что, когда и в каком виде передавать. Так учёт идёт без хаоса и потерянных файлов.",
      },
      {
        question: "Что входит в бухгалтерское сопровождение?",
        answer:
          "Обычно это ведение учёта, подготовка и сдача отчётности, контроль сроков, консультации по налогам и документам. Мы берём на себя рутину, чтобы вы не отвлекались от бизнеса. Конкретный перечень работ прописываем в договоре под ваш режим и задачи.",
      },
      {
        question: "Работаете ли вы с АУСН?",
        answer:
          "Да, сопровождаем бизнес на автоматизированной упрощённой системе налогообложения (АУСН). Помогаем с учётом, отчётностью и практическими вопросами по режиму. Если вы только выбираете систему — подскажем, подходит ли АУСН именно вам.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Тарифы и подключение",
    icon: CircleDollarSign,
    items: [
      {
        question: "Сколько стоят бухгалтерские услуги?",
        answer:
          "Стоимость зависит от формы бизнеса (ИП или ООО), налогового режима, количества операций и сотрудников. Мы заранее согласуем состав работ и фиксируем цену в договоре — без скрытых доплат. Если нужно, поможем подобрать формат бухгалтерского сопровождения под вашу ситуацию.",
      },
      {
        question: "С какими компаниями вы работаете?",
        answer:
          "Сопровождаем и индивидуальных предпринимателей, и общества с ограниченной ответственностью. Подбираем учёт и отчётность под выбранную форму и налоговый режим. Если вы только планируете открыть бизнес — подскажем, с чего начать.",
      },
      {
        question: "Подходят ли ваши тарифы для бизнеса без сотрудников?",
        answer:
          "Это нормальная ситуация. Настраиваем сопровождение без кадрового блока или с минимальным набором услуг. Когда появятся сотрудники — расширим учёт и отчётность. Формат бухгалтерских услуг подстраивается под этап развития компании.",
      },
    ],
  },
]

const DEFAULT_OPEN_KEY = "transfer-0"

function faqItemKey(groupId: string, itemIndex: number) {
  return `${groupId}-${itemIndex}`
}

export function FAQ({ showHeader = true }: { showHeader?: boolean }) {
  const [openItems, setOpenItems] = useState<string[]>([DEFAULT_OPEN_KEY])
  const [telegramLink, setTelegramLink] = useState("https://t.me/prostoburo")
  const { handleCruiseClick } = useCruiseClick()

  useEffect(() => {
    const controller = new AbortController()
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
          signal: controller.signal,
        })
        if (!response.ok) return
        const data = await response.json()
        if (typeof data?.telegram === "string" && data.telegram.trim().length > 0) {
          const clean = data.telegram.trim()
          const url = clean.startsWith("http") ? clean : `https://t.me/${clean.replace("@", "")}`
          setTelegramLink(url)
        }
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error("FAQ settings load error:", error)
        }
      }
    }
    fetchSettings()
    return () => controller.abort()
  }, [])

  const toggleItem = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    )
  }

  return (
    <section
      className="py-14 md:py-16 bg-gradient-to-b from-stone-50 via-white to-indigo-50/30"
      id="faq"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {showHeader ? (
          <div className="text-center mb-7 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100/80 mb-4">
              <HelpCircle className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 mb-3">
              Ответы на важные вопросы
            </h2>
            <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Ответы, которые чаще всего задают перед переходом на сопровождение — по делу и без лишней
              бюрократии
            </p>
          </div>
        ) : null}

        <div className="space-y-8 md:space-y-10">
          {faqGroups.map((group, groupIndex) => {
            const GroupIcon = group.icon
            const headingId = `faq-group-${group.id}`
            return (
              <section
                key={group.id}
                aria-labelledby={headingId}
                className={groupIndex > 0 ? "pt-6 md:pt-8 border-t border-stone-200/60" : undefined}
              >
                <div className="mb-3 md:mb-3.5 flex items-center gap-2.5 px-0.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-500">
                    <GroupIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3
                    id={headingId}
                    className="text-[15px] md:text-base font-medium tracking-tight text-stone-900"
                  >
                    {group.title}
                  </h3>
                </div>

                <div className="space-y-1.5 md:space-y-2 rounded-2xl border border-stone-200/60 bg-stone-50/30 p-2 md:p-2.5">
                  {group.items.map((item, itemIndex) => {
                    const itemKey = faqItemKey(group.id, itemIndex)
                    const isOpen = openItems.includes(itemKey)
                    return (
                      <div
                        key={itemKey}
                        className={`group rounded-xl border bg-white transition-all duration-200 ease-out motion-reduce:transition-none ${
                          isOpen
                            ? "border-indigo-200 shadow-sm"
                            : "border-stone-200/80 md:hover:border-stone-300 md:hover:bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(itemKey)}
                          className={`w-full min-h-[44px] text-left px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-between gap-3 rounded-xl transition-colors duration-200 ease-out ${
                            isOpen ? "bg-white" : "bg-white md:hover:bg-stone-50"
                          }`}
                          aria-expanded={isOpen}
                        >
                          <span className="text-[15px] md:text-base font-medium tracking-tight text-stone-900 leading-snug pr-2">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 ease-out ${
                              isOpen
                                ? "rotate-180 text-indigo-500"
                                : "rotate-0 text-stone-400 md:group-hover:text-stone-500"
                            }`}
                            strokeWidth={2}
                            aria-hidden
                          />
                        </button>

                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                          aria-hidden={!isOpen}
                        >
                          <div className="overflow-hidden">
                            <div className="px-4 md:px-5 pb-3.5 md:pb-4 pt-0">
                              <div
                                className={`border-t pt-3 transition-colors duration-200 ${
                                  isOpen ? "border-indigo-100" : "border-stone-200/70"
                                }`}
                              >
                                <p className="text-sm md:text-[15px] text-stone-600 leading-relaxed max-w-prose">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-7 md:mt-9 text-center">
          <div className="mx-auto max-w-lg rounded-3xl border border-stone-200 bg-stone-50 px-5 py-6 md:px-8 md:py-7 shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-2">Остались вопросы?</h3>
            <p className="text-stone-600 mb-5 md:mb-6 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Оставьте заявку или напишите нам — разберём вашу ситуацию и подскажем формат сопровождения
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              <button
                  type="button"
                  onClick={handleCruiseClick}
                  className="inline-flex h-11 w-full sm:flex-1 sm:max-w-[220px] items-center justify-center px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 shadow-sm shadow-indigo-500/15 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 transition-all duration-200"
                >
                  Получить консультацию
                </button>

                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-full sm:flex-1 sm:max-w-[220px] items-center justify-center px-5 rounded-xl text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:border-indigo-200 hover:bg-white transition-all duration-200"
                >
                  Написать в Telegram
                </a>
              </div>
          </div>
        </div>
      </div>

      <QuizModal />
    </section>
  )
}

