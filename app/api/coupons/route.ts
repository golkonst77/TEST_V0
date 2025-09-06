import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not configured");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Интерфейс для купона
interface Coupon {
  id: number
  code: string
  phone: string
  discount: number
  business_type?: string
  createdAt: string
  used: boolean
  usedAt?: string
}

// Функция для создания таблицы купонов если её нет
async function ensureCouponsTableExists() {
  const supabase = getSupabaseClient();
  
  try {
    // Проверяем существование таблицы
    const { error } = await supabase
      .from('coupons')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Таблица не существует, создаем её
      console.log('Создаем таблицу coupons...');
      
      const { error: createError } = await supabase.rpc('create_coupons_table');
      
      if (createError) {
        console.error('Ошибка создания таблицы coupons:', createError);
        // Если RPC не работает, создаем таблицу через SQL
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS coupons (
              id SERIAL PRIMARY KEY,
              code VARCHAR(255) UNIQUE NOT NULL,
              phone VARCHAR(20) NOT NULL,
              discount INTEGER NOT NULL,
              business_type VARCHAR(100),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              used BOOLEAN DEFAULT FALSE,
              used_at TIMESTAMP WITH TIME ZONE
            );
          `
        });
        
        if (sqlError) {
          console.error('Ошибка создания таблицы через SQL:', sqlError);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка проверки таблицы coupons:', error);
  }
}

// POST - создание нового купона
export async function POST(request: NextRequest) {
  try {
    const { code, phone, discount, business_type } = await request.json()
    
    if (!code || !phone || !discount) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля: code, phone, discount' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient();
    
    // Убеждаемся что таблица существует
    await ensureCouponsTableExists();
    
    const newCoupon = {
      code,
      phone,
      discount,
      business_type: business_type || null,
      created_at: new Date().toISOString(),
      used: false
    }
    
    const { data, error } = await supabase
      .from('coupons')
      .insert([newCoupon])
      .select()
      .single();
    
    if (error) {
      console.error('Ошибка Supabase при сохранении купона:', error);
      return NextResponse.json(
        { error: 'Ошибка при сохранении купона: ' + error.message },
        { status: 500 }
      );
    }
    
    console.log('Новый купон сохранен:', data);
    
    return NextResponse.json({ success: true, coupon: data });
  } catch (error) {
    console.error('Ошибка при сохранении купона:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при сохранении купона' },
      { status: 500 }
    );
  }
}

// GET - получение всех купонов
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Ошибка Supabase при получении купонов:', error);
      return NextResponse.json(
        { error: 'Ошибка при получении купонов: ' + error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ coupons: data || [] });
  } catch (error) {
    console.error('Ошибка при получении купонов:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении купонов' },
      { status: 500 }
    );
  }
}

// PUT - отметить купон как использованный
export async function PUT(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { error: 'Отсутствует код купона' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('coupons')
      .update({ 
        used: true, 
        used_at: new Date().toISOString() 
      })
      .eq('code', code)
      .select()
      .single();
    
    if (error) {
      console.error('Ошибка Supabase при обновлении купона:', error);
      return NextResponse.json(
        { error: 'Ошибка при обновлении купона: ' + error.message },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Купон не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, coupon: data });
  } catch (error) {
    console.error('Ошибка при обновлении купона:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении купона' },
      { status: 500 }
    );
  }
} 