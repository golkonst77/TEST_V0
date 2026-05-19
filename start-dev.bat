@echo off
cd /d "%~dp0"
echo.
echo  prostoburo - local dev server
echo  Project: %CD%
echo  URL:     http://localhost:3000
echo.
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)
echo Seeding local CMS storage (skip if files exist)...
call npm run storage:seed
if errorlevel 1 exit /b 1
echo.
echo Starting npm run dev ...
call npm run dev
pause
