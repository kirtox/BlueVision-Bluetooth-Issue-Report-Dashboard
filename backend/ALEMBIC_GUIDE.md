# Alembic Database Migration Complete Guide

## Overview

Alembic is SQLAlchemy's database migration tool for managing database schema version control and changes. This guide covers everything from initial setup to daily operations.

---

## Initial Setup

### 1. Dependencies

Added alembic to requirements.txt

### 2. Configuration Files

- `alembic.ini`: Alembic main configuration file
- `alembic/env.py`: Environment configuration, set to import app.models
- `alembic/script.py.mako`: Migration script template
- `alembic/versions/`: Migration script storage directory

### 3. Management Scripts

- `manage_migrations.py`: Migration management script
- `init_alembic.py`: Initialization script (backup)

### 4. First-Time Deployment

**For Dev Environment (Local PowerShell/CMD):**
```bash
cd c:\BlueVision\backend
$env:DATABASE_URL="postgresql://admin:password@localhost:5432/btird"
alembic upgrade head
```

**For Production (Container Environment):**

```bash
# Step 1: Rebuild container (install alembic)
podman-compose -f podman-compose.prod.yml down
podman-compose -f podman-compose.prod.yml up --build -d

# Step 2: Enter container
podman exec -it <backend_container_name> bash

# Step 3: Execute migration inside container
# Create initial migration (based on existing tables)
python manage_migrations.py init

# Upgrade database
python manage_migrations.py upgrade

# Check current version
python manage_migrations.py current
```

---

## Core Concepts

### 1. Migration File Structure

Each migration file contains the following key elements:

```python
# Version identification information
revision = '001'          # Current migration version ID
down_revision = None      # Previous version ID (None indicates first migration)
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Database upgrade operations
    pass

def downgrade() -> None:
    # Database rollback operations
    pass
```

### 2. Version Tracking Mechanism

- Alembic creates an `alembic_version` table in the database to track the current version
- Migration files form a version chain through `revision` and `down_revision`
- File names are only for readability; actual version identification relies on the `revision` variable within the file

### 3. Migration Chain Example

```
None → 001 → 002 → 003 → ...
```

### 4. Alembic Advantages

1. **Version Control**: Each database change has version record
2. **Rollback Capability**: Can rollback to previous versions
3. **Auto-generation**: Can automatically detect model changes and generate migration scripts
4. **Team Collaboration**: Migration scripts can be version controlled, team members can sync database structure
5. **Security**: Can preview SQL statements before execution

---

## Daily Workflow

### Method 1: Auto-generate (Recommended)

```bash
# 1. Modify app/models.py to add/modify fields
# 2. Auto-generate migration file
alembic revision --autogenerate -m "Describe your changes"

# 3. Check the generated migration file content
# 4. Execute migration
alembic upgrade head
```

### Method 2: Manual Creation

```bash
# 1. Create blank migration file
alembic revision -m "Describe your changes"

# 2. Manually edit the generated file, add upgrade() and downgrade() content
# 3. Execute migration
alembic upgrade head
```

---

## Common Commands

### Basic Operations

```bash
# View current version
alembic current

# View migration history
alembic history

# View detailed history
alembic history --verbose

# Upgrade to latest version
alembic upgrade head

# Upgrade to specific version
alembic upgrade <revision_id>

# Rollback one version
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>
```

### Migration File Management

```bash
# Auto-generate migration (compare model with database differences)
alembic revision --autogenerate -m "Add user avatar field"

# Manually create blank migration
alembic revision -m "Custom migration"

# View SQL without executing (dry run)
alembic upgrade head --sql
```

### Using Management Script

```bash
python manage_migrations.py init          # Create initial migration
python manage_migrations.py user          # Create user table update migration
python manage_migrations.py upgrade       # Upgrade database
python manage_migrations.py current       # Show current version
python manage_migrations.py history       # Show migration history
```

---

## Practical Examples

### Example 1: Adding New Fields

**1. Modify models.py**
```python
class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    # Add new fields
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
```

**2. Generate migration**
```bash
alembic revision --autogenerate -m "Add phone and email fields to user"
```

**3. Check generated migration file**
```python
def upgrade() -> None:
    op.add_column('user', sa.Column('phone', sa.String(20), nullable=True))
    op.add_column('user', sa.Column('email', sa.String(255), nullable=True))

def downgrade() -> None:
    op.drop_column('user', 'email')
    op.drop_column('user', 'phone')
```

**4. Execute migration**
```bash
alembic upgrade head
```

### Example 2: Creating New Table

**1. Modify models.py**
```python
class Profile(Base):
    __tablename__ = "profile"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
```

**2. Generate and execute migration**
```bash
alembic revision --autogenerate -m "Create profile table"
alembic upgrade head
```

