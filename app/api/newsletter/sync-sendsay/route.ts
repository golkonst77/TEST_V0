import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSendsayService } from "@/lib/sendsay-service";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST() {
  try {
    console.log('🔄 Начинаем синхронизацию подписчиков с Sendsay...');
    
    // Получаем сервис Sendsay
    const sendsayService = getSendsayService();
    
    // Проверяем соединение
    const isConnected = await sendsayService.verifyConnection();
    if (!isConnected) {
      return NextResponse.json({ 
        error: 'Не удается подключиться к Sendsay',
        mode: 'simulation'
      }, { status: 500 });
    }
    
    // Получаем всех подписчиков из базы данных
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*');
    
    if (subscribersError) {
      console.error('Ошибка получения подписчиков:', subscribersError);
      return NextResponse.json({ error: 'Ошибка получения подписчиков' }, { status: 500 });
    }
    
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ 
        message: 'Нет подписчиков для синхронизации',
        synced: 0,
        errors: 0
      });
    }
    
    let syncedCount = 0;
    let errorsCount = 0;
    const results = [];
    
    console.log(`📧 Синхронизируем ${subscribers.length} подписчиков...`);
    
    // Синхронизируем каждого подписчика
    for (const subscriber of subscribers) {
      try {
        if (subscriber.is_active) {
          // Добавляем активного подписчика
          const success = await sendsayService.addSubscriber(subscriber.email);
          if (success) {
            syncedCount++;
            results.push({
              email: subscriber.email,
              action: 'added',
              success: true
            });
          } else {
            errorsCount++;
            results.push({
              email: subscriber.email,
              action: 'add_failed',
              success: false
            });
          }
        } else {
          // Удаляем неактивного подписчика
          const success = await sendsayService.removeSubscriber(subscriber.email);
          if (success) {
            syncedCount++;
            results.push({
              email: subscriber.email,
              action: 'removed',
              success: true
            });
          } else {
            errorsCount++;
            results.push({
              email: subscriber.email,
              action: 'remove_failed',
              success: false
            });
          }
        }
        
        // Небольшая задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Ошибка синхронизации ${subscriber.email}:`, error);
        errorsCount++;
        results.push({
          email: subscriber.email,
          action: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка'
        });
      }
    }
    
    console.log(`✅ Синхронизация завершена: успешно ${syncedCount}, ошибок ${errorsCount}`);
    
    return NextResponse.json({
      success: true,
      message: `Синхронизация завершена: обработано ${subscribers.length} подписчиков`,
      total: subscribers.length,
      synced: syncedCount,
      errors: errorsCount,
      results: results.slice(0, 10), // Показываем только первые 10 результатов
      mode: results.length > 0 && results[0].email ? 'sendsay' : 'simulation'
    });
    
  } catch (error) {
    console.error('Ошибка синхронизации с Sendsay:', error);
    return NextResponse.json({ 
      error: 'Ошибка синхронизации с Sendsay',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}

// Получение статуса синхронизации
export async function GET() {
  try {
    const sendsayService = getSendsayService();
    
    // Проверяем соединение
    const isConnected = await sendsayService.verifyConnection();
    
    // Получаем количество подписчиков
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('is_active');
    
    if (error) {
      return NextResponse.json({ error: 'Ошибка получения данных' }, { status: 500 });
    }
    
    const activeCount = subscribers?.filter(s => s.is_active).length || 0;
    const inactiveCount = subscribers?.filter(s => !s.is_active).length || 0;
    
    return NextResponse.json({
      connected: isConnected,
      total_subscribers: subscribers?.length || 0,
      active_subscribers: activeCount,
      inactive_subscribers: inactiveCount,
      last_sync: null, // Можно добавить в базу данных время последней синхронизации
      mode: isConnected ? 'sendsay' : 'simulation'
    });
    
  } catch (error) {
    console.error('Ошибка получения статуса:', error);
    return NextResponse.json({ error: 'Ошибка получения статуса' }, { status: 500 });
  }
} 