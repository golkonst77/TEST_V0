#!/bin/bash

# Скрипт для проверки состояния сервера

PROJECT_PATH="/var/www/prostoburo_c_usr/data/www/prostoburo.com"

echo "======================================================"
echo "Проверка состояния сервера"
echo "======================================================"
echo ""

cd "$PROJECT_PATH" || exit 1

echo "[INFO] Текущая директория: $(pwd)"
echo ""

echo "[INFO] Git статус:"
git log --oneline -1
echo ""

echo "[INFO] Версия из version.json:"
cat public/version.json | grep version
echo ""

echo "[INFO] Существует ли .next?"
if [ -d ".next" ]; then
    echo "✅ .next существует"
    echo "Размер: $(du -sh .next | cut -f1)"
else
    echo "❌ .next не найден"
fi
echo ""

echo "[INFO] PM2 статус:"
pm2 list | grep prostoburo
echo ""

echo "[INFO] Проверка API route:"
if [ -f "app/api/admin/settings/route.ts" ]; then
    echo "✅ route.ts существует"
    echo "Методы:"
    grep "export async function" app/api/admin/settings/route.ts
else
    echo "❌ route.ts не найден"
fi
echo ""

echo "[INFO] Последние 10 строк PM2 логов:"
pm2 logs prostoburo --lines 10 --nostream
echo ""

echo "======================================================"
echo "Проверка завершена"
echo "======================================================"


