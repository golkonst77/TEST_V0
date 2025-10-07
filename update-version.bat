@echo off
chcp 65001 >nul

echo.
echo ======================================================
echo Автоматическое обновление версии
echo ======================================================
echo.

REM Проверяем, есть ли аргумент для типа обновления
if "%1"=="" (
    set TYPE=patch
) else (
    set TYPE=%1
)

echo [INFO] Тип обновления: %TYPE%
echo [INFO] Запуск PowerShell скрипта...

REM Запускаем PowerShell скрипт
powershell -ExecutionPolicy Bypass -File "scripts/auto-version.ps1" -Type %TYPE%

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================
    echo ВЕРСИЯ УСПЕШНО ОБНОВЛЕНА!
    echo ======================================================
    echo.
    echo [SUCCESS] Версия обновлена
    echo [INFO] Не забудьте сделать git add и git commit
    echo.
) else (
    echo.
    echo ======================================================
    echo ОШИБКА ПРИ ОБНОВЛЕНИИ ВЕРСИИ!
    echo ======================================================
    echo.
    echo [ERROR] Проверьте ошибки выше
    echo.
)

echo [INFO] Нажмите любую клавишу для продолжения...
pause >nul