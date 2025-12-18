import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

import { sendEmail } from '@/lib/email-service'
import { getSettings } from '@/lib/settings-store'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isLikelyValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 0 || digits.length >= 10
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
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const quizData = body?.quizData
    const giftPdfFilename = typeof body?.giftPdfFilename === 'string' ? body.giftPdfFilename.trim() : null

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'INVALID_EMAIL' }, { status: 400 })
    }

    if (!isLikelyValidPhone(phone)) {
      return NextResponse.json({ success: false, error: 'INVALID_PHONE' }, { status: 400 })
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

    const site = process.env.QUIZ_SITE || 'prostoburo'

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const discount = typeof quizData?.discount === 'number' ? quizData.discount : 0
    const businessType = typeof quizData?.businessType === 'string' ? quizData.businessType : null

    const couponCode = generateCouponCode(discount, site)

    const giftPdf = giftPdfFilename === 'none' ? null : await loadGiftPdfAttachment(giftPdfFilename)
    const { data: lead, error: insertError } = await supabase
      .from('quiz_leads')
      .insert([
        {
          email,
          phone: phone || null,
          quiz_data: quizData,
          site,
        },
      ])
      .select('id')
      .single()

    if (insertError) {
      console.error('[quiz-lead] Failed to insert lead into Supabase:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: 'DB_INSERT_FAILED',
          ...(shouldExposeDebugDetails()
            ? {
                details: {
                  message: insertError.message,
                  code: (insertError as any).code,
                  hint: (insertError as any).hint,
                  details: (insertError as any).details,
                },
              }
            : {}),
        },
        { status: 500 }
      )
    }

    const leadId = lead?.id

    const { saved: couponSaved, errorDetails: couponSaveErrorDetails } = await saveCouponWithRetries({
      supabase,
      email,
      phone,
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
          ${phone ? `<p><b>Телефон:</b> ${phone}</p>` : ''}
          ${leadId ? `<p><b>ID заявки:</b> ${leadId}</p>` : ''}
          <p>Если письмо пришло по ошибке — просто проигнорируйте его.</p>
        </div>
      `.trim()

      const emailResult = await sendEmail({
        to: email,
        subject,
        html,
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
${phone ? `📱 Телефон: ${phone}` : '📱 Телефон: не указан'}
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

      const subject = `🎯 Квиз: ${email}${phone ? ` — ${phone}` : ''} — купон ${couponCode}`
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
