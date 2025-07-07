import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, filePath, caption } = await request.json();
    
    // Приводим номер к формату 79XXXXXXXXX
    const cleanPhone = phone.replace(/\D/g, '').replace(/^8/, '7');
    if (cleanPhone.length !== 11) {
      return NextResponse.json({ error: 'Неверный формат номера' }, { status: 400 });
    }

    // Загружаем файл с GitHub
    const githubUrl = `https://raw.githubusercontent.com/golkonst77/TEST_V0/main/public/${filePath}`;
    
    const fileResponse = await fetch(githubUrl);
    
    if (!fileResponse.ok) {
      console.error('GitHub file not found:', githubUrl);
      return NextResponse.json({ error: 'Файл не найден на GitHub' }, { status: 404 });
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const base64File = Buffer.from(fileBuffer).toString('base64');

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
          filename: filePath.split('/').pop(),
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