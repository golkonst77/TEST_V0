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
echo Checking server status for 212.34.138.16...
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
echo.

REM Check server status
echo [STEP 1] Checking server status...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "
echo '[SERVER INFO]'
echo 'Date: \$(date)'
echo 'Uptime: \$(uptime)'
echo 'Disk usage: \$(df -h /)'
echo 'Memory usage: \$(free -h)'
echo
echo '[PROJECT INFO]'
if [ -d '%PROJECT_PATH%' ]; then
    echo 'Project directory: EXISTS'
    cd '%PROJECT_PATH%'
    echo 'Current directory: \$(pwd)'
    echo 'Files in directory:'
    ls -la | head -10
    echo
    if [ -f 'package.json' ]; then
        echo 'package.json: EXISTS'
        echo 'Node.js version: \$(node --version)'
        echo 'NPM version: \$(npm --version)'
    else
        echo 'package.json: NOT FOUND'
    fi
else
    echo 'Project directory: NOT FOUND'
    echo 'Available directories in /var/www/prostoburo_c_usr/data/www/:'
    ls -la /var/www/prostoburo_c_usr/data/www/ 2>/dev/null || echo 'Directory does not exist'
fi
echo
echo '[PM2 STATUS]'
if command -v pm2 &> /dev/null; then
    pm2 status
    echo
    echo '[PM2 LOGS - Last 5 lines]'
    pm2 logs --lines 5 --nostream
else
    echo 'PM2: NOT INSTALLED'
fi
echo
echo '[NGINX STATUS]'
if command -v nginx &> /dev/null; then
    systemctl status nginx --no-pager -l || echo 'Nginx status check failed'
else
    echo 'Nginx: NOT INSTALLED'
fi
"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================
    echo SERVER CHECK COMPLETED SUCCESSFULLY!
    echo ======================================================
) else (
    echo.
    echo ======================================================
    echo SERVER CHECK FAILED!
    echo ======================================================
    echo [ERROR] Could not connect to server or execute commands
    echo [ERROR] Exit code: %ERRORLEVEL%
)

echo.
echo Press any key to continue...
pause >nul
