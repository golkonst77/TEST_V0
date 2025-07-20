-- Исправление времени работы в базе данных
UPDATE settings 
SET working_hours = jsonb_set(
  working_hours::jsonb,
  '{saturday}',
  '"По согласованию"'
)
WHERE id = 1;

UPDATE settings 
SET working_hours = jsonb_set(
  working_hours::jsonb,
  '{sunday}',
  '"Выходной"'
)
WHERE id = 1;

-- Проверяем результат
SELECT working_hours FROM settings WHERE id = 1; 