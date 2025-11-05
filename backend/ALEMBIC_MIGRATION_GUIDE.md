# Alembic Database Migration Guide

## Overview

Alembic is SQLAlchemy's database migration tool for managing database schema version control and changes.

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

## Workflow

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

## Common Commands

### Basic Operations

```bash
# View current version
alembic current

# View migration history
alembic history

# Upgrade to latest version
alembic upgrade head

# Upgrade to specific version
alembic upgrade 002

# Rollback to previous version
alembic downgrade -1

# Rollback to specific version
alembic downgrade 001
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

### Example 3: Manual Migration

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

## Container Environment Considerations

### Database Connection Configuration

Ensure the database URL in `alembic.ini` is suitable for container environment:

```ini
# Use service name when running inside container
sqlalchemy.url = postgresql://admin:password@db:5432/btird

# Use localhost when running on host machine
# sqlalchemy.url = postgresql://admin:password@127.0.0.1:5433/btird
```

### Running Migrations in Container

```bash
# Enter backend container
podman exec -it $(podman ps -q --filter "name=backend") bash

# Execute migration inside container
alembic upgrade head
```

## Best Practices

### 1. Migration File Naming

- Use descriptive messages: `Add user avatar field`
- Avoid being too brief: `update user`
- Include operation type: `Create`, `Add`, `Remove`, `Modify`

### 2. Version ID Management

- **Recommended**: Use auto-generated unique IDs
- **Avoid**: Manually specifying simple numbers (prone to conflicts in multi-developer environments)

### 3. Migration Content Review

- Always check auto-generated migration content
- Confirm `upgrade()` and `downgrade()` operations are correct
- Test if rollback operations can correctly restore

### 4. Data Migration

For migrations involving data:

```python
def upgrade() -> None:
    # 1. First add field
    op.add_column('user', sa.Column('status', sa.String(20), nullable=True))
    
    # 2. Update existing data
    connection = op.get_bind()
    connection.execute(
        "UPDATE user SET status = 'active' WHERE is_active = 'Y'"
    )
    
    # 3. Set field as non-null (if needed)
    op.alter_column('user', 'status', nullable=False)
```

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check database URL in `alembic.ini`
   - Confirm database service is running

2. **Version Conflicts**
   - Use `alembic history` to view version chain
   - Manually resolve conflicting `down_revision`

3. **Migration Failures**
   - Check SQL syntax errors
   - Confirm database permissions
   - Use `--sql` parameter to preview SQL

### Emergency Rollback

```bash
# Rollback to previous version
alembic downgrade -1

# Rollback to specific version
alembic downgrade 001

# View rollback SQL (without executing)
alembic downgrade -1 --sql
```

## Management Scripts

Use the `manage_migrations.py` script in the project:

```bash
# Create migration
python manage_migrations.py user

# Execute migration
python manage_migrations.py upgrade

# View status
python manage_migrations.py current
python manage_migrations.py history
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
| Rollback one version | `alembic downgrade -1` |
| Preview SQL | `alembic upgrade head --sql` |

Remember: Always generate and execute migrations after modifying models!