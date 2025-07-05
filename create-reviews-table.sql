-- Создание таблицы отзывов
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'yandex', 'google', 'website')),
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_reviews_updated_at();

-- Настройка RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Политики доступа (разрешаем все для сервисной роли)
DROP POLICY IF EXISTS "Allow all for service role" ON reviews;
CREATE POLICY "Allow all for service role" ON reviews FOR ALL USING (auth.role() = 'service_role');

-- Вставка тестовых отзывов
INSERT INTO reviews (name, company, rating, text, is_published, is_featured, published_at, source) VALUES
  ('Анна Петрова', 'ООО "Строй-Мастер"', 5, 'Отличная команда! Помогли пройти налоговую проверку без единого штрафа. Всегда на связи, отвечают быстро и по делу.', TRUE, TRUE, NOW() - INTERVAL '2 months', 'manual'),
  ('Михаил Сидоров', 'ИП Сидоров М.А.', 5, 'Работаю с ПростоБюро уже 3 года. Никаких проблем с отчетностью, все сдается вовремя. Рекомендую!', TRUE, TRUE, NOW() - INTERVAL '1 month', 'manual'),
  ('Елена Козлова', 'ООО "Торговый дом"', 5, 'Профессиональный подход к делу. Оперативно решают любые вопросы. Цены адекватные, качество на высоте.', TRUE, FALSE, NOW() - INTERVAL '3 weeks', 'manual'),
  ('Дмитрий Волков', 'ИП Волков Д.И.', 4, 'Хорошая компания, но иногда бывают задержки с ответами. В целом довольны сотрудничеством.', TRUE, FALSE, NOW() - INTERVAL '2 weeks', 'manual'),
  ('Светлана Иванова', 'ООО "Инновации"', 5, 'Спасибо за профессиональную работу! Переехали к вам от другой компании и не пожалели. Все четко и в срок.', TRUE, TRUE, NOW() - INTERVAL '1 week', 'manual'),
  ('Алексей Морозов', 'ИП Морозов А.В.', 5, 'Отличный сервис! Особенно нравится личный кабинет и возможность отслеживать все процессы онлайн.', FALSE, FALSE, NULL, 'manual')
ON CONFLICT DO NOTHING;

-- Функция для получения статистики отзывов
CREATE OR REPLACE FUNCTION get_reviews_stats()
RETURNS TABLE(
  total_reviews INTEGER,
  published_reviews INTEGER,
  featured_reviews INTEGER,
  average_rating DECIMAL(3,2),
  reviews_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_reviews,
    COUNT(CASE WHEN is_published = TRUE THEN 1 END)::INTEGER as published_reviews,
    COUNT(CASE WHEN is_featured = TRUE THEN 1 END)::INTEGER as featured_reviews,
    ROUND(AVG(rating), 2)::DECIMAL(3,2) as average_rating,
    COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::INTEGER as reviews_this_month
  FROM reviews;
END;
$$ LANGUAGE plpgsql;

-- Выводим информацию о созданной таблице
SELECT 
  'reviews' as table_name,
  COUNT(*) as row_count,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_count,
  ROUND(AVG(rating), 2) as average_rating
FROM reviews;
