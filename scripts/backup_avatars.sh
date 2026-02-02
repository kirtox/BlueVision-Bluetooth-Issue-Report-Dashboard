#!/bin/bash

# Avatar Backup Script
# This script creates a backup of all avatar files from the backend container
# Usage: ./scripts/backup_avatars.sh [optional_suffix]
# Example: ./scripts/backup_avatars.sh pre_cleanup

# Set script directory and backup directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/avatar_backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Set backup filename with optional suffix
if [ -n "$1" ]; then
    BACKUP_FILE="avatars_${1}_${TIMESTAMP}"
else
    BACKUP_FILE="avatars_${TIMESTAMP}"
fi

BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

echo "=== Avatar Files Backup ==="
echo "Timestamp: $(date)"
echo "Backup name: $BACKUP_FILE"
echo "Full path: $BACKUP_PATH"
echo

# Check if backend container is running
BACKEND_CONTAINER=$(podman ps -q -f name=backend)
if [ -z "$BACKEND_CONTAINER" ]; then
    echo "❌ Error: Backend container is not running"
    echo "Please start the backend service first:"
    echo "podman-compose -f podman-compose.prod.yml up -d backend"
    exit 1
fi

echo "📦 Creating avatar backup..."

# Create temporary tar archive in container
podman exec "$BACKEND_CONTAINER" tar -czf /tmp/avatars_backup.tar.gz -C /app uploads 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: No avatar files found or error creating archive"
    echo "This is normal if no users have uploaded avatars yet"
    exit 0
fi

# Copy tar file from container to host
podman cp "$BACKEND_CONTAINER:/tmp/avatars_backup.tar.gz" "$BACKUP_PATH.tar.gz"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to copy backup from container"
    exit 1
fi

# Clean up temporary file in container
podman exec "$BACKEND_CONTAINER" rm -f /tmp/avatars_backup.tar.gz

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_PATH.tar.gz" | cut -f1)

echo "✅ Avatar backup completed successfully!"
echo
echo "=== Backup Summary ==="
echo "Backup file: $BACKUP_FILE.tar.gz"
echo "File size: $BACKUP_SIZE"
echo "Location: $BACKUP_PATH.tar.gz"
echo "Timestamp: $(date)"
echo
echo "To restore this backup, use:"
echo "  ./scripts/restore_avatars.sh $BACKUP_FILE.tar.gz"

# Optional: Clean up old backups (older than 30 days)
echo
echo "🧹 Cleaning up old avatar backups (older than 30 days)..."
find "$BACKUP_DIR" -name "avatars_*.tar.gz" -mtime +30 -delete
echo "✅ Old backups cleaned up"

echo
echo "Backup process completed at $(date)"
