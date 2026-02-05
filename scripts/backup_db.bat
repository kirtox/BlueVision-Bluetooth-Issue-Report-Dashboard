@echo off
REM Manual Database Backup Script for Windows
REM This script creates an immediate backup of the PostgreSQL database
REM Usage: backup_db.bat [optional_suffix]
REM Example: backup_db.bat pre_migration

setlocal

REM Set directories
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "BACKUP_DIR=%PROJECT_ROOT%\db_backups"

REM Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Generate timestamp using PowerShell
for /f "tokens=*" %%a in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set "TIMESTAMP=%%a"

REM Set backup filename with optional suffix
if "%~1"=="" (
    set "BACKUP_FILE=manual_backup_%TIMESTAMP%.sql"
) else (
    set "BACKUP_FILE=manual_backup_%~1_%TIMESTAMP%.sql"
)

set "BACKUP_PATH=%BACKUP_DIR%\%BACKUP_FILE%"

echo === Manual Database Backup ===
echo Timestamp: %date% %time%
echo Backup file: %BACKUP_FILE%
echo Full path: %BACKUP_PATH%
echo.

REM Check if production database container is running
echo Checking database container...
podman ps --filter name=bluevision_prod_db_1 -q > "%TEMP%\db_check.txt" 2>&1
set /p DB_CONTAINER=<"%TEMP%\db_check.txt"
del "%TEMP%\db_check.txt" 2>nul

if "%DB_CONTAINER%"=="" (
    echo.
    echo Error: Production database container bluevision_prod_db_1 is not running
    echo Please start the database service first with:
    echo   podman-compose -f podman-compose.prod.yml up -d db
    exit /b 1
)

echo Container ID: %DB_CONTAINER%
echo Creating database backup...
echo.

REM Create the backup
podman exec %DB_CONTAINER% pg_dump -U admin btird > "%BACKUP_PATH%" 2>&1

REM Check if backup file was created and has content
if exist "%BACKUP_PATH%" (
    for %%A in ("%BACKUP_PATH%") do set "SIZE=%%~zA"
    if defined SIZE (
        if not "%SIZE%"=="0" (
            echo.
            echo === Backup Completed Successfully ===
            echo File: %BACKUP_FILE%
            echo Size: %SIZE% bytes
            echo Location: %BACKUP_PATH%
            echo.
            echo === Recent Backups ===
            dir /o-d /b "%BACKUP_DIR%\*.sql" 2>nul | findstr /n "^" | findstr "^[1-5]:"
            exit /b 0
        ) else (
            echo.
            echo Error: Backup file created but is empty
            del "%BACKUP_PATH%" 2>nul
            exit /b 1
        )
    )
) else (
    echo.
    echo Error: Backup file was not created
    exit /b 1
)
