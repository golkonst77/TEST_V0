import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

import { sendEmail } from '@/lib/email-service'
import { getSettings } from '@/lib/settings-store'

type UtmPayload = {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
}

type NormalizedLead = {
  site: string
  email: string
  phone: string | null
  lead: {
    name?: string
    tax_regime?: string
    monthly_revenue?: number
    employees_count?: number
    city?: string
    source?: string
  } & UtmPayload
  raw_quiz_answers: any
  giftPdfFilename?: string | null
}

// TODO: сюда подключим amoCRM API (создание контакта и сделки).
async function syncToAmoCrm(normalizedLead: NormalizedLead): Promise<void> {
  console.log('[amoCRM stub] syncToAmoCrm payload:', normalizedLead)
}

function normalizeUtm(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t : null
}

function normalizeSiteToSource(site: string): string {
  const v = (site || '').toLowerCase()
  if (v === 'ausn') return 'ausn_site'
  return 'main_site'
}

function toOptionalNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return null
}

function normalizeIncomingPayload(body: any): NormalizedLead {
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const phoneRaw = typeof body?.phone === 'string' ? body.phone.trim() : ''

  const requestedSite = typeof body?.site === 'string' ? body.site.trim() : ''
  const normalizeSite = (value: string): string => {
    if (!value) return ''
    const v = value.toLowerCase()
    if (v === 'main') return 'prostoburo'
    if (v === 'ausn') return 'ausn'
    return value
  }
  const site = normalizeSite(requestedSite) || process.env.QUIZ_SITE || 'prostoburo'

  const legacyQuizData = body?.quizData
  const raw_quiz_answers = body?.raw_quiz_answers ?? legacyQuizData

  const incomingLead = (body?.lead && typeof body.lead === 'object') ? body.lead : {}

  // Backward/loose compatibility:
  // some clients may send lead fields on top-level instead of inside `lead`.
  const leadLike = (key: string) => (incomingLead as any)?.[key] ?? (body as any)?.[key]

  const lead: NormalizedLead['lead'] = {
    name: typeof leadLike('name') === 'string' ? String(leadLike('name')) : undefined,
    tax_regime: typeof leadLike('tax_regime') === 'string' ? String(leadLike('tax_regime')) : undefined,
    monthly_revenue: ((): number | undefined => {
      const n = toOptionalNumber(leadLike('monthly_revenue'))
      return n == null ? undefined : n
    })(),
    employees_count: ((): number | undefined => {
      const n = toOptionalNumber(leadLike('employees_count'))
      return n == null ? undefined : n
    })(),
    city: typeof leadLike('city') === 'string' ? String(leadLike('city')) : undefined,
    source:
      (typeof leadLike('source') === 'string' && String(leadLike('source')).trim())
        ? String(leadLike('source')).trim()
        : normalizeSiteToSource(site),
    utm_source: normalizeUtm(leadLike('utm_source')),
    utm_medium: normalizeUtm(leadLike('utm_medium')),
    utm_campaign: normalizeUtm(leadLike('utm_campaign')),
    utm_content: normalizeUtm(leadLike('utm_content')),
    utm_term: normalizeUtm(leadLike('utm_term')),
  }

  const giftPdfFilename = typeof body?.giftPdfFilename === 'string' ? body.giftPdfFilename.trim() : null

  return {
    site,
    email,
    phone: phoneRaw || null,
    lead,
    raw_quiz_answers,
    giftPdfFilename,
  }
}

