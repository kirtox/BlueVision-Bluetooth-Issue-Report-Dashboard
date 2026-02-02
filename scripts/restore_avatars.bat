@echo off
REM Avatar Restore Script for Windows
REM This script restores avatar files from a backup to the backend container
REM Usage: restore_avatars.bat <backup_file>
REM Example: restore_avatars.bat avatars_20260202_120000.tar.gz

setlocal enabledelayedexpansion

REM Check if backup file parameter is provided
if "%1"=="" (
    echo ❌ Error: Please provide backup file name
    echo Usage: %0 ^<backup_file^>
    echo Example: %0 avatars_20260202_120000.tar.gz
    echo.
    echo Available avatar backup files:
    dir /b .\avatar_backups\avatars_*.tar.gz 2>nul
    exit /b 1
)

set "BACKUP_FILE=%1"
set "BACKUP_PATH=.\avatar_backups\%BACKUP_FILE%"

REM Check if backup file exists
if not exist "%BACKUP_PATH%" (
    echo ❌ Error: Backup file does not exist: %BACKUP_PATH%
    echo.
    echo Available avatar backup files:
    dir /b .\avatar_backups\avatars_*.tar.gz 2>nul
    exit /b 1
)

REM Display file information
for %%A in ("%BACKUP_PATH%") do (
    set "FILE_SIZE=%%~zA"
    set "FILE_DATE=%%~tA"
)

echo === Avatar Files Restore Process ===
echo Backup file: %BACKUP_FILE%
echo File path: %BACKUP_PATH%
echo File size: %FILE_SIZE% bytes
echo File date: %FILE_DATE%
echo.
echo ⚠️  WARNING: This will overwrite existing avatar files!
echo Current avatars will be replaced with backup data.
echo.

REM Confirmation prompt
set /p "confirm=Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Restore operation cancelled
    exit /b 0
)

echo.
echo 🔄 Starting avatar restore process...

REM Check if backend container is running
for /f %%i in ('podman ps -q -f name=backend 2^>nul') do set BACKEND_CONTAINER=%%i

if "%BACKEND_CONTAINER%"=="" (
    echo ❌ Error: Backend container is not running
    echo Please start the backend service first:
    echo podman-compose -f podman-compose.prod.yml up -d backend
    exit /b 1
)

REM Copy backup file to container
echo 📤 Copying backup file to container...
podman cp "%BACKUP_PATH%" %BACKEND_CONTAINER%:/tmp/avatars_restore.tar.gz

if %errorlevel% neq 0 (
    echo ❌ Error: Failed to copy backup file to container
    exit /b 1
)

REM Create backup of current avatars (just in case)
echo 💾 Creating safety backup of current avatars...
podman exec %BACKEND_CONTAINER% tar -czf /tmp/avatars_pre_restore_backup.tar.gz -C /app uploads 2>nul

REM Extract backup in container
echo 📦 Extracting avatar files...
podman exec %BACKEND_CONTAINER% sh -c "cd /app && tar -xzf /tmp/avatars_restore.tar.gz"

if %errorlevel% equ 0 (
    echo ✅ Avatar restore completed successfully!
    
    REM Clean up temporary files
    echo 🧹 Cleaning up temporary files...
    podman exec %BACKEND_CONTAINER% rm -f /tmp/avatars_restore.tar.gz
    
    echo.
    echo === Restore Summary ===
    echo ✅ Avatars restored from: %BACKUP_FILE%
    echo ✅ System is ready for use
    echo.
    echo A safety backup was created at: /tmp/avatars_pre_restore_backup.tar.gz
    echo You can remove it with: podman exec %BACKEND_CONTAINER% rm /tmp/avatars_pre_restore_backup.tar.gz
) else (
    echo ❌ Avatar restore failed!
    echo 🔄 Attempting to restore from safety backup...
    podman exec %BACKEND_CONTAINER% sh -c "cd /app && tar -xzf /tmp/avatars_pre_restore_backup.tar.gz"
    if %errorlevel% equ 0 (
        echo ✅ Successfully restored from safety backup
    ) else (
        echo ❌ Failed to restore from safety backup
    )
    exit /b 1
)

echo.
echo Restore process completed at %date% %time%
