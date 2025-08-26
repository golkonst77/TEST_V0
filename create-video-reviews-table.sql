-- Создание таблицы video_reviews
CREATE TABLE IF NOT EXISTS public.video_reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    video_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_video_reviews_published ON public.video_reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_video_reviews_created_at ON public.video_reviews(created_at DESC);

-- Включение RLS (Row Level Security)
ALTER TABLE public.video_reviews ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если они есть
DROP POLICY IF EXISTS "Allow public read access to published video reviews" ON public.video_reviews;
DROP POLICY IF EXISTS "Allow full access to video reviews for service role" ON public.video_reviews;

-- Политики безопасности
-- Разрешить чтение опубликованных отзывов всем
CREATE POLICY "Allow public read access to published video reviews" ON public.video_reviews
    FOR SELECT USING (is_published = true);

-- Разрешить полный доступ администраторам (через service_role key)
CREATE POLICY "Allow full access to video reviews for service role" ON public.video_reviews
    FOR ALL USING (true);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Удаляем существующий триггер если он есть
DROP TRIGGER IF EXISTS update_video_reviews_updated_at ON public.video_reviews;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_video_reviews_updated_at 
    BEFORE UPDATE ON public.video_reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