async function insertLeadWithFallback({
  supabase,
  normalized,
  normalizedPhone,
}: {
  supabase: any
  normalized: NormalizedLead
  normalizedPhone: string | null
}): Promise<{ leadId: number | null }> {
  const isMissingColumnOrTable = (err: any): boolean => {
    const code = err?.code
    const msg = String(err?.message || '')
    const details = String(err?.details || '')

    // Postgres:
    //  - 42703 undefined_column
    //  - 42P01 undefined_table
    if (code === '42703' || code === '42P01') return true

    // Supabase sometimes returns only message/details
    if (/column .* does not exist/i.test(msg) || /column .* does not exist/i.test(details)) return true
    if (/relation .* does not exist/i.test(msg) || /relation .* does not exist/i.test(details)) return true

    return false
  }

  // Primary: new schema (columns + raw_quiz_answers)
  try {
    const newSchemaInsertRow = {
      site: normalized.site,
      email: normalized.email,
      phone: normalizedPhone,
      tax_regime: normalized.lead.tax_regime ?? null,
      monthly_revenue: toOptionalNumber(normalized.lead.monthly_revenue),
      employees_count: toOptionalNumber(normalized.lead.employees_count),
      city: normalized.lead.city ?? null,
      source: normalized.lead.source ?? null,
      utm_source: normalizeUtm(normalized.lead.utm_source),
      utm_medium: normalizeUtm(normalized.lead.utm_medium),
      utm_campaign: normalizeUtm(normalized.lead.utm_campaign),
      utm_content: normalizeUtm(normalized.lead.utm_content),
      utm_term: normalizeUtm(normalized.lead.utm_term),
      raw_quiz_answers: normalized.raw_quiz_answers,
      // Backward compatibility: some existing prod tables keep quiz_data NOT NULL.
      // Keep it in sync with raw_quiz_answers until we drop/relax constraint.
      quiz_data: normalized.raw_quiz_answers,
    }

    if (shouldExposeDebugDetails()) {
      console.log('[quiz-lead] insert (new schema) row preview:', {
        site: newSchemaInsertRow.site,
        email: newSchemaInsertRow.email,
        phone: newSchemaInsertRow.phone,
        tax_regime: newSchemaInsertRow.tax_regime,
        monthly_revenue: newSchemaInsertRow.monthly_revenue,
        employees_count: newSchemaInsertRow.employees_count,
        city: newSchemaInsertRow.city,
        source: newSchemaInsertRow.source,
        utm_source: newSchemaInsertRow.utm_source,
        utm_medium: newSchemaInsertRow.utm_medium,
        utm_campaign: newSchemaInsertRow.utm_campaign,
        utm_content: newSchemaInsertRow.utm_content,
        utm_term: newSchemaInsertRow.utm_term,
        has_raw_quiz_answers: newSchemaInsertRow.raw_quiz_answers != null,
      })
    }

    const { data: lead, error } = await supabase
      .from('quiz_leads')
      .insert([newSchemaInsertRow])
      .select('id')
      .single()

    if (!error) {
      return { leadId: typeof lead?.id === 'number' ? lead.id : null }
    }

    if (!isMissingColumnOrTable(error)) {
      // Don't silently fallback: otherwise we'll keep losing CRM fields even when columns exist.
      console.error('[quiz-lead] Failed to insert lead (new schema) - NOT falling back:', {
        message: (error as any)?.message,
        code: (error as any)?.code,
        hint: (error as any)?.hint,
        details: (error as any)?.details,
      })
      throw error
    }

    console.error('[quiz-lead] Failed to insert lead (new schema), will try legacy schema:', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      hint: (error as any)?.hint,
      details: (error as any)?.details,
    })
  } catch (e) {
    if (!isMissingColumnOrTable(e)) {
      console.error('[quiz-lead] Exception inserting lead (new schema) - NOT falling back:', e)
      throw e
    }

    console.error('[quiz-lead] Exception inserting lead (new schema), will try legacy schema:', e)
  }

  // Fallback: legacy schema
  const { data: lead, error: insertError } = await supabase
    .from('quiz_leads')
    .insert([
      {
        email: normalized.email,
        phone: normalizedPhone,
        quiz_data: normalized.raw_quiz_answers,
        site: normalized.site,
      },
    ])
    .select('id')
    .single()

  if (insertError) {
    throw insertError
  }

  return { leadId: typeof lead?.id === 'number' ? lead.id : null }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isLikelyValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 0 || digits.length >= 10
}

