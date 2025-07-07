-- Добавляем поле is_active в таблицу checklists
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- Создаем индекс для быстрого поиска активного чек-листа
CREATE INDEX IF NOT EXISTS idx_checklists_is_active ON checklists(is_active);

-- Устанавливаем первый чек-лист как активный (если есть записи)
UPDATE checklists SET is_active = TRUE 
WHERE id = (SELECT id FROM checklists ORDER BY created_at ASC LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM checklists WHERE is_active = TRUE); 