@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ======================================================
echo Version Update Script
echo ======================================================
echo.

REM Get current version from version.json
for /f "tokens=2 delims=:" %%a in ('findstr "version" public\version.json') do (
    set current_version=%%a
    set current_version=!current_version: =!
    set current_version=!current_version:,=!
    set current_version=!current_version:"=!
)

echo [INFO] Current version: %current_version%

REM Ask for version type
echo.
echo Select version update type:
echo 1. Patch (1.0.3 -^> 1.0.4) - Bug fixes
echo 2. Minor (1.0.3 -^> 1.1.0) - New features
echo 3. Major (1.0.3 -^> 2.0.0) - Breaking changes
echo 4. Custom - Enter your own version
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    set version_type=patch
) else if "%choice%"=="2" (
    set version_type=minor
) else if "%choice%"=="3" (
    set version_type=major
) else if "%choice%"=="4" (
    set /p custom_version="Enter new version (e.g., 1.2.3): "
    set new_version=%custom_version%
    goto :update_files
) else (
    echo [ERROR] Invalid choice
    pause
    exit /b 1
)

REM Calculate new version
for /f "tokens=1,2,3 delims=." %%a in ("%current_version%") do (
    set major=%%a
    set minor=%%b
    set patch=%%c
)

if "%version_type%"=="patch" (
    set /a new_patch=%patch%+1
    set new_version=%major%.%minor%.%new_patch%
) else if "%version_type%"=="minor" (
    set /a new_minor=%minor%+1
    set new_version=%major%.%new_minor%.0
) else if "%version_type%"=="major" (
    set /a new_major=%major%+1
    set new_version=%new_major%.0.0
)

:update_files
echo.
echo [INFO] Updating version from %current_version% to %new_version%

REM Update version.json
powershell -Command "(Get-Content 'public\version.json') -replace '\"version\": \"[^\"]*\"', '\"version\": \"%new_version%\"' | Set-Content 'public\version.json'"
powershell -Command "(Get-Content 'public\version.json') -replace '\"build\": \"[^\"]*\"', '\"build\": \"%new_version:.=%\"' | Set-Content 'public\version.json'"
powershell -Command "(Get-Content 'public\version.json') -replace '\"date\": \"[^\"]*\"', '\"date\": \"%DATE:~-4%-%DATE:~3,2%-%DATE:~0,2%\"' | Set-Content 'public\version.json'"

echo [SUCCESS] Version files updated

REM Ask for commit message
echo.
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" (
    set commit_message=chore: bump version to %new_version%
)

REM Add and commit changes
echo.
echo [STEP 1] Adding files to git...
git add public/version.json

echo [STEP 2] Committing changes...
git commit -m "%commit_message%"

echo [STEP 3] Creating git tag...
git tag -a "v%new_version%" -m "Release version %new_version%"

echo [STEP 4] Pushing to GitHub...
git push origin main
git push origin "v%new_version%"

echo.
echo ======================================================
echo VERSION UPDATE COMPLETED!
echo ======================================================
echo.
echo [SUCCESS] Version updated to: %new_version%
echo [SUCCESS] Git tag created: v%new_version%
echo [SUCCESS] Changes pushed to GitHub
echo [INFO] Check your repository: https://github.com/golkonst77/TEST_V0
echo [INFO] New tag: https://github.com/golkonst77/TEST_V0/releases/tag/v%new_version%
echo.

pause
