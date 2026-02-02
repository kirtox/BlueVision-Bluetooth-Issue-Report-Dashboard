@echo off
REM Avatar Backup Script for Windows
REM This script creates a backup of all avatar files from the backend container
REM Usage: backup_avatars.bat [optional_suffix]
REM Example: backup_avatars.bat pre_cleanup

setlocal enabledelayedexpansion

REM Set directories
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "BACKUP_DIR=%PROJECT_ROOT%\avatar_backups"

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Generate timestamp using PowerShell
for /f "delims=" %%a in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set "TIMESTAMP=%%a"

REM Set backup filename with optional suffix
if "%1"=="" (
    set "BACKUP_FILE=avatars_%TIMESTAMP%"
) else (
    set "BACKUP_FILE=avatars_%1_%TIMESTAMP%"
)

set "BACKUP_PATH=%BACKUP_DIR%\%BACKUP_FILE%"

echo === Avatar Files Backup ===
echo Timestamp: %date% %time%
echo Backup name: %BACKUP_FILE%
echo Full path: %BACKUP_PATH%
echo.

REM Check if backend container is running
for /f %%i in ('podman ps -q -f name=backend 2^>nul') do set BACKEND_CONTAINER=%%i

if "%BACKEND_CONTAINER%"=="" (
    echo ❌ Error: Backend container is not running
    echo Please start the backend service first:
    echo podman-compose -f podman-compose.prod.yml up -d backend
    exit /b 1
)

echo 📦 Creating avatar backup...

REM Create temporary tar archive in container
podman exec %BACKEND_CONTAINER% tar -czf /tmp/avatars_backup.tar.gz -C /app uploads 2>nul

if %errorlevel% neq 0 (
    echo ⚠️  Warning: No avatar files found or error creating archive
    echo This is normal if no users have uploaded avatars yet
    exit /b 0
)

REM Copy tar file from container to host
podman cp %BACKEND_CONTAINER%:/tmp/avatars_backup.tar.gz "%BACKUP_PATH%.tar.gz"

if %errorlevel% neq 0 (
    echo ❌ Error: Failed to copy backup from container
    exit /b 1
)

REM Clean up temporary file in container
podman exec %BACKEND_CONTAINER% rm -f /tmp/avatars_backup.tar.gz

REM Get backup size
for %%A in ("%BACKUP_PATH%.tar.gz") do set "BACKUP_SIZE=%%~zA"
set /a "BACKUP_SIZE_KB=BACKUP_SIZE/1024"

echo ✅ Avatar backup completed successfully!
echo.
echo === Backup Summary ===
echo Backup file: %BACKUP_FILE%.tar.gz
echo File size: %BACKUP_SIZE_KB% KB
echo Location: %BACKUP_PATH%.tar.gz
echo Timestamp: %date% %time%
echo.
echo To restore this backup, use:
echo   .\scripts\restore_avatars.bat %BACKUP_FILE%.tar.gz

REM Optional: Clean up old backups (older than 30 days)
echo.
echo 🧹 Cleaning up old avatar backups (older than 30 days)...
forfiles /P "%BACKUP_DIR%" /M avatars_*.tar.gz /D -30 /C "cmd /c del @path" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Old backups cleaned up
) else (
    echo ℹ️  No old backups to clean up
)

echo.
echo Backup process completed at %date% %time%
