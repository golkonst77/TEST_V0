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

  const lead: NormalizedLead['lead'] = {
    name: typeof incomingLead?.name === 'string' ? incomingLead.name : undefined,
    tax_regime: typeof incomingLead?.tax_regime === 'string' ? incomingLead.tax_regime : undefined,
    monthly_revenue: typeof incomingLead?.monthly_revenue === 'number' ? incomingLead.monthly_revenue : undefined,
    employees_count: typeof incomingLead?.employees_count === 'number' ? incomingLead.employees_count : undefined,
    city: typeof incomingLead?.city === 'string' ? incomingLead.city : undefined,
    source: typeof incomingLead?.source === 'string' && incomingLead.source ? incomingLead.source : normalizeSiteToSource(site),
    utm_source: normalizeUtm(incomingLead?.utm_source),
    utm_medium: normalizeUtm(incomingLead?.utm_medium),
    utm_campaign: normalizeUtm(incomingLead?.utm_campaign),
    utm_content: normalizeUtm(incomingLead?.utm_content),
    utm_term: normalizeUtm(incomingLead?.utm_term),
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
  // Primary: new schema (columns + raw_quiz_answers)
  try {
    const { data: lead, error } = await supabase
      .from('quiz_leads')
      .insert([
        {
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
        },
      ])
      .select('id')
      .single()

    if (!error) {
      return { leadId: typeof lead?.id === 'number' ? lead.id : null }
    }

    console.error('[quiz-lead] Failed to insert lead (new schema), will try legacy schema:', error)
  } catch (e) {
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

function getQuestionText(questionId: number): string {
  const questions: { [key: number]: string } = {
    1: 'Статус бизнеса',
    2: 'Ведение бухгалтерии',
    3: 'Что беспокоит больше всего',
    4: 'Какие услуги актуальны'
  }
  return questions[questionId] || `Вопрос ${questionId}`
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
    const email = normalized.email
    const phone = normalized.phone || ''
    const quizData = normalized.raw_quiz_answers
    const giftPdfFilename = normalized.giftPdfFilename || null

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'INVALID_EMAIL' }, { status: 400 })
    }

    if (!isLikelyValidPhone(phone)) {
      return NextResponse.json({ success: false, error: 'INVALID_PHONE' }, { status: 400 })
    }

    const normalizedPhone = normalizePhone(phone)

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

    const sendClientEmail = async () => {
      const subject = 'Ваш подарок: чек-лист + скидочный купон от ПростоБюро'
      const html = `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
          <h2>Спасибо за интерес к нашей компании! Ваш подарок готов!</h2>
          <div style="max-width:520px;margin:16px auto;padding:0">
            <div style="border:2px dashed #06b6d4;border-radius:14px;overflow:hidden;background:#f0f9ff">
              <div style="padding:16px 18px;background:linear-gradient(90deg,#06b6d4,#22c55e);color:#ffffff">
                <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.95">Скидочный купон</div>
                <div style="font-size:20px;font-weight:700;margin-top:6px">Скидка ${Number.isFinite(discount) ? discount.toLocaleString('ru-RU') : discount} ₽</div>
              </div>
              <div style="padding:16px 18px;background:#ffffff">
                <div style="font-size:12px;color:#6b7280">Ваш код</div>
                <div style="font-size:22px;font-weight:800;letter-spacing:1px;margin-top:6px;color:#0f172a">${couponCode}</div>
                <div style="margin-top:10px;font-size:12px;color:#475569">
                  Покажите этот код менеджеру — мы проверим его и применим скидку.
                </div>
                <div style="margin-top:10px;font-size:12px;color:#0f172a;font-weight:700">
                  Условие: скидка действует при заключении договора не менее чем на 6 месяцев
                </div>
              </div>
            </div>
          </div>

          <div style="max-width:520px;margin:18px auto 8px auto;padding:0">
            <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:14px 14px 12px 14px;box-shadow:0 8px 18px rgba(15,23,42,0.06)">
              <div style="font-size:14px;font-weight:700;color:#0f172a;text-align:center;margin-bottom:10px">Бонусы в подарок:</div>
              <div style="display:flex;gap:10px;justify-content:center;align-items:stretch">
                <div style="flex:1;min-width:0;background:#bbf7d0;border-radius:14px;padding:12px 10px;text-align:center">
                  <div style="width:44px;height:44px;margin:0 auto 8px auto;border-radius:999px;background:#f97316;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">🎁</div>
                  <div style="font-size:13px;font-weight:800;color:#0f172a;line-height:1.2">Бесплатная консультация<br/>30 минут</div>
                </div>
                <div style="flex:1;min-width:0;background:#bbf7d0;border-radius:14px;padding:12px 10px;text-align:center">
                  <div style="width:44px;height:44px;margin:0 auto 8px auto;border-radius:999px;background:#06b6d4;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">💡</div>
                  <div style="font-size:13px;font-weight:800;color:#0f172a;line-height:1.2">1 месяц<br/>юридического сопровождения<br/>в подарок</div>
                </div>
              </div>
            </div>
          </div>

          ${giftPdf ? '<p>PDF чек-лист во вложении к письму.</p>' : '<p>Чек-лист не выбран.</p>'}
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
Спасибо за интерес к нашей компании! Ваш подарок готов!

Скидочный купон
Скидка: ${Number.isFinite(discount) ? discount.toLocaleString('ru-RU') : discount} ₽
Ваш код: ${couponCode}
Покажите этот код менеджеру — мы проверим его и применим скидку.
Условие: скидка действует при заключении договора не менее чем на 6 месяцев

${giftPdf ? 'PDF чек-лист во вложении к письму.' : 'Чек-лист не выбран.'}

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

      const answers = Array.isArray(quizData?.answers) ? quizData.answers : []

      const notificationText = `
Новый клиент завершил квиз!

📧 Email: ${email}
${normalizedPhone ? `📱 Телефон: ${normalizedPhone}` : '📱 Телефон: не указан'}
💰 Скидка: ${Number.isFinite(discount) ? discount.toLocaleString('ru-RU') : discount} ₽
${businessType ? `🏢 Тип бизнеса: ${businessType}` : '🏢 Тип бизнеса: —'}
🎟️ Купон: ${couponCode}${couponSaved ? '' : ' (НЕ СОХРАНЕН В БД)'}
${!couponSaved && couponSaveErrorDetails ? `⚠️ Ошибка сохранения купона: ${JSON.stringify(couponSaveErrorDetails)}` : ''}
🧾 Site: ${site}
${leadId ? `🆔 Lead ID: ${leadId}` : ''}

📝 Ответы на вопросы:
${answers
  .map((answer: any, index: number) => {
    const questionText = getQuestionText(answer.questionId)
    const answerValue = Array.isArray(answer.answer) ? answer.answer.join(', ') : String(answer.answer)
    return `${index + 1}. ${questionText}: ${answerValue}`
  })
  .join('\n')}

📎 Данные квиза (JSON):
${prettyJson}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
      `.trim()

      const siteLabel = String(site || '').toUpperCase()
      const subject = `🎯 [${siteLabel}] Квиз: ${email}${normalizedPhone ? ` — ${normalizedPhone}` : ''} — купон ${couponCode}`
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
