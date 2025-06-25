-- Создание таблиц для админки

-- Таблица для настроек калькулятора
CREATE TABLE IF NOT EXISTS calculator_settings (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    base_price INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для множителей калькулятора
CREATE TABLE IF NOT EXISTS calculator_multipliers (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'tax_system' или 'employees'
    key VARCHAR(50) NOT NULL,
    value DECIMAL(3,2) NOT NULL,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для тарифных планов
CREATE TABLE IF NOT EXISTS pricing_plans (
    id SERIAL PRIMARY KEY,
    plan_type VARCHAR(20) NOT NULL, -- 'ip' или 'ooo'
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    period VARCHAR(20) DEFAULT 'мес',
    description TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для функций тарифных планов
CREATE TABLE IF NOT EXISTS pricing_features (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES pricing_plans(id) ON DELETE CASCADE,
    feature_text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для дополнительных услуг
CREATE TABLE IF NOT EXISTS additional_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных для калькулятора
INSERT INTO calculator_settings (service_name, base_price, description) VALUES
('accounting', 3000, 'Бухгалтерский учет'),
('payroll', 1500, 'Зарплата и кадры'),
('legal', 2000, 'Юридическое сопровождение'),
('registration', 5000, 'Регистрация фирм');

-- Вставка множителей для налоговых систем
INSERT INTO calculator_multipliers (type, key, value, label) VALUES
('tax_system', 'usn', 1.0, 'УСН'),
('tax_system', 'osn', 1.5, 'ОСН'),
('tax_system', 'envd', 0.8, 'ЕНВД'),
('tax_system', 'patent', 0.7, 'Патент');

-- Вставка множителей для количества сотрудников
INSERT INTO calculator_multipliers (type, key, value, label) VALUES
('employees', '0', 1.0, '0 сотрудников'),
('employees', '1-5', 1.2, '1-5 сотрудников'),
('employees', '6-15', 1.5, '6-15 сотрудников'),
('employees', '16-50', 2.0, '16-50 сотрудников'),
('employees', '50+', 3.0, '50+ сотрудников');
