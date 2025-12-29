#!/bin/bash

# Manual Database Backup Script
# This script creates an immediate backup of the PostgreSQL database
# Usage: ./scripts/backup_db.sh [optional_suffix]
# Example: ./scripts/backup_db.sh pre_migration

# Set script directory and backup directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/db_backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Set backup filename with optional suffix
if [ -n "$1" ]; then
    BACKUP_FILE="manual_backup_${1}_${TIMESTAMP}.sql"
else
    BACKUP_FILE="manual_backup_${TIMESTAMP}.sql"
fi

BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

echo "=== Manual Database Backup ==="
echo "Timestamp: $(date)"
echo "Backup file: $BACKUP_FILE"
echo "Full path: $BACKUP_PATH"
echo

# Check if database container is running
DB_CONTAINER=$(podman ps -q -f name=db)
if [ -z "$DB_CONTAINER" ]; then
    echo "❌ Error: Database container is not running"
    echo "Please start the database service first:"
    echo "podman-compose -f podman-compose.prod.yml up -d db"
    exit 1
fi

echo "📦 Creating database backup..."

# Create the backup
podman exec "$DB_CONTAINER" pg_dump -U admin btird > "$BACKUP_PATH"

# Check if backup was successful
if [ $? -eq 0 ] && [ -s "$BACKUP_PATH" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    echo "✅ Backup completed successfully!"
    echo "📁 File: $BACKUP_FILE"
    echo "📊 Size: $BACKUP_SIZE"
    echo "📍 Location: $BACKUP_PATH"
else
    echo "❌ Backup failed!"
    # Remove empty or failed backup file
    [ -f "$BACKUP_PATH" ] && rm "$BACKUP_PATH"
    exit 1
fi

echo
echo "=== Backup Summary ==="
echo "Total backups in directory:"
ls -la "$BACKUP_DIR"/*.sql 2>/dev/null | wc -l
echo
echo "Recent backups:"
ls -lt "$BACKUP_DIR"/*.sql 2>/dev/null | head -5