function normalizePhone(phone: string): string | null {
  const raw = (phone || '').trim()
  if (!raw) return null

  const digits = raw.replace(/\D/g, '')
  if (!digits) return null

  // RU normalization: assume +7 for 10 digits, or convert leading 8 -> +7
  if (digits.length === 10) {
    return `+7${digits}`
  }

  if (digits.length === 11) {
    if (digits.startsWith('8')) return `+7${digits.slice(1)}`
    if (digits.startsWith('7')) return `+${digits}`
  }

  // Fallback: keep as international E.164-like if possible
  if (digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`
  }

  return raw
}

const COMPANY_TYPE_LABELS: Record<string, string> = {
  ooo: "ООО",
  ip: "ИП",
  both: "ИП и ООО",
  new: "Планирую открыть бизнес",
}

const TAX_SYSTEM_LABELS: Record<string, string> = {
  usn: "УСН",
  osn: "ОСНО",
  patent: "Патент",
  consult: "Нужна консультация по режиму",
  "not-selected": "Нужна консультация по режиму",
}

const EMPLOYEES_LABELS: Record<string, string> = {
  none: "Сотрудников нет",
  "0": "Сотрудников нет",
  has: "Есть сотрудники",
  plan: "Планируем нанимать",
  many: "Команда более 5 человек",
}

const COMPLEXITY_LABELS: Record<string, string> = {
  "self-accounting": "Ведём бухгалтерию самостоятельно",
  "irregular-accounting": "Бухгалтерия ведётся нерегулярно",
  "reporting-confidence": "Нет уверенности, что отчётность сдана правильно",
  "fns-requests": "Приходят требования или вопросы от ФНС",
  "unstable-accountant": "Бухгалтер долго отвечает или пропадает",
  "docs-order": "Нужен порядок в документах",
  "business-launch": "Открываем бизнес и хотим сразу сделать правильно",
  handover: "Хотим перейти от другого бухгалтера без хаоса",
  responsibility: "Нужна понятная стоимость и зона ответственности",
}

function formatLabel(value: unknown, labels: Record<string, string>, fallback = "—"): string {
  if (typeof value !== "string" || !value.trim()) return fallback
  return labels[value] || value
}

function extractQuizSummary(quizData: any) {
  const answers = Array.isArray(quizData?.answers) ? quizData.answers : []
  const businessRaw = answers.find((a: any) => a?.questionId === 1)?.answer
  const complexitiesRaw = answers.find((a: any) => a?.questionId === 2)?.answer

  const business =
    businessRaw && typeof businessRaw === "object" && !Array.isArray(businessRaw) ? businessRaw : {}
  const complexities = Array.isArray(complexitiesRaw)
    ? complexitiesRaw.map((v) => formatLabel(v, COMPLEXITY_LABELS, String(v || "").trim())).filter(Boolean)
    : []

  return {
    companyType: formatLabel(business.companyType, COMPANY_TYPE_LABELS),
    taxSystem: formatLabel(business.taxSystem, TAX_SYSTEM_LABELS),
    employees: formatLabel(business.employees, EMPLOYEES_LABELS),
    complexities,
  }
}

function shouldExposeDebugDetails(): boolean {
  return process.env.DEBUG_API_ERRORS === '1' || process.env.NODE_ENV !== 'production'
}

function generateCouponCode(discount: number, site: string): string {
  const prefix = String(site || 'prostoburo').toUpperCase()
  const part = Math.random().toString(36).slice(2, 8).toUpperCase()
  const safeDiscount = Number.isFinite(discount) && discount > 0 ? Math.round(discount) : 0
  return `${prefix}-${part}-${safeDiscount}`
}

async function loadGiftPdfAttachment(
  requestedFilename?: string | null
): Promise<{ filename: string; content: Buffer; contentType: string } | null> {
  const filename =
    (typeof requestedFilename === 'string' && requestedFilename.trim() ? requestedFilename.trim() : null) ||
    process.env.QUIZ_GIFT_PDF ||
    'Kak_vibrat_buh_kompany.pdf'
  const filePath = path.join(process.cwd(), 'public', 'CHEK_LIST', filename)
  try {
    const content = await fs.readFile(filePath)
    return { filename, content, contentType: 'application/pdf' }
  } catch (e) {
    console.error('[quiz-lead] Failed to read gift PDF (non-blocking):', e)
    return null
  }
}

async function ensureQuizCouponsTableExists(supabase: any): Promise<{ ok: boolean; errorDetails?: any }> {
  try {
    const { error } = await supabase.from('quiz_coupons').select('id').limit(1)

    if (error && (error as any).code === '42P01') {
      const details = {
        message: "Missing table 'quiz_coupons' in Supabase. Create it via SQL Editor.",
        code: (error as any).code,
        hint: (error as any).hint,
        details: (error as any).details,
      }
      console.error('[quiz-lead] quiz_coupons table is missing:', details)
      return { ok: false, errorDetails: details }
    }

    if (error) {
      const details = {
        message: error.message,
        code: (error as any).code,
        hint: (error as any).hint,
        details: (error as any).details,
      }
      console.error('[quiz-lead] Failed to check quiz_coupons table:', details)
      return { ok: false, errorDetails: details }
    }

    return { ok: true }
  } catch (e) {
    const details = { message: e instanceof Error ? e.message : String(e) }
    console.error('[quiz-lead] Failed to ensure quiz_coupons table exists:', details)
    return { ok: false, errorDetails: details }
  }
}

async function saveCouponWithRetries({
  supabase,
  email,
  phone,
  leadId,
  site,
  discount,
  businessType,
}: {
  supabase: any
  email: string
  phone: string
  leadId: number | null
  site: string
  discount: number
  businessType: string | null
}): Promise<{ couponCode: string; saved: boolean; errorDetails?: any }> {
  const tableCheck = await ensureQuizCouponsTableExists(supabase)
  if (!tableCheck.ok) {
    return { couponCode: generateCouponCode(discount, site), saved: false, errorDetails: tableCheck.errorDetails }
  }

  const couponPhone = phone || null
  let couponCode = generateCouponCode(discount, site)

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { error } = await supabase.from('quiz_coupons').insert([
        {
          code: couponCode,
          email,
          phone: couponPhone,
          discount_rub: discount,
          business_type: businessType,
          site,
          lead_id: leadId,
          created_at: new Date().toISOString(),
        },
      ])

      if (!error) return { couponCode, saved: true }

      const details = {
        message: error.message,
        code: (error as any).code,
        hint: (error as any).hint,
        details: (error as any).details,
      }

      if ((error as any).code === '23505') {
        couponCode = generateCouponCode(discount, site)
        continue
      }

      return { couponCode, saved: false, errorDetails: details }
    } catch (e) {
      return {
        couponCode,
        saved: false,
        errorDetails: { message: e instanceof Error ? e.message : String(e) },
      }
    }
  }

  return { couponCode, saved: false, errorDetails: { message: 'Retries exhausted' } }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const normalized = normalizeIncomingPayload(body)

    if (shouldExposeDebugDetails()) {
      console.log('[quiz-lead] incoming payload keys:', Object.keys(body || {}))
      console.log('[quiz-lead] incoming payload preview:', {
        site: body?.site,
        email: body?.email,
        phone: body?.phone,
        leadKeys: body?.lead && typeof body.lead === 'object' ? Object.keys(body.lead) : null,
        has_raw_quiz_answers: body?.raw_quiz_answers != null,
        has_legacy_quizData: body?.quizData != null,
      })
      console.log('[quiz-lead] normalized preview:', {
        site: normalized.site,
        email: normalized.email,
        phone: normalized.phone,
        lead: normalized.lead,
        has_raw_quiz_answers: normalized.raw_quiz_answers != null,
      })
    }
    const email = normalized.email
    const phone = normalized.phone || ''
    const quizData = normalized.raw_quiz_answers
    const giftPdfFilename = normalized.giftPdfFilename || null

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'INVALID_EMAIL' }, { status: 400 })
    }

    if (!isLikelyValidPhone(phone)) {
      return NextResponse.json({ success: false, error: 'INVALID_PHONE' }, { status: 400 })
    }

    const normalizedPhone = normalizePhone(phone)
    const phoneDigits = (phone || '').replace(/\D/g, '')
    const hasValidEmail = Boolean(email && isValidEmail(email))
    const hasValidPhone = phoneDigits.length >= 10

    if (!hasValidEmail && !hasValidPhone) {
      return NextResponse.json({ success: false, error: 'INVALID_CONTACT' }, { status: 400 })
    }

    if (quizData == null) {
      return NextResponse.json({ success: false, error: 'MISSING_QUIZ_DATA' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[quiz-lead] Missing Supabase env vars', {
        hasUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      })
      return NextResponse.json(
        {
          success: false,
          error: 'SUPABASE_NOT_CONFIGURED',
          ...(shouldExposeDebugDetails()
            ? {
                missing: {
                  NEXT_PUBLIC_SUPABASE_URL: !supabaseUrl,
                  SUPABASE_SERVICE_ROLE_KEY: !serviceRoleKey,
                },
              }
            : {}),
        },
        { status: 500 }
      )
    }

    const site = normalized.site

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const discount = typeof quizData?.discount === 'number' ? quizData.discount : 0
    const businessType = typeof quizData?.businessType === 'string' ? quizData.businessType : null

    const couponCode = generateCouponCode(discount, site)

    const giftPdf = giftPdfFilename === 'none' ? null : await loadGiftPdfAttachment(giftPdfFilename)
    let leadId: number | null = null
    try {
      const res = await insertLeadWithFallback({ supabase, normalized, normalizedPhone })
      leadId = res.leadId
    } catch (insertError) {
      console.error('[quiz-lead] Failed to insert lead into Supabase:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: 'DB_INSERT_FAILED',
          ...(shouldExposeDebugDetails()
            ? {
                details: {
                  message: (insertError as any)?.message || String(insertError),
                  code: (insertError as any)?.code,
                  hint: (insertError as any)?.hint,
                  details: (insertError as any)?.details,
                },
              }
            : {}),
        },
        { status: 500 }
      )
    }

    try {
      await syncToAmoCrm(normalized)
    } catch (e) {
      console.error('[quiz-lead] syncToAmoCrm failed (non-blocking):', e)
    }

    const { saved: couponSaved, errorDetails: couponSaveErrorDetails } = await saveCouponWithRetries({
      supabase,
      email,
      phone: normalizedPhone || '',
      leadId: typeof leadId === 'number' ? leadId : null,
      site,
      discount,
      businessType,
    })

    const prettyJson = (() => {
      try {
        return JSON.stringify(quizData, null, 2)
      } catch {
        return String(quizData)
      }
    })()

    const quizSummary = extractQuizSummary(quizData)

    const sendClientEmail = async () => {
      if (!hasValidEmail) return

      const subject = 'Новая заявка на подбор бухгалтерского сопровождения'
      const html = `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
          <h2>Новая заявка с квиза ПростоБюро</h2>
          <p>Мы получили вашу заявку на подбор бухгалтерского сопровождения.</p>
          <p>${giftPdf ? 'Материалы по теме приложены к письму.' : 'Если потребуется, отправим материалы по теме отдельно после уточнения задач.'}</p>
          <p>
            Сайт ПростоБюро: <a href="https://prostoburo.com" target="_blank" rel="noopener noreferrer">https://prostoburo.com</a>
          </p>
          <hr />
          <p><b>Контакты:</b></p>
          <p><b>Email:</b> ${email}</p>
          ${normalizedPhone ? `<p><b>Телефон:</b> ${normalizedPhone}</p>` : ''}
          ${leadId ? `<p><b>ID заявки:</b> ${leadId}</p>` : ''}
          <p>Если письмо пришло по ошибке — просто проигнорируйте его.</p>
        </div>
      `.trim()

      const text = `
Новая заявка с квиза ПростоБюро

Мы получили вашу заявку на подбор бухгалтерского сопровождения.
${giftPdf ? 'Материалы по теме приложены к письму.' : 'При необходимости отправим материалы после уточнения задач.'}

Email: ${email}
${normalizedPhone ? `Телефон: ${normalizedPhone}` : ''}
${leadId ? `ID заявки: ${leadId}` : ''}
      `.trim()

      const emailResult = await sendEmail({
        to: email,
        subject,
        html,
        text,
        attachments: giftPdf ? [giftPdf] : undefined,
      })

      if (!emailResult.success) {
        console.error('[quiz-lead] Client email send failed (non-blocking):', emailResult.error)
      }
    }

    const sendAdminEmail = async () => {
      let adminEmail = 'admin@prostoburo.com'

      try {
        const settings = await getSettings()
        adminEmail =
          process.env.YANDEX_EMAIL ||
          settings?.admin_email ||
          settings?.email ||
          process.env.ADMIN_EMAIL ||
          'admin@prostoburo.com'
      } catch (e) {
        adminEmail = process.env.YANDEX_EMAIL || process.env.ADMIN_EMAIL || 'admin@prostoburo.com'
        console.error('[quiz-lead] Failed to read settings for admin email (non-blocking):', e)
      }

      const isSimpleContactForm =
        quizData?.type === 'simple_contact_form' ||
        normalized.lead.source === 'simple_contact_form'

      if (isSimpleContactForm) {
        const simpleMessage =
          typeof quizData?.message === 'string' && quizData.message.trim()
            ? quizData.message.trim()
            : normalized.lead.city || '—'
        const pageUrl = typeof quizData?.pageUrl === 'string' ? quizData.pageUrl : '—'

        const notificationText = `
Заявка из простой формы вместо квиза

Контакты:
Имя: ${normalized.lead.name || quizData?.name || '—'}
Телефон: ${normalizedPhone || '—'}
Email: ${email || '—'}

Задача:
${simpleMessage}

Страница:
${pageUrl}

Источник:
simple_contact_form

Служебные данные:
Site: ${site}
Lead ID: ${leadId ?? '—'}
Время: ${new Date().toLocaleString('ru-RU')}
        `.trim()

        const subject = 'Заявка из простой формы вместо квиза'
        const html = notificationText.replace(/\n/g, '<br>')

        const emailResult = await sendEmail({
          to: adminEmail,
          subject,
          html,
          text: notificationText,
        })

        if (!emailResult.success) {
          console.error('[quiz-lead] Admin email send failed (non-blocking):', emailResult.error)
        }
        return
      }

      const answers = Array.isArray(quizData?.answers) ? quizData.answers : []

      const notificationText = `
Новая заявка на подбор бухгалтерского сопровождения

Новая заявка с квиза ПростоБюро

Контакты:
Имя: ${normalized.lead.name || '—'}
Телефон / мессенджер: ${normalizedPhone || '—'}
Email: ${email || '—'}

Информация о бизнесе:
Форма бизнеса: ${quizSummary.companyType}
Налоговый режим: ${quizSummary.taxSystem}
Сотрудники: ${quizSummary.employees}

Ситуация / сложности:
${quizSummary.complexities.length > 0 ? quizSummary.complexities.map((item) => `- ${item}`).join('\n') : '- Не указано'}

Комментарий:
${normalized.lead.city ? `Город: ${normalized.lead.city}` : '—'}

Источник:
Квиз “Подбор бухгалтерского сопровождения”

Служебные данные:
Site: ${site}
Lead ID: ${leadId ?? '—'}
Служебный код: ${couponCode}
Сохранение служебного кода: ${couponSaved ? 'успешно' : 'ошибка'}
${!couponSaved && couponSaveErrorDetails ? `Детали ошибки: ${JSON.stringify(couponSaveErrorDetails)}` : ''}

Данные квиза (JSON):
${prettyJson}

Время: ${new Date().toLocaleString('ru-RU')}
      `.trim()

      const subject = 'Новая заявка на подбор бухгалтерского сопровождения'
      const html = notificationText.replace(/\n/g, '<br>')

      const emailResult = await sendEmail({
        to: adminEmail,
        subject,
        html,
        text: notificationText
      })

      if (!emailResult.success) {
        console.error('[quiz-lead] Admin email send failed (non-blocking):', emailResult.error)
      }
    }

    await Promise.allSettled([sendClientEmail(), sendAdminEmail()])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[quiz-lead] Error handling lead:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'BAD_REQUEST',
        ...(shouldExposeDebugDetails()
          ? {
              details: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
              },
            }
          : {}),
      },
      { status: 400 }
    )
  }
}
