CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name VARCHAR(255) DEFAULT 'ПростоБюро',
  site_description TEXT DEFAULT 'Профессиональные бухгалтерские услуги',
  phone VARCHAR(50) DEFAULT '+7 953 330-17-77',
  email VARCHAR(255) DEFAULT 'info@prostoburo.ru',
  address TEXT DEFAULT 'г. Калуга',
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

CREATE INDEX IF NOT EXISTS idx_settings_id ON settings(id);

INSERT INTO settings (id, site_name, site_description, phone, email, address, telegram, vk, maintenance_mode, analytics_enabled, quiz_mode, working_hours)
VALUES (1, 'ПростоБюро', 'Профессиональные бухгалтерские услуги', '+7 953 330-17-77', 'info@prostoburo.ru', 'г. Калуга', 'https://t.me/prostoburo', 'https://m.vk.com/buh_urist?from=groups', false, true, 'custom', '{"monday_friday": "9:00 - 18:00", "saturday": "10:00 - 15:00", "sunday": "Выходной"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_settings_updated_at ON settings;
CREATE TRIGGER trigger_update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update settings" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert settings" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 