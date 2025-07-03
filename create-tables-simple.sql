-- Создание основных таблиц для работы приложения

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

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Вставка настроек по умолчанию
INSERT INTO settings (id, site_name, site_description, phone, email, address, telegram, vk, maintenance_mode, analytics_enabled, quiz_mode) 
VALUES (1, 'ПростоБюро', 'Профессиональные бухгалтерские услуги', '+7 953 330-17-77', 'info@prostoburo.ru', 'Калуга', 'https://t.me/prostoburo', 'https://m.vk.com/buh_urist?from=groups', FALSE, TRUE, 'custom')
ON CONFLICT (id) DO NOTHING;

-- Вставка тестовых данных
INSERT INTO newsletter_subscribers (email, subscribed_at, is_active) VALUES
  ('test1@example.com', NOW() - INTERVAL '10 days', TRUE),
  ('test2@example.com', NOW() - INTERVAL '5 days', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO newsletter_campaigns (subject, content, status, created_at) VALUES
  ('Добро пожаловать в ПростоБюро!', 'Спасибо за подписку на нашу рассылку.', 'draft', NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING; 