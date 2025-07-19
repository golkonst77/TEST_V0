-- Создание таблицы профилей пользователей
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

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created ON user_profiles(created_at);

-- Создание триггера для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Настройка RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Политика для чтения профилей (пользователи могут читать только свой профиль)
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Политика для создания профилей
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

-- Политика для обновления профилей (пользователи могут обновлять только свой профиль)
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- Создание bucket для файлов пользователей (если не существует)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('user-files', 'user-files', true)
-- ON CONFLICT (id) DO NOTHING;

-- Политика для доступа к файлам
-- CREATE POLICY "Users can upload own files" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'user-files' AND auth.jwt() ->> 'email' = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own files" ON storage.objects
--     FOR SELECT USING (bucket_id = 'user-files' AND auth.jwt() ->> 'email' = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete own files" ON storage.objects
--     FOR DELETE USING (bucket_id = 'user-files' AND auth.jwt() ->> 'email' = (storage.foldername(name))[1]); 