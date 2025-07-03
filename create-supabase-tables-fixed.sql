-- ==============================================
-- СКРИПТ ДЛЯ СОЗДАНИЯ БАЗЫ ДАННЫХ SUPABASE (ИСПРАВЛЕННАЯ ВЕРСИЯ)
-- ==============================================

-- Создание таблиц для системы рассылки ПростоБюро

-- Таблица подписчиков рассылки
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица кампаний рассылок
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица логов отправки писем
CREATE TABLE IF NOT EXISTS newsletter_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица профилей пользователей
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

-- Таблица настроек сайта
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name VARCHAR(255) DEFAULT 'ПростоБюро',
  site_description TEXT DEFAULT 'Профессиональные бухгалтерские услуги',
  phone VARCHAR(50) DEFAULT '+7 953 330-17-77',
  email VARCHAR(255) DEFAULT 'info@prostoburo.ru',
  address TEXT DEFAULT 'Калуга',
  telegram VARCHAR(255) DEFAULT 'https://t.me/prostoburo',
  vk VARCHAR(255) DEFAULT 'https://m.vk.com/buh_urist?from=groups',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  analytics_enabled BOOLEAN DEFAULT TRUE,
  quiz_mode VARCHAR(20) DEFAULT 'custom',
  quiz_url TEXT,
  working_hours JSONB DEFAULT '{"monday_friday": "9:00 - 18:00", "saturday": "10:00 - 15:00", "sunday": "Выходной"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT settings_single_row CHECK (id = 1)
);

-- Таблица купонов
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица использования купонов
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_amount DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created ON newsletter_subscribers(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created ON newsletter_campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled ON newsletter_campaigns(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_logs_campaign ON newsletter_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_email ON newsletter_logs(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_status ON newsletter_logs(status);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expires ON coupons(expires_at);

CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_email ON coupon_usage(email);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created ON user_profiles(created_at);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_campaigns_updated_at ON newsletter_campaigns;
CREATE TRIGGER update_newsletter_campaigns_updated_at
  BEFORE UPDATE ON newsletter_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Функция для получения статистики подписчиков
CREATE OR REPLACE FUNCTION get_newsletter_stats()
RETURNS TABLE(
  total_subscribers INTEGER,
  active_subscribers INTEGER,
  subscribers_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_subscribers,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END)::INTEGER as active_subscribers,
    COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::INTEGER as subscribers_this_month
  FROM newsletter_subscribers;
END;
$$ LANGUAGE plpgsql;

-- Функция для получения статистики кампаний
CREATE OR REPLACE FUNCTION get_campaign_stats()
RETURNS TABLE(
  total_campaigns INTEGER,
  sent_campaigns INTEGER,
  draft_campaigns INTEGER,
  scheduled_campaigns INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_campaigns,
    COUNT(CASE WHEN status = 'sent' THEN 1 END)::INTEGER as sent_campaigns,
    COUNT(CASE WHEN status = 'draft' THEN 1 END)::INTEGER as draft_campaigns,
    COUNT(CASE WHEN status = 'scheduled' THEN 1 END)::INTEGER as scheduled_campaigns
  FROM newsletter_campaigns;
END;
$$ LANGUAGE plpgsql;

-- Настройка RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Политики доступа (разрешаем все для сервисной роли)
DROP POLICY IF EXISTS "Allow all for service role" ON newsletter_subscribers;
CREATE POLICY "Allow all for service role" ON newsletter_subscribers FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all for service role" ON newsletter_campaigns;
CREATE POLICY "Allow all for service role" ON newsletter_campaigns FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all for service role" ON newsletter_logs;
CREATE POLICY "Allow all for service role" ON newsletter_logs FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all for service role" ON coupons;
CREATE POLICY "Allow all for service role" ON coupons FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all for service role" ON coupon_usage;
CREATE POLICY "Allow all for service role" ON coupon_usage FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all for service role" ON user_profiles;
CREATE POLICY "Allow all for service role" ON user_profiles FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow all for service role" ON settings;
CREATE POLICY "Allow all for service role" ON settings FOR ALL USING (auth.role() = 'service_role');

-- Вставка настроек по умолчанию
INSERT INTO settings (id, site_name, site_description, phone, email, address, telegram, vk, maintenance_mode, analytics_enabled, quiz_mode) 
VALUES (1, 'ПростоБюро', 'Профессиональные бухгалтерские услуги', '+7 953 330-17-77', 'info@prostoburo.ru', 'Калуга', 'https://t.me/prostoburo', 'https://m.vk.com/buh_urist?from=groups', FALSE, TRUE, 'custom')
ON CONFLICT (id) DO NOTHING;

-- Вставка тестовых данных
INSERT INTO newsletter_subscribers (email, subscribed_at, is_active) VALUES
  ('test1@example.com', NOW() - INTERVAL '10 days', TRUE),
  ('test2@example.com', NOW() - INTERVAL '5 days', TRUE),
  ('test3@example.com', NOW() - INTERVAL '2 days', FALSE),
  ('test4@example.com', NOW() - INTERVAL '1 day', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO newsletter_campaigns (subject, content, status, created_at) VALUES
  ('Добро пожаловать в ПростоБюро!', 'Спасибо за подписку на нашу рассылку. Мы будем держать вас в курсе всех новостей бухгалтерского учета.', 'draft', NOW() - INTERVAL '3 days'),
  ('Новые изменения в налоговом законодательстве', 'Уважаемые клиенты! Информируем вас о важных изменениях в налоговом законодательстве, которые вступают в силу с следующего месяца.', 'sent', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO coupons (code, discount_type, discount_value, description, is_active, usage_limit, expires_at) VALUES
  ('WELCOME10', 'percentage', 10.00, 'Скидка 10% для новых клиентов', TRUE, 100, NOW() + INTERVAL '30 days'),
  ('SAVE500', 'fixed', 500.00, 'Скидка 500 рублей на первый месяц', TRUE, 50, NOW() + INTERVAL '60 days'),
  ('SPRING2024', 'percentage', 15.00, 'Весенняя скидка 15%', TRUE, 200, NOW() + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;

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
  'newsletter_campaigns' as table_name,
  COUNT(*) as row_count
FROM newsletter_campaigns
UNION ALL
SELECT 
  'coupons' as table_name,
  COUNT(*) as row_count
FROM coupons
UNION ALL
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as row_count
FROM user_profiles
UNION ALL
SELECT 
  'settings' as table_name,
  COUNT(*) as row_count
FROM settings; 