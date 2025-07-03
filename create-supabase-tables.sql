-- ==============================================
-- СКРИПТ ДЛЯ СОЗДАНИЯ БАЗЫ ДАННЫХ SUPABASE
-- ==============================================

-- 1. Создаем таблицу для подписчиков рассылки
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created ON newsletter_subscribers(created_at);

-- 2. Создаем таблицу для купонов
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit INTEGER DEFAULT NULL,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для купонов
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expires ON coupons(expires_at);

-- 3. Создаем таблицу для использования купонов
CREATE TABLE IF NOT EXISTS coupon_usage (
  id SERIAL PRIMARY KEY,
  coupon_id INTEGER NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  discount_amount DECIMAL(10,2),
  order_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем индексы для использования купонов
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_email ON coupon_usage(user_email);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_used_at ON coupon_usage(used_at);

-- 4. Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Создаем триггеры для автоматического обновления updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Создаем функцию для создания таблиц (для использования в API)
CREATE OR REPLACE FUNCTION create_newsletter_table()
RETURNS VOID AS $$
BEGIN
  -- Создаем таблицу если её нет
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Создаем индексы если их нет
  CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
  CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);
END;
$$ LANGUAGE plpgsql;

-- 7. Создаем функцию для получения статистики подписчиков
CREATE OR REPLACE FUNCTION get_newsletter_stats()
RETURNS TABLE (
  total_subscribers INTEGER,
  active_subscribers INTEGER,
  new_this_month INTEGER,
  new_today INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER AS total_subscribers,
    COUNT(CASE WHEN is_active THEN 1 END)::INTEGER AS active_subscribers,
    COUNT(CASE WHEN created_at >= DATE_TRUNC('month', NOW()) THEN 1 END)::INTEGER AS new_this_month,
    COUNT(CASE WHEN created_at >= DATE_TRUNC('day', NOW()) THEN 1 END)::INTEGER AS new_today
  FROM newsletter_subscribers;
END;
$$ LANGUAGE plpgsql;

-- 8. Создаем функцию для получения статистики купонов
CREATE OR REPLACE FUNCTION get_coupon_stats()
RETURNS TABLE (
  total_coupons INTEGER,
  active_coupons INTEGER,
  used_coupons INTEGER,
  expired_coupons INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER AS total_coupons,
    COUNT(CASE WHEN is_active THEN 1 END)::INTEGER AS active_coupons,
    COUNT(CASE WHEN usage_count > 0 THEN 1 END)::INTEGER AS used_coupons,
    COUNT(CASE WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN 1 END)::INTEGER AS expired_coupons
  FROM coupons;
END;
$$ LANGUAGE plpgsql;

-- 9. Вставляем тестовые данные
INSERT INTO newsletter_subscribers (email, subscribed_at, is_active) VALUES
  ('test@example.com', NOW(), TRUE),
  ('admin@prostoburo.ru', NOW(), TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO coupons (code, discount_percent, description, is_active, usage_limit) VALUES
  ('WELCOME10', 10, 'Скидка 10% для новых клиентов', TRUE, 100),
  ('SAVE20', 20, 'Скидка 20% на все услуги', TRUE, 50),
  ('FIRST30', 30, 'Скидка 30% на первый заказ', TRUE, 25)
ON CONFLICT (code) DO NOTHING;

-- 10. Создаем политики безопасности RLS (Row Level Security)
-- Для newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Политика для чтения (только для authenticated пользователей)
CREATE POLICY "Allow read access to newsletter_subscribers" ON newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Политика для вставки (разрешаем всем)
CREATE POLICY "Allow insert access to newsletter_subscribers" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Для coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Политика для чтения купонов (разрешаем всем)
CREATE POLICY "Allow read access to coupons" ON coupons
  FOR SELECT USING (true);

-- Политика для управления купонами (только для authenticated)
CREATE POLICY "Allow full access to coupons for authenticated users" ON coupons
  FOR ALL USING (auth.role() = 'authenticated');

-- Для coupon_usage
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Политика для использования купонов
CREATE POLICY "Allow insert coupon usage" ON coupon_usage
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read coupon usage for authenticated" ON coupon_usage
  FOR SELECT USING (auth.role() = 'authenticated');

-- ==============================================
-- СКРИПТ ЗАВЕРШЕН
-- ==============================================

-- Выводим информацию о созданных таблицах
SELECT 
  'newsletter_subscribers' as table_name,
  COUNT(*) as row_count
FROM newsletter_subscribers
UNION ALL
SELECT 
  'coupons' as table_name,
  COUNT(*) as row_count
FROM coupons
UNION ALL
SELECT 
  'coupon_usage' as table_name,
  COUNT(*) as row_count
FROM coupon_usage; 