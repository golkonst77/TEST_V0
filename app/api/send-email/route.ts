import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json()

    if (!to || !subject) {
      return NextResponse.json({
        success: false,
        error: 'Отсутствуют обязательные поля: to, subject'
      }, { status: 400 })
    }

    // Создаем транспортер для Gmail (можно настроить под любой SMTP сервер)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Настройки письма
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: subject,
      html: html,
      text: text
    }

    // Отправляем email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email отправлен успешно:', info.messageId)
    
    return NextResponse.json({
      success: true,
      message: 'Email отправлен успешно',
      messageId: info.messageId
    })

  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Ошибка отправки email',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  }
}
