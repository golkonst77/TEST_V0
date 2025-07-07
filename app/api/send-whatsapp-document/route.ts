import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { phone, filePath, caption } = await request.json();
    
    // Приводим номер к формату 79XXXXXXXXX
    const cleanPhone = phone.replace(/\D/g, '').replace(/^8/, '7');
    if (cleanPhone.length !== 11) {
      return NextResponse.json({ error: 'Неверный формат номера' }, { status: 400 });
    }

    // Читаем файл с сервера
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const base64File = fileBuffer.toString('base64');

    // Отправляем файл через WHAPI
    const response = await fetch('https://gate.whapi.cloud/messages/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer QlZ00L1DXVAv17SfAoTtarbseCNIKaIo',
      },
      body: JSON.stringify({
        to: cleanPhone,
        document: {
          data: base64File,
          filename: path.basename(filePath),
          mimetype: 'application/pdf'
        },
        caption: caption,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('WHAPI error:', result);
      return NextResponse.json({ error: 'Ошибка отправки файла' }, { status: 500 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error sending WhatsApp document:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
} 