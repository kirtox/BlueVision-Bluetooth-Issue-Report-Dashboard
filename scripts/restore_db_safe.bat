@echo off
REM Safe Database Restore Script for Windows (Complete Rebuild)
REM This script performs a complete database rebuild and restore
REM Usage: restore_db_safe.bat <backup_file>
REM Example: restore_db_safe.bat backup_20241229_000000.sql

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

echo === Safe Database Restore Process (Complete Rebuild) ===
echo Backup file: %BACKUP_FILE%
echo File path: %BACKUP_PATH%
echo File size: %FILE_SIZE% bytes
echo File date: %FILE_DATE%
echo.
echo ⚠️  CRITICAL WARNING: This will completely rebuild the database!
echo - All services will be stopped
echo - Database volume will be deleted
echo - Fresh database will be created
echo - Data will be restored from backup
echo.

REM Confirmation prompt
set /p "confirm=Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Safe restore operation cancelled
    exit /b 0
)

echo.
echo 🔄 Starting safe database restore process...

REM Stop all services
echo 📴 Stopping all services...
podman-compose -f podman-compose.prod.yml down
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Error stopping services, continuing anyway...
)

REM Remove database volume (complete cleanup)
echo 🗑️  Removing old database volume...
podman volume rm btird_pgdata_prod 2>nul
if %errorlevel% equ 0 (
    echo ✅ Old database volume removed successfully
) else (
    echo ℹ️  Database volume was not found or already removed
)

REM Start database service only
echo 🚀 Starting fresh database service...
podman-compose -f podman-compose.prod.yml up -d db
if %errorlevel% neq 0 (
    echo ❌ Failed to start database service!
    exit /b 1
)

REM Wait for database to be ready
echo ⏳ Waiting for database to initialize...
timeout /t 15 /nobreak >nul

REM Check if database is ready
echo 🔍 Checking database readiness...
set "DB_READY=false"
for /l %%i in (1,1,30) do (
    podman exec btird-db-1 pg_isready -U admin -d btird >nul 2>&1
    if !errorlevel! equ 0 (
        set "DB_READY=true"
        goto :db_ready
    )
    echo Waiting for database... attempt %%i/30
    timeout /t 2 /nobreak >nul
)

:db_ready
if "%DB_READY%"=="false" (
    echo ❌ Database failed to become ready within timeout!
    echo Cleaning up...
    podman-compose -f podman-compose.prod.yml down
    exit /b 1
)

echo ✅ Database is ready!

REM Get database container ID
for /f %%i in ('podman ps -q -f name=db') do set DB_CONTAINER=%%i

if "%DB_CONTAINER%"=="" (
    echo ❌ Error: Could not find database container!
    exit /b 1
)

REM Restore database
echo 📥 Restoring database from backup...
podman exec -i %DB_CONTAINER% psql -U admin -d btird < "%BACKUP_PATH%"

if %errorlevel% equ 0 (
    echo ✅ Database restore completed successfully!
    echo 🚀 Starting all services...
    podman-compose -f podman-compose.prod.yml up -d
    if %errorlevel% equ 0 (
        echo ✅ All services started successfully!
        echo.
        echo === Safe Restore Summary ===
        echo ✅ Database completely rebuilt
        echo ✅ Data restored from: %BACKUP_FILE%
        echo ✅ All services running
        echo ✅ System is ready for use
    ) else (
        echo ⚠️  Warning: Some services failed to start
        echo Please check service status: podman-compose -f podman-compose.prod.yml ps
    )
) else (
    echo ❌ Database restore failed!
    echo 🚀 Attempting to start services anyway...
    podman-compose -f podman-compose.prod.yml up -d
    exit /b 1
)

echo.
echo Safe restore process completed at %date% %time%