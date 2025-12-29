@echo off
REM Manual Database Backup Script for Windows
REM This script creates an immediate backup of the PostgreSQL database
REM Usage: backup_db.bat [optional_suffix]
REM Example: backup_db.bat pre_migration

setlocal enabledelayedexpansion

REM Set directories
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "BACKUP_DIR=%PROJECT_ROOT%\db_backups"

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Generate timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "TIMESTAMP=%dt:~0,4%%dt:~4,2%%dt:~6,2%_%dt:~8,2%%dt:~10,2%%dt:~12,2%"

REM Set backup filename with optional suffix
if "%1"=="" (
    set "BACKUP_FILE=manual_backup_%TIMESTAMP%.sql"
) else (
    set "BACKUP_FILE=manual_backup_%1_%TIMESTAMP%.sql"
)

set "BACKUP_PATH=%BACKUP_DIR%\%BACKUP_FILE%"

echo === Manual Database Backup ===
echo Timestamp: %date% %time%
echo Backup file: %BACKUP_FILE%
echo Full path: %BACKUP_PATH%
echo.

REM Check if database container is running
for /f %%i in ('podman ps -q -f name=db') do set DB_CONTAINER=%%i

if "%DB_CONTAINER%"=="" (
    echo ❌ Error: Database container is not running
    echo Please start the database service first:
    echo podman-compose -f podman-compose.prod.yml up -d db
    exit /b 1
)

echo 📦 Creating database backup...

REM Create the backup
podman exec %DB_CONTAINER% pg_dump -U admin btird > "%BACKUP_PATH%"

REM Check if backup was successful
if %errorlevel% equ 0 (
    if exist "%BACKUP_PATH%" (
        for %%A in ("%BACKUP_PATH%") do set "BACKUP_SIZE=%%~zA"
        if !BACKUP_SIZE! gtr 0 (
            echo ✅ Backup completed successfully!
            echo 📁 File: %BACKUP_FILE%
            echo 📊 Size: !BACKUP_SIZE! bytes
            echo 📍 Location: %BACKUP_PATH%
        ) else (
            echo ❌ Backup failed - empty file created!
            del "%BACKUP_PATH%" 2>nul
            exit /b 1
        )
    ) else (
        echo ❌ Backup failed - no file created!
        exit /b 1
    )
) else (
    echo ❌ Backup failed!
    if exist "%BACKUP_PATH%" del "%BACKUP_PATH%" 2>nul
    exit /b 1
)

echo.
echo === Backup Summary ===
echo Total backups in directory:
dir /b "%BACKUP_DIR%\*.sql" 2>nul | find /c /v ""
echo.
echo Recent backups:
dir /o-d "%BACKUP_DIR%\*.sql" 2>nul | findstr /v "Directory" | head -5