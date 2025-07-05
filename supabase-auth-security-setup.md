# Настройка безопасности Supabase Auth

## 🔐 Настройки Authentication

### 1. OTP Expiry (Срок действия одноразового пароля)
**Проблема:** OTP expiry установлен на более чем 1 час  
**Решение:** 
1. Перейдите в Supabase Dashboard → Authentication → Settings
2. Найдите раздел "Email OTP expiry"
3. Установите значение **3600 секунд (1 час)** или меньше
4. Рекомендуемое значение: **1800 секунд (30 минут)**

### 2. Password Protection (Защита от скомпрометированных паролей)
**Проблема:** Не включена проверка паролей через HaveIBeenPwned  
**Решение:**
1. Перейдите в Supabase Dashboard → Authentication → Settings
2. Найдите раздел "Password Protection"
3. Включите опцию **"Breach password protection"**
4. Это будет проверять пароли пользователей на соответствие базе скомпрометированных паролей

## 📋 Пошаговая инструкция

### Шаг 1: Выполните SQL-скрипт
```sql
-- Выполните файл: fix-all-security-issues.sql
-- Это исправит все проблемы с RLS и функциями
```

### Шаг 2: Настройте Auth
1. **Откройте Supabase Dashboard**
2. **Перейдите в Authentication → Settings**
3. **Настройте OTP Expiry:**
   - Email OTP expiry: `1800` (30 минут)
   - SMS OTP expiry: `600` (10 минут)
4. **Включите Password Protection:**
   - ✅ Breach password protection
5. **Сохраните изменения**

### Шаг 3: Проверьте результат
После выполнения всех настроек в Supabase Dashboard → Reports → Security должно показать:
- ✅ All tables have RLS enabled
- ✅ All functions have secure search_path
- ✅ OTP expiry is set correctly
- ✅ Password protection is enabled

## 🚀 Готово!
Все проблемы безопасности будут исправлены и ваш проект будет соответствовать рекомендациям Supabase. 