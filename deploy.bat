@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM --- Configuration ---
SET SSH_USER=root
SET SSH_HOST=212.34.138.16
SET SSH_KEY_PATH=C:\Users\SuperBoss007\.ssh\id_rsa
SET DEPLOY_SCRIPT_PATH=/home/pb001/deploy.sh
SET PROJECT_PATH=/var/www/prostoburo_c_usr/data/www/prostoburo.com

echo.
echo ======================================================
echo Starting deployment for 212.34.138.16...
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

REM Upload improved deploy script to server
echo [STEP 1] Uploading deploy script to server...
scp -i "%SSH_KEY_PATH%" deploy-server.sh %SSH_USER%@%SSH_HOST%:/home/pb001/deploy-server.sh

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to upload deploy script to server
    pause
    exit /b 1
)

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to create deploy script on server
    pause
    exit /b 1
)

echo [STEP 2] Making deploy script executable...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "chmod +x /home/pb001/deploy-server.sh"

echo [STEP 3] Running deployment with improved logging...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "/home/pb001/deploy-server.sh"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================
    echo DEPLOYMENT SUCCESSFUL!
    echo ======================================================
    echo.
    echo [INFO] Your application has been deployed successfully
    echo [INFO] Application name: prostoburo
    echo [INFO] Check your website: https://prostoburo.com
    echo [INFO] Server: %SSH_HOST%
    echo [INFO] Time: %DATE% %TIME%
    echo [INFO] Version information will be shown in the deployment log above
) else (
    echo.
    echo ======================================================
    echo DEPLOYMENT FAILED!
    echo ======================================================
    echo.
    echo [ERROR] Deployment completed with errors
    echo [ERROR] Exit code: %ERRORLEVEL%
    echo [INFO] Check the output above for details
)

echo.
echo Press any key to continue...
pause >nul
