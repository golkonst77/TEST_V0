-- Создание таблицы купонов
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  discount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_phone ON coupons(phone);
CREATE INDEX IF NOT EXISTS idx_coupons_created_at ON coupons(created_at);
CREATE INDEX IF NOT EXISTS idx_coupons_used ON coupons(used);
