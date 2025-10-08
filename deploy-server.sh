#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация
PROJECT_PATH="/var/www/prostoburo_c_usr/data/www/prostoburo.com"
REPO_URL="https://github.com/golkonst77/TEST_V0.git"
BRANCH="main"
PM2_APP_NAME="prostoburo"

echo ""
echo "======================================================"
echo "Starting deployment for prostoburo.com"
echo "======================================================"
echo ""

# Проверка существования директории проекта
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}[ERROR] Project directory not found: $PROJECT_PATH${NC}"
    exit 1
fi

cd "$PROJECT_PATH" || exit 1

echo "[INFO] Current directory: $(pwd)"
echo "[INFO] Pulling latest changes from GitHub..."

# Проверка, является ли директория Git репозиторием
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}[WARNING] Not a git repository. Initializing...${NC}"
    git init
    git remote add origin "$REPO_URL"
fi

# Сохранение локальных изменений (если есть)
echo "[INFO] Stashing local changes..."
git stash

# Получение последних изменений
echo "[INFO] Fetching from origin..."
git fetch origin

# Переключение на нужную ветку
echo "[INFO] Checking out branch: $BRANCH"
git checkout "$BRANCH" || git checkout -b "$BRANCH" origin/"$BRANCH"

# Принудительное обновление до состояния на GitHub (force pull)
echo "[INFO] Force pulling latest changes from GitHub..."
echo "[WARNING] Local changes will be overwritten"
git reset --hard origin/"$BRANCH"

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to pull changes from GitHub${NC}"
    exit 1
fi

echo -e "${GREEN}[SUCCESS] Code updated from GitHub${NC}"

# Проверка наличия .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}[WARNING] .env.local not found${NC}"
    echo "[INFO] Please create .env.local with required environment variables"
fi

# Установка зависимостей
echo "[INFO] Installing dependencies..."
npm install --production=false

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}[SUCCESS] Dependencies installed${NC}"

# Очистка старой сборки
echo "[INFO] Cleaning old build..."
rm -rf .next

# Сборка проекта
echo "[INFO] Building Next.js application..."
echo "[INFO] This may take several minutes..."

# Увеличиваем лимит памяти для сборки
export NODE_OPTIONS="--max_old_space_size=2048"

npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Build failed${NC}"
    echo "[INFO] Check the output above for build errors"
    exit 1
fi

echo -e "${GREEN}[SUCCESS] Build completed successfully${NC}"

# Перезапуск PM2
echo "[INFO] Restarting PM2 application: $PM2_APP_NAME"

# Проверка, существует ли приложение в PM2
if pm2 list | grep -q "$PM2_APP_NAME"; then
    echo "[INFO] Restarting existing PM2 process..."
    pm2 restart "$PM2_APP_NAME"
else
    echo "[INFO] Starting new PM2 process..."
    pm2 start npm --name "$PM2_APP_NAME" -- start
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to restart PM2${NC}"
    exit 1
fi

# Сохранение конфигурации PM2
pm2 save

echo -e "${GREEN}[SUCCESS] PM2 application restarted${NC}"

# Показываем статус PM2
echo ""
echo "[INFO] PM2 Status:"
pm2 list

# Читаем версию из version.json
if [ -f "public/version.json" ]; then
    VERSION=$(node -p "require('./public/version.json').version" 2>/dev/null)
    if [ -n "$VERSION" ]; then
        echo ""
        echo "======================================================"
        echo -e "${GREEN}DEPLOYMENT SUCCESSFUL!${NC}"
        echo "======================================================"
        echo ""
        echo -e "${GREEN}Version: $VERSION${NC}"
        echo "Website: https://prostoburo.com"
        echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        echo "======================================================"
    fi
else
    echo ""
    echo "======================================================"
    echo -e "${GREEN}DEPLOYMENT SUCCESSFUL!${NC}"
    echo "======================================================"
    echo ""
    echo "Website: https://prostoburo.com"
    echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "======================================================"
fi

exit 0
