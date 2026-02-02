#!/bin/bash

# Avatar Restore Script
# This script restores avatar files from a backup to the backend container
# Usage: ./scripts/restore_avatars.sh <backup_file>
# Example: ./scripts/restore_avatars.sh avatars_20260202_120000.tar.gz

# Set script directory and backup directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/avatar_backups"

# Check if backup file parameter is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide backup file name"
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 avatars_20260202_120000.tar.gz"
    echo
    echo "Available avatar backup files:"
    ls -1 "$BACKUP_DIR"/avatars_*.tar.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

# Check if backup file exists
if [ ! -f "$BACKUP_PATH" ]; then
    echo "❌ Error: Backup file does not exist: $BACKUP_PATH"
    echo
    echo "Available avatar backup files:"
    ls -1 "$BACKUP_DIR"/avatars_*.tar.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

# Display file information
BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
BACKUP_DATE=$(stat -c %y "$BACKUP_PATH" 2>/dev/null || stat -f "%Sm" "$BACKUP_PATH")

echo "=== Avatar Files Restore Process ==="
echo "Backup file: $BACKUP_FILE"
echo "File path: $BACKUP_PATH"
echo "File size: $BACKUP_SIZE"
echo "File date: $BACKUP_DATE"
echo
echo "⚠️  WARNING: This will overwrite existing avatar files!"
echo "Current avatars will be replaced with backup data."
echo

# Confirmation prompt
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Restore operation cancelled"
    exit 0
fi

echo
echo "🔄 Starting avatar restore process..."

# Check if backend container is running
BACKEND_CONTAINER=$(podman ps -q -f name=backend)
if [ -z "$BACKEND_CONTAINER" ]; then
    echo "❌ Error: Backend container is not running"
    echo "Please start the backend service first:"
    echo "podman-compose -f podman-compose.prod.yml up -d backend"
    exit 1
fi

# Copy backup file to container
echo "📤 Copying backup file to container..."
podman cp "$BACKUP_PATH" "$BACKEND_CONTAINER:/tmp/avatars_restore.tar.gz"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to copy backup file to container"
    exit 1
fi

# Create backup of current avatars (just in case)
echo "💾 Creating safety backup of current avatars..."
podman exec "$BACKEND_CONTAINER" tar -czf /tmp/avatars_pre_restore_backup.tar.gz -C /app uploads 2>/dev/null

# Extract backup in container
echo "📦 Extracting avatar files..."
podman exec "$BACKEND_CONTAINER" sh -c "cd /app && tar -xzf /tmp/avatars_restore.tar.gz"

if [ $? -eq 0 ]; then
    echo "✅ Avatar restore completed successfully!"
    
    # Clean up temporary files
    echo "🧹 Cleaning up temporary files..."
    podman exec "$BACKEND_CONTAINER" rm -f /tmp/avatars_restore.tar.gz
    
    echo
    echo "=== Restore Summary ==="
    echo "✅ Avatars restored from: $BACKUP_FILE"
    echo "✅ System is ready for use"
    echo
    echo "A safety backup was created at: /tmp/avatars_pre_restore_backup.tar.gz"
    echo "You can remove it with: podman exec $BACKEND_CONTAINER rm /tmp/avatars_pre_restore_backup.tar.gz"
else
    echo "❌ Avatar restore failed!"
    echo "🔄 Attempting to restore from safety backup..."
    podman exec "$BACKEND_CONTAINER" sh -c "cd /app && tar -xzf /tmp/avatars_pre_restore_backup.tar.gz"
    if [ $? -eq 0 ]; then
        echo "✅ Successfully restored from safety backup"
    else
        echo "❌ Failed to restore from safety backup"
    fi
    exit 1
fi

echo
echo "Restore process completed at $(date)"
