@echo off
REM ============================================
REM BlueVision Version Update Script
REM ============================================
REM Usage: update_version.bat <new_version>
REM Example: update_version.bat 1.2.0
REM ============================================

setlocal enabledelayedexpansion

REM Check if version parameter is provided
if "%~1"=="" (
    echo Error: Please provide a version number
    echo Usage: update_version.bat ^<new_version^>
    echo Example: update_version.bat 1.2.0
    exit /b 1
)

set NEW_VERSION=%~1

REM Validate version format (basic check for X.Y.Z)
echo %NEW_VERSION% | findstr /r "^[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo Error: Invalid version format. Please use X.Y.Z format (e.g., 1.0.0)
    exit /b 1
)

echo.
echo ============================================
echo Updating BlueVision to version %NEW_VERSION%
echo ============================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..

REM File paths
set README_FILE=%PROJECT_ROOT%\README.md
set BACKEND_INIT=%PROJECT_ROOT%\backend\app\__init__.py
set PACKAGE_JSON=%PROJECT_ROOT%\frontend\package.json

REM Backup files
echo [1/4] Creating backups...
copy "%README_FILE%" "%README_FILE%.bak" >nul 2>&1
copy "%BACKEND_INIT%" "%BACKEND_INIT%.bak" >nul 2>&1
copy "%PACKAGE_JSON%" "%PACKAGE_JSON%.bak" >nul 2>&1
echo       Backup files created

REM Update README.md (line 3)
echo [2/4] Updating README.md...
powershell -Command "$content = Get-Content '%README_FILE%' -Raw; $content = $content -replace '(?m)^(`v[0-9]+\.[0-9]+\.[0-9]+`)$', '`v%NEW_VERSION%`'; Set-Content '%README_FILE%' -Value $content -NoNewline"
if errorlevel 1 (
    echo       Error updating README.md
    goto :restore
)
echo       Updated README.md to v%NEW_VERSION%

REM Update backend/__init__.py
echo [3/4] Updating backend/__init__.py...
powershell -Command "$content = Get-Content '%BACKEND_INIT%' -Raw; $content = $content -replace '__version__ = \"[0-9]+\.[0-9]+\.[0-9]+\"', '__version__ = \"%NEW_VERSION%\"'; Set-Content '%BACKEND_INIT%' -Value $content -NoNewline"
if errorlevel 1 (
    echo       Error updating backend/__init__.py
    goto :restore
)
echo       Updated backend/__init__.py to %NEW_VERSION%

REM Update frontend/package.json
echo [4/4] Updating frontend/package.json...
powershell -Command "$content = Get-Content '%PACKAGE_JSON%' -Raw; $content = $content -replace '\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"', '\"version\": \"%NEW_VERSION%\"'; Set-Content '%PACKAGE_JSON%' -Value $content -NoNewline"
if errorlevel 1 (
    echo       Error updating frontend/package.json
    goto :restore
)
echo       Updated frontend/package.json to %NEW_VERSION%

REM Delete backup files
del "%README_FILE%.bak" >nul 2>&1
del "%BACKEND_INIT%.bak" >nul 2>&1
del "%PACKAGE_JSON%.bak" >nul 2>&1

echo.
echo ============================================
echo SUCCESS! Version updated to %NEW_VERSION%
echo ============================================
echo.
echo Updated files:
echo   - README.md
echo   - backend/app/__init__.py
echo   - frontend/package.json
echo.
echo Next steps:
echo   1. Review the changes
echo   2. Commit the changes: git add . ^&^& git commit -m "Bump version to %NEW_VERSION%"
echo   3. Create a Git tag: git tag -a v%NEW_VERSION% -m "Release v%NEW_VERSION%"
echo   4. Push changes: git push ^&^& git push --tags
echo.
exit /b 0

:restore
echo.
echo ============================================
echo ERROR: Restoring backup files...
echo ============================================
copy "%README_FILE%.bak" "%README_FILE%" >nul 2>&1
copy "%BACKEND_INIT%.bak" "%BACKEND_INIT%" >nul 2>&1
copy "%PACKAGE_JSON%.bak" "%PACKAGE_JSON%.bak" >nul 2>&1
del "%README_FILE%.bak" >nul 2>&1
del "%BACKEND_INIT%.bak" >nul 2>&1
del "%PACKAGE_JSON%.bak" >nul 2>&1
echo Files restored from backup
exit /b 1
