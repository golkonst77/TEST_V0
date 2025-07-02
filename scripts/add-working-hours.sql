-- Добавление поля времени работы в таблицу settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"monday_friday": "9:00 - 18:00", "saturday": "10:00 - 15:00", "sunday": "Выходной"}';

-- Обновление существующих записей со значениями по умолчанию
UPDATE settings 
SET working_hours = '{"monday_friday": "9:00 - 18:00", "saturday": "10:00 - 15:00", "sunday": "Выходной"}'
WHERE working_hours IS NULL; 