# Database Backup and Restore Guide

This guide covers the complete database backup and restore system for the BTIRD project.

## Overview

The system provides two types of backup solutions:
- **Primary Backup**: Automated daily backups via Docker service
- **Auxiliary Backup**: Manual on-demand backups via scripts

## Primary Backup System (Automated)

### How It Works

The primary backup system runs as a Docker service that:
1. Executes daily at container startup time
2. Creates timestamped backup files
3. Automatically cleans up old backups (7+ days)
4. Runs continuously alongside your application

### Configuration

The backup service is defined in `podman-compose.prod.yml`:

```yaml
db-backup:
  image: postgres:15
  depends_on:
    db:
      condition: service_healthy
  volumes:
    - ./db_backups:/backups
  environment:
    - PGPASSWORD=password
    - TZ=Asia/Taipei
  networks:
    - app-network
  command: |
    sh -c '
    echo "Database backup service started at $$(date)"
    while true; do
      echo "Starting backup at $$(date)"
      pg_dump -h db -U admin -d btird > /backups/backup_$$(date +%Y%m%d_%H%M%S).sql
      if [ $$? -eq 0 ]; then
        echo "Backup completed successfully at $$(date)"
      else
        echo "Backup failed at $$(date)"
      fi
      echo "Cleaning up old backups (older than 7 days)"
      find /backups -name "backup_*.sql" -mtime +7 -delete
      echo "Next backup scheduled in 24 hours"
      sleep 86400
    done'
  restart: unless-stopped
```

### Backup File Naming

Primary backups use the format: `backup_YYYYMMDD_HHMMSS.sql`

Example: `backup_20241229_143022.sql`

### Starting the Backup Service

```bash
# Start all services including backup
podman-compose -f podman-compose.prod.yml up -d

# Check backup service logs
podman logs btird-db-backup-1 -f
```

## Auxiliary Backup System (Manual)

### Linux/macOS Script

**File**: `scripts/backup_db.sh`

**Usage**:
```bash
# Basic backup
./scripts/backup_db.sh

# Backup with custom suffix
./scripts/backup_db.sh pre_migration
```

**Features**:
- Creates immediate backup
- Validates container status
- Shows backup size and location
- Lists recent backups

### Windows Script

**File**: `scripts/backup_db.bat`

**Usage**:
```cmd
REM Basic backup
scripts\backup_db.bat

REM Backup with custom suffix
scripts\backup_db.bat pre_migration
```

**Features**:
- Same functionality as Linux version
- Windows-compatible commands
- Proper error handling

### Backup File Naming

Manual backups use the format: `manual_backup_[suffix_]YYYYMMDD_HHMMSS.sql`

Examples:
- `manual_backup_20241229_143022.sql`
- `manual_backup_pre_migration_20241229_143022.sql`

## Database Restore System

### Quick Restore (Windows)

**File**: `scripts/restore_db.bat`

**Usage**:
```cmd
scripts\restore_db.bat backup_20241229_143022.sql
```

**Process**:
1. Validates backup file exists
2. Shows file information
3. Requests user confirmation
4. Stops backend service
5. Restores database
6. Restarts backend service

### Safe Restore (Windows)

**File**: `scripts/restore_db_safe.bat`

**Usage**:
```cmd
scripts\restore_db_safe.bat backup_20241229_143022.sql
```

**Process**:
1. Validates backup file exists
2. Shows file information
3. Requests user confirmation
4. Stops all services
5. Removes database volume completely
6. Creates fresh database
7. Restores data from backup
8. Starts all services

### Linux/macOS Restore

**Files**: `scripts/restore_db.sh`, `scripts/restore_db_safe.sh`

Same functionality as Windows versions but with bash syntax.

## File Structure

```
BTIRD/
├── db_backups/                     # Backup storage directory
│   ├── backup_20241229_000000.sql  # Automated daily backup
│   ├── backup_20241230_000000.sql  # Automated daily backup
│   └── manual_backup_20241229_143022.sql  # Manual backup
├── scripts/
│   ├── backup_db.sh               # Linux manual backup
│   ├── backup_db.bat              # Windows manual backup
│   ├── restore_db.sh              # Linux quick restore
│   ├── restore_db.bat             # Windows quick restore
│   ├── restore_db_safe.sh         # Linux safe restore
│   └── restore_db_safe.bat        # Windows safe restore
└── podman-compose.prod.yml        # Contains backup service config
```

## Best Practices

### Backup Strategy

1. **Regular Monitoring**: Check backup service logs regularly
2. **Test Restores**: Periodically test restore procedures
3. **Manual Backups**: Create manual backups before major changes
4. **Storage Management**: Monitor disk space in `db_backups/` directory

### When to Use Each Restore Method

| Scenario | Recommended Method |
|----------|-------------------|
| Data corruption | Quick Restore |
| System issues | Safe Restore |
| Migration rollback | Quick Restore |
| Complete system rebuild | Safe Restore |

### Security Considerations

1. **Backup Files**: Contain sensitive data, secure appropriately
2. **Access Control**: Limit access to backup directory
3. **Network Security**: Backups occur within Docker network
4. **Retention Policy**: Automatic cleanup after 7 days

## Troubleshooting

### Common Issues

**Backup Service Not Running**:
```bash
# Check service status
podman-compose -f podman-compose.prod.yml ps

# View logs
podman logs btird-db-backup-1
```

**Manual Backup Fails**:
```bash
# Check database container
podman ps -f name=db

# Check database connectivity
podman exec btird-db-1 pg_isready -U admin -d btird
```

**Restore Fails**:
1. Verify backup file integrity
2. Check database container status
3. Ensure sufficient disk space
4. Review error messages in logs

### Log Locations

- **Backup Service**: `podman logs btird-db-backup-1`
- **Database**: `podman logs btird-db-1`
- **Backend**: `podman logs btird-backend-1`

## Monitoring and Maintenance

### Daily Checks

1. Verify backup service is running
2. Check latest backup file exists
3. Monitor disk space usage

### Weekly Checks

1. Test manual backup creation
2. Verify backup file integrity
3. Review backup retention policy

### Monthly Checks

1. Perform test restore on development environment
2. Review and update backup procedures
3. Check system performance impact

## Advanced Configuration

### Customizing Backup Frequency

Edit the `sleep 86400` value in `podman-compose.prod.yml`:
- `43200` = 12 hours
- `21600` = 6 hours
- `3600` = 1 hour

### Customizing Retention Policy

Edit the `find` command in `podman-compose.prod.yml`:
- `-mtime +7` = 7 days
- `-mtime +14` = 14 days
- `-mtime +30` = 30 days

### Adding Compression

Modify backup command to include compression:
```bash
pg_dump -h db -U admin -d btird | gzip > /backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

## Support

For issues or questions regarding the backup system:
1. Check this documentation
2. Review service logs
3. Verify system requirements
4. Test with manual backup first