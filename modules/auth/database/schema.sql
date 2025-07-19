-- Схема базы данных для модуля аутентификации
-- Выполните этот скрипт в Supabase SQL Editor

-- Включаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  question TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON profiles(phone);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) политики
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политика для чтения профиля (только владелец)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Политика для обновления профиля (только владелец)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Политика для вставки профиля (только при регистрации)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, question)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'question', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Представление для получения данных пользователя с профилем
CREATE OR REPLACE VIEW user_with_profile AS
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.updated_at,
  p.full_name,
  p.phone,
  p.question
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id;

-- Комментарии к таблицам
COMMENT ON TABLE profiles IS 'Профили пользователей с дополнительной информацией';
COMMENT ON COLUMN profiles.id IS 'ID пользователя (ссылка на auth.users)';
COMMENT ON COLUMN profiles.email IS 'Email пользователя';
COMMENT ON COLUMN profiles.full_name IS 'Полное имя пользователя';
COMMENT ON COLUMN profiles.phone IS 'Номер телефона пользователя';
COMMENT ON COLUMN profiles.question IS 'Вопрос пользователя для консультации'; 