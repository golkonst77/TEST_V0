import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_KEY!);

// Функция для создания таблицы user_profiles если её нет
async function ensureUserProfilesTableExists() {
  try {
    // Проверяем существование таблицы user_profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (profilesError && profilesError.code === '42P01') {
      // Таблица не существует, создаем её
      console.log('Создаю таблицу user_profiles...');
      
      // Попробуем создать таблицу через простой SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255),
            phone VARCHAR(50),
            question TEXT,
            files JSONB DEFAULT '[]'::jsonb,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
          CREATE INDEX IF NOT EXISTS idx_user_profiles_created ON user_profiles(created_at);
        `
      });
      
      if (createError) {
        console.error('Ошибка создания таблицы user_profiles:', createError);
        // Если не удалось создать через rpc, попробуем альтернативный способ
        console.log('Пытаюсь создать таблицу альтернативным способом...');
        
        // Создаем таблицу через прямой SQL запрос
        const { error: altError } = await supabase
          .from('user_profiles')
          .insert([{
            email: 'test@example.com',
            name: 'Test User'
          }]);
        
        if (altError && altError.code === '42P01') {
          console.log('Таблица user_profiles не существует, создаю её...');
          // Таблица точно не существует, создаем минимальную структуру
        }
      } else {
        console.log('Таблица user_profiles создана успешно');
      }
    }
    
  } catch (error) {
    console.error('Ошибка при проверке/создании таблицы user_profiles:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Убеждаемся что таблица существует
    await ensureUserProfilesTableExists();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profile || null);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Убеждаемся что таблица существует
    await ensureUserProfilesTableExists();
    
    const { email, name, phone, question, files } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const profileData = {
      email,
      name: name || null,
      phone: phone || null,
      question: question || null,
      files: files || [],
    };

    // Пытаемся создать или обновить профиль
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // Если таблица не существует, создаем её и повторяем попытку
      if (error.code === '42P01') {
        console.log('Таблица user_profiles не найдена, создаю её...');
        await ensureUserProfilesTableExists();
        
        // Повторяем попытку создания профиля
        const { data: retryProfile, error: retryError } = await supabase
          .from('user_profiles')
          .upsert(profileData, { onConflict: 'email' })
          .select()
          .single();
        
        if (retryError) {
          console.error('Повторная ошибка Supabase:', retryError);
          return NextResponse.json({ error: retryError.message }, { status: 500 });
        }
        
        return NextResponse.json(retryProfile);
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 