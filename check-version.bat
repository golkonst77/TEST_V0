@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM --- Configuration ---
SET SSH_USER=root
SET SSH_HOST=212.34.138.16
SET SSH_KEY_PATH=C:\Users\SuperBoss007\.ssh\id_rsa
SET PROJECT_PATH=/var/www/prostoburo_c_usr/data/www/prostoburo.com

echo.
echo ======================================================
echo Checking version on server 212.34.138.16...
echo ======================================================
echo.

REM Check if SSH key exists
if not exist "%SSH_KEY_PATH%" (
    echo ERROR: SSH key not found at %SSH_KEY_PATH%
    echo Please check your SSH key path
    pause
    exit /b 1
)

echo [INFO] SSH key found: %SSH_KEY_PATH%
echo [INFO] Connecting to server: %SSH_USER%@%SSH_HOST%
echo [INFO] Project path: %PROJECT_PATH%
echo.

echo [STEP 1] Checking application version...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "cd %PROJECT_PATH% && echo '[VERSION] Current version:' && grep '\"version\"' package.json && echo '[VERSION] Build ID:' && cat .next/BUILD_ID 2>/dev/null || echo '[VERSION] No build ID found'"

echo.
echo [STEP 2] Checking PM2 status...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "pm2 status"

echo.
echo [STEP 3] Checking recent logs...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "pm2 logs prostoburo --lines 5 --nostream"

echo.
echo ======================================================
echo VERSION CHECK COMPLETED!
echo ======================================================
echo.
echo Press any key to continue...
pause >nul
