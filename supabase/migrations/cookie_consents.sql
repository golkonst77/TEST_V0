-- Таблица для хранения согласий пользователей на обработку cookies
-- Соответствие ФЗ-152 "О персональных данных"

CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  essential BOOLEAN DEFAULT true NOT NULL,
  analytics BOOLEAN DEFAULT false NOT NULL,
  marketing BOOLEAN DEFAULT false NOT NULL,
  consent_timestamp TIMESTAMPTZ NOT NULL,
  policy_version TEXT DEFAULT '1.0' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_cookie_consents_ip ON cookie_consents(ip_address);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_created_at ON cookie_consents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cookie_consents_analytics ON cookie_consents(analytics) WHERE analytics = true;

-- Комментарии к таблице и столбцам
COMMENT ON TABLE cookie_consents IS 'Хранение согласий пользователей на обработку персональных данных и использование cookies';
COMMENT ON COLUMN cookie_consents.id IS 'Уникальный идентификатор записи';
COMMENT ON COLUMN cookie_consents.ip_address IS 'IP адрес пользователя (может быть персональными данными)';
COMMENT ON COLUMN cookie_consents.user_agent IS 'User-Agent браузера пользователя';
COMMENT ON COLUMN cookie_consents.essential IS 'Согласие на необходимые cookies (всегда true)';
COMMENT ON COLUMN cookie_consents.analytics IS 'Согласие на аналитические cookies (Яндекс.Метрика)';
COMMENT ON COLUMN cookie_consents.marketing IS 'Согласие на маркетинговые cookies';
COMMENT ON COLUMN cookie_consents.consent_timestamp IS 'Время предоставления согласия (с клиента)';
COMMENT ON COLUMN cookie_consents.policy_version IS 'Версия политики конфиденциальности на момент согласия';
COMMENT ON COLUMN cookie_consents.created_at IS 'Время создания записи на сервере';
COMMENT ON COLUMN cookie_consents.updated_at IS 'Время последнего обновления записи';

-- Trigger для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_cookie_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cookie_consents_updated_at
  BEFORE UPDATE ON cookie_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_cookie_consents_updated_at();

-- Row Level Security (RLS)
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

-- Политика: Только администраторы могут читать данные
CREATE POLICY "Admins can read cookie consents"
  ON cookie_consents
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Политика: Сервис (service_role) может вставлять записи
CREATE POLICY "Service can insert cookie consents"
  ON cookie_consents
  FOR INSERT
  WITH CHECK (true);