### Example 3: Manual Migration (Index & Constraint)

```python
"""Add index to username

Revision ID: 003
Revises: 002
"""
from alembic import op
import sqlalchemy as sa

revision = '003'
down_revision = '002'

def upgrade() -> None:
    # Create index
    op.create_index('idx_user_username', 'user', ['username'])
    
    # Add constraint
    op.create_unique_constraint('uq_user_email', 'user', ['email'])

def downgrade() -> None:
    # Remove constraint
    op.drop_constraint('uq_user_email', 'user', type_='unique')
    
    # Remove index
    op.drop_index('idx_user_username', 'user')
```

### Example 4: Data Migration

For migrations involving data:

```python
def upgrade() -> None:
    # 1. First add field (nullable)
    op.add_column('user', sa.Column('status', sa.String(20), nullable=True))
    
    # 2. Update existing data
    connection = op.get_bind()
    connection.execute(
        "UPDATE user SET status = 'active' WHERE is_active = 'Y'"
    )
    
    # 3. Set field as non-null (if needed)
    op.alter_column('user', 'status', nullable=False)
```

---

## Container Environment

### Database Connection Configuration

Ensure the database URL in `alembic.ini` is suitable for your environment:

```ini
# Use service name when running inside container
sqlalchemy.url = postgresql://admin:password@db:5432/btird

# Use localhost when running on host machine
sqlalchemy.url = postgresql://admin:password@127.0.0.1:5433/btird
```

### Running Migrations in Container

```bash
# Enter backend container
podman exec -it $(podman ps -q --filter "name=backend") bash

# Or specify container name
podman exec -it <backend_container_name> bash

# Execute migration inside container
alembic upgrade head
```

---

## Best Practices

### 1. Migration File Naming

- ✅ Use descriptive messages: `Add user avatar field`
- ❌ Avoid being too brief: `update user`
- ✅ Include operation type: `Create`, `Add`, `Remove`, `Modify`

### 2. Version ID Management

- ✅ **Recommended**: Use auto-generated unique IDs
- ❌ **Avoid**: Manually specifying simple numbers (prone to conflicts in multi-developer environments)

### 3. Migration Content Review

- Always check auto-generated migration content
- Confirm `upgrade()` and `downgrade()` operations are correct
- Test if rollback operations can correctly restore

### 4. Development Process

1. Create new migration after each model modification
2. Add migration scripts to version control system
3. Test in test environment before deploying to production
4. Back up database before executing important migrations
5. Always preview SQL with `--sql` before executing critical migrations

---

## Troubleshooting

### Common Issues

#### 1. "Target database is not up to date" Error
```bash
# Mark current database state as latest
alembic stamp head
```

#### 2. Need to Reset Migration History
```bash
# Delete alembic_version table
# Recreate initial migration
python manage_migrations.py init
```

#### 3. Model Import Errors
Check if the model import path in `alembic/env.py` is correct.

#### 4. Connection Errors
- Check database URL in `alembic.ini`
- Confirm database service is running
- Verify credentials and permissions

#### 5. Version Conflicts
- Use `alembic history` to view version chain
- Manually resolve conflicting `down_revision`

#### 6. Migration Failures
- Check SQL syntax errors
- Confirm database permissions
- Use `--sql` parameter to preview SQL

### Emergency Rollback

```bash
# Rollback to previous version
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>

# View rollback SQL (without executing)
alembic downgrade -1 --sql
```

---

## Post-Migration Tasks

### Creating Administrator Account

After migration completion, create default administrator account:

```bash
python create_admin.py
```

Or through API:
```bash
curl -X POST "http://192.168.0.145:8001/users" \
-H "Content-Type: application/json" \
-d '{
  "username": "admin",
  "password": "admin123",
  "role": "Administrator"
}'
```

---

## Quick Reference

| Operation | Command |
|-----------|---------|
| Auto-generate migration | `alembic revision --autogenerate -m "message"` |
| Manually create migration | `alembic revision -m "message"` |
| Execute migration | `alembic upgrade head` |
| View current version | `alembic current` |
| View history | `alembic history` |
| View detailed history | `alembic history --verbose` |
| Rollback one version | `alembic downgrade -1` |
| Preview SQL | `alembic upgrade head --sql` |
| Mark current state | `alembic stamp head` |

### Management Script Quick Reference

| Operation | Command |
|-----------|---------|
| Create initial migration | `python manage_migrations.py init` |
| Create user migration | `python manage_migrations.py user` |
| Execute migration | `python manage_migrations.py upgrade` |
| View current version | `python manage_migrations.py current` |
| View history | `python manage_migrations.py history` |

---

**Remember**: Always generate and execute migrations after modifying models!
