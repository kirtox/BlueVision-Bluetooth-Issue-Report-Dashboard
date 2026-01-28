@echo off
REM Database Restore Script for Development Environment
REM Usage: restore_db_dev.bat <backup_file>
REM Example: restore_db_dev.bat backup_20260127_163729.sql

setlocal enabledelayedexpansion

REM Check if backup file parameter is provided
if "%1"=="" (
    echo ❌ Error: Please provide backup file name
    echo Usage: %0 ^<backup_file^>
    echo Example: %0 backup_20260127_163729.sql
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

echo === Development Database Restore Process ===
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
for /f %%i in ('podman ps -q -f name=bluevision-db 2^>nul') do set DB_CONTAINER=%%i

if "%DB_CONTAINER%"=="" (
    echo ⚠️  Database container is not running, starting it now...
    podman-compose -f podman-compose.dev.yml up db -d
    if %errorlevel% neq 0 (
        echo ❌ Error: Failed to start database container
        exit /b 1
    )
    
    echo ⏳ Waiting for database to be ready...
    timeout /t 10 /nobreak > nul
    
    REM Get container ID again
    for /f %%i in ('podman ps -q -f name=bluevision-db 2^>nul') do set DB_CONTAINER=%%i
    
    if "%DB_CONTAINER%"=="" (
        echo ❌ Error: Could not find database container
        exit /b 1
    )
)

echo 📥 Restoring database from backup...
type "%BACKUP_PATH%" | podman exec -i %DB_CONTAINER% psql -U admin -d btird

if %errorlevel% equ 0 (
    echo ✅ Database restore completed successfully!
    echo.
    echo === Restore Summary ===
    echo ✅ Database restored from: %BACKUP_FILE%
    echo ✅ Development database is ready for use
    echo.
    echo You can now start debugging with VS Code (F5)
) else (
    echo ❌ Database restore failed!
    exit /b 1
)

echo.
echo Restore process completed at %date% %time%
