-- Создание таблицы для конфигурации header
CREATE TABLE IF NOT EXISTS header_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  config JSONB NOT NULL DEFAULT '{
    "header": {
      "logo": {
        "text": "ПростоБюро",
        "show": true,
        "type": "text",
        "imageUrl": ""
      },
      "phone": {
        "number": "+7 953 330-17-77",
        "show": true
      },
      "social": {
        "telegram": "https://t.me/prostoburo",
        "vk": "https://m.vk.com/buh_urist?from=groups",
        "show": true
      },
      "ctaButton": {
        "text": "Получить скидку",
        "show": true
      },
      "menuItems": [
        {
          "id": "services",
          "title": "Услуги",
          "href": "/services",
          "show": true,
          "type": "link"
        },
        {
          "id": "pricing",
          "title": "Тарифы",
          "href": "/pricing",
          "show": true,
          "type": "link"
        },
        {
          "id": "calculator",
          "title": "Калькулятор",
          "href": "/calculator",
          "show": true,
          "type": "link"
        },
        {
          "id": "about",
          "title": "О компании",
          "href": "/about",
          "show": true,
          "type": "link"
        },
        {
          "id": "blog",
          "title": "Блог",
          "href": "/blog",
          "show": true,
          "type": "link"
        },
        {
          "id": "contacts",
          "title": "Контакты",
          "href": "#contacts",
          "show": true,
          "type": "link"
        }
      ],
      "layout": {
        "sticky": true,
        "background": "white",
        "height": 64
      }
    }
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT header_config_single_row CHECK (id = 1)
);

-- Создание индекса для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_header_config_id ON header_config(id);

-- Вставка начальных данных, если таблица пустая
INSERT INTO header_config (id, config)
VALUES (1, '{
  "header": {
    "logo": {
      "text": "ПростоБюро",
      "show": true,
      "type": "text",
      "imageUrl": ""
    },
    "phone": {
      "number": "+7 953 330-17-77",
      "show": true
    },
    "social": {
      "telegram": "https://t.me/prostoburo",
      "vk": "https://m.vk.com/buh_urist?from=groups",
      "show": true
    },
    "ctaButton": {
      "text": "Получить скидку",
      "show": true
    },
    "menuItems": [
      {
        "id": "services",
        "title": "Услуги",
        "href": "/services",
        "show": true,
        "type": "link"
      },
      {
        "id": "pricing",
        "title": "Тарифы",
        "href": "/pricing",
        "show": true,
        "type": "link"
      },
      {
        "id": "calculator",
        "title": "Калькулятор",
        "href": "/calculator",
        "show": true,
        "type": "link"
      },
      {
        "id": "about",
        "title": "О компании",
        "href": "/about",
        "show": true,
        "type": "link"
      },
      {
        "id": "blog",
        "title": "Блог",
        "href": "/blog",
        "show": true,
        "type": "link"
      },
      {
        "id": "contacts",
        "title": "Контакты",
        "href": "#contacts",
        "show": true,
        "type": "link"
      }
    ],
    "layout": {
      "sticky": true,
      "background": "white",
      "height": 64
    }
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Функция для обновления времени изменения
CREATE OR REPLACE FUNCTION update_header_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS trigger_update_header_config_updated_at ON header_config;
CREATE TRIGGER trigger_update_header_config_updated_at
  BEFORE UPDATE ON header_config
  FOR EACH ROW
  EXECUTE FUNCTION update_header_config_updated_at();

-- Политики безопасности (RLS)
ALTER TABLE header_config ENABLE ROW LEVEL SECURITY;

-- Политика для чтения (публичный доступ)
CREATE POLICY "Allow public read access to header config" ON header_config
  FOR SELECT USING (true);

-- Политика для записи (только аутентифицированные пользователи)
CREATE POLICY "Allow authenticated users to update header config" ON header_config
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Политика для вставки (только аутентифицированные пользователи)
CREATE POLICY "Allow authenticated users to insert header config" ON header_config
  FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 