# Автоматическое обновление версии для Windows
param(
    [string]$Type = "patch"  # patch, minor, major
)

# Путь к package.json
$packageJsonPath = "package.json"

try {
    # Читаем package.json
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    
    # Разбираем текущую версию
    $versionParts = $packageJson.version -split '\.'
    $major = [int]$versionParts[0]
    $minor = [int]$versionParts[1]
    $patch = [int]$versionParts[2]
    
    # Увеличиваем версию в зависимости от типа
    switch ($Type) {
        "major" { 
            $major++
            $minor = 0
            $patch = 0
        }
        "minor" { 
            $minor++
            $patch = 0
        }
        "patch" { 
            $patch++
        }
    }
    
    $newVersion = "$major.$minor.$patch"
    
    # Обновляем версию
    $packageJson.version = $newVersion
    
    # Сохраняем обновленный package.json
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
    
    Write-Host "✅ Версия обновлена: $($packageJson.version) → $newVersion" -ForegroundColor Green
    
    # Обновляем changelog
    $changelogPath = "docs/changelog.md"
    $currentDate = Get-Date -Format "yyyy-MM-dd"
    
    $newChangelogEntry = @"
## [$newVersion] - $currentDate - Автоматическое обновление версии

### Изменено
- Автоматическое обновление версии до $newVersion
- Обновлен package.json

"@
    
    # Читаем текущий changelog
    $changelogContent = Get-Content $changelogPath -Raw
    
    # Находим позицию после заголовка
    $headerEnd = $changelogContent.IndexOf("## [")
    if ($headerEnd -gt 0) {
        $beforeHeader = $changelogContent.Substring(0, $headerEnd)
        $afterHeader = $changelogContent.Substring($headerEnd)
        $newContent = $beforeHeader + $newChangelogEntry + $afterHeader
    } else {
        $newContent = $changelogContent + "`n" + $newChangelogEntry
    }
    
    # Сохраняем обновленный changelog
    Set-Content $changelogPath $newContent
    
    Write-Host "✅ Changelog обновлен" -ForegroundColor Green
    Write-Host "🚀 Новая версия: $newVersion" -ForegroundColor Cyan
    
    return $newVersion
    
} catch {
    Write-Host "❌ Ошибка при обновлении версии: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
