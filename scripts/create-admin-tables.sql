-- Создание таблиц для админки калькулятора

-- Таблица услуг
CREATE TABLE IF NOT EXISTS calculator_services (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(50) UNIQUE NOT NULL,
    base_price INTEGER NOT NULL DEFAULT 0,
    description VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица множителей
CREATE TABLE IF NOT EXISTS calculator_multipliers (
    id SERIAL PRIMARY KEY,
    multiplier_type VARCHAR(20) NOT NULL, -- 'tax_system' или 'employees'
    key_name VARCHAR(20) NOT NULL,
    value DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных для услуг
INSERT INTO calculator_services (service_name, base_price, description, is_active) VALUES
('accounting', 3000, 'Бухгалтерский учет', true),
('payroll', 1500, 'Зарплата и кадры', true),
('legal', 2000, 'Юридическое сопровождение', true),
('registration', 5000, 'Регистрация фирм', true)
ON CONFLICT (service_name) DO NOTHING;

-- Вставка начальных данных для множителей налоговых систем
INSERT INTO calculator_multipliers (multiplier_type, key_name, value, label, is_active, sort_order) VALUES
('tax_system', 'usn', 1.0, 'УСН', true, 1),
('tax_system', 'osn', 1.5, 'ОСН', true, 2),
('tax_system', 'envd', 0.8, 'ЕНВД', true, 3),
('tax_system', 'patent', 0.7, 'Патент', true, 4)
ON CONFLICT DO NOTHING;

-- Вставка начальных данных для множителей по сотрудникам
INSERT INTO calculator_multipliers (multiplier_type, key_name, value, label, is_active, sort_order) VALUES
('employees', '0', 1.0, '0 сотрудников', true, 1),
('employees', '1-5', 1.2, '1-5 сотрудников', true, 2),
('employees', '6-15', 1.5, '6-15 сотрудников', true, 3),
('employees', '16-50', 2.0, '16-50 сотрудников', true, 4),
('employees', '50+', 3.0, '50+ сотрудников', true, 5)
ON CONFLICT DO NOTHING;

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_calculator_services_active ON calculator_services(is_active);
CREATE INDEX IF NOT EXISTS idx_calculator_multipliers_type ON calculator_multipliers(multiplier_type);
CREATE INDEX IF NOT EXISTS idx_calculator_multipliers_active ON calculator_multipliers(is_active);
