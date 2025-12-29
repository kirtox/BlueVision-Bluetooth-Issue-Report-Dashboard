@echo off
REM Database Restore Script for Windows
REM This script restores a PostgreSQL database from a backup file
REM Usage: restore_db.bat <backup_file>
REM Example: restore_db.bat backup_20241229_000000.sql

setlocal enabledelayedexpansion

REM Check if backup file parameter is provided
if "%1"=="" (
    echo ❌ Error: Please provide backup file name
    echo Usage: %0 ^<backup_file^>
    echo Example: %0 backup_20241229_000000.sql
    echo.
    echo Available backup files:
    dir /b .\db_backups\*.sql 2>nul
    exit /b 1
)

set "BACKUP_FILE=%1"
set "BACKUP_PATH=.\db_backups\%BACKUP_FILE%"

REM Check if backup file exists
if not exist "%BACKUP_PATH%" (
    echo ❌ Error: Backup file does not exist: %BACKUP_PATH%
    echo.
    echo Available backup files:
    dir /b .\db_backups\*.sql 2>nul
    exit /b 1
)

REM Display file information
for %%A in ("%BACKUP_PATH%") do (
    set "FILE_SIZE=%%~zA"
    set "FILE_DATE=%%~tA"
)

echo === Database Restore Process ===
echo Backup file: %BACKUP_FILE%
echo File path: %BACKUP_PATH%
echo File size: %FILE_SIZE% bytes
echo File date: %FILE_DATE%
echo.
echo ⚠️  WARNING: This will overwrite existing database data!
echo Current database will be replaced with backup data.
echo.

REM Confirmation prompt
set /p "confirm=Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Restore operation cancelled
    exit /b 0
)

echo.
echo 🔄 Starting database restore process...

REM Check if database container is running
for /f %%i in ('podman ps -q -f name=db 2^>nul') do set DB_CONTAINER=%%i

if "%DB_CONTAINER%"=="" (
    echo ❌ Error: Database container is not running
    echo Please start the database service first:
    echo podman-compose -f podman-compose.prod.yml up -d db
    exit /b 1
)

REM Stop backend service to prevent conflicts
echo 📴 Stopping backend service...
podman-compose -f podman-compose.prod.yml stop backend
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Could not stop backend service, continuing anyway...
)

REM Restore database
echo 📥 Restoring database from backup...
podman exec -i %DB_CONTAINER% psql -U admin -d btird < "%BACKUP_PATH%"

if %errorlevel% equ 0 (
    echo ✅ Database restore completed successfully!
    echo 🚀 Restarting backend service...
    podman-compose -f podman-compose.prod.yml start backend
    if %errorlevel% equ 0 (
        echo ✅ Backend service restarted successfully!
        echo.
        echo === Restore Summary ===
        echo ✅ Database restored from: %BACKUP_FILE%
        echo ✅ Backend service restarted
        echo ✅ System is ready for use
    ) else (
        echo ⚠️  Warning: Backend service failed to restart
        echo Please start it manually: podman-compose -f podman-compose.prod.yml start backend
    )
) else (
    echo ❌ Database restore failed!
    echo 🚀 Attempting to restart backend service...
    podman-compose -f podman-compose.prod.yml start backend
    exit /b 1
)

echo.
echo Restore process completed at %date% %time%