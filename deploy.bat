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

REM Create improved deploy script on server
echo [STEP 1] Creating deploy script on server...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "cat > /home/pb001/deploy-improved.sh << 'EOF'
#!/bin/bash
set -e

echo '[DEPLOY] Starting deployment process...'
echo '[DEPLOY] Current directory: \$(pwd)'
echo '[DEPLOY] User: \$(whoami)'
echo '[DEPLOY] Date: \$(date)'

# Check if project directory exists
if [ ! -d \"%PROJECT_PATH%\" ]; then
    echo '[ERROR] Project directory not found: %PROJECT_PATH%'
    echo '[INFO] Available directories in /var/www/prostoburo_c_usr/data/www/:'
    ls -la /var/www/prostoburo_c_usr/data/www/ || echo 'Directory does not exist'
    exit 1
fi

# Navigate to project directory
cd \"%PROJECT_PATH%\"
echo '[INFO] Changed to project directory: \$(pwd)'

# Check if it's a git repository
if [ ! -d \".git\" ]; then
    echo '[ERROR] Not a git repository'
    echo '[INFO] Initializing git repository...'
    git init
    git remote add origin https://github.com/your-username/your-repo.git || echo '[WARNING] Could not add remote origin'
fi

# Pull latest changes
echo '[STEP 1] Pulling latest changes...'
git pull origin main || echo '[WARNING] Git pull failed, continuing...'

# Check if package.json exists
if [ ! -f \"package.json\" ]; then
    echo '[ERROR] package.json not found in \$(pwd)'
    echo '[INFO] Files in current directory:'
    ls -la
    exit 1
fi

# Install dependencies
echo '[STEP 2] Installing dependencies...'
npm install --production

# Build project
echo '[STEP 3] Building project...'
npm run build

# Restart application with PM2
echo '[STEP 4] Restarting application...'
pm2 restart my-next-app --update-env || pm2 start npm --name \"my-next-app\" -- start

# Show PM2 status
echo '[STEP 5] Application status:'
pm2 status

echo '[SUCCESS] Deployment completed successfully!'
echo '[INFO] Application should be running now'
EOF"

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to create deploy script on server
    pause
    exit /b 1
)

echo [STEP 2] Making deploy script executable...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "chmod +x /home/pb001/deploy-improved.sh"

echo [STEP 3] Running deployment...
ssh -t -i "%SSH_KEY_PATH%" %SSH_USER%@%SSH_HOST% "/home/pb001/deploy-improved.sh"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================
    echo DEPLOYMENT SUCCESSFUL!
    echo ======================================================
    echo.
    echo [INFO] Your application has been deployed successfully
    echo [INFO] Check your website: https://prostoburo.com
    echo [INFO] Server: %SSH_HOST%
    echo [INFO] Time: %DATE% %TIME%
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
