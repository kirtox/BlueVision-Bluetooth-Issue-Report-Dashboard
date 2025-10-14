#!/usr/bin/env python3
"""
Database migration management script
"""

import subprocess
import sys
import os

def run_command(command):
    """Execute command and display output"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Command execution failed: {e}")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return False

def create_initial_migration():
    """Create initial migration"""
    print("🔄 Creating initial migration...")
    return run_command("alembic revision --autogenerate -m 'Initial migration'")

def create_user_migration():
    """Create user table update migration"""
    print("🔄 Creating user table update migration...")
    return run_command("alembic revision --autogenerate -m 'Add role, created_at, is_active to user table'")

def upgrade_database():
    """Upgrade database to latest version"""
    print("🔄 Upgrading database...")
    return run_command("alembic upgrade head")

def show_current_revision():
    """Show current database version"""
    print("📋 Current database version:")
    return run_command("alembic current")

def show_migration_history():
    """Show migration history"""
    print("📋 Migration history:")
    return run_command("alembic history")

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python manage_migrations.py init          # Create initial migration")
        print("  python manage_migrations.py user          # Create user table update migration")
        print("  python manage_migrations.py upgrade       # Upgrade database")
        print("  python manage_migrations.py current       # Show current version")
        print("  python manage_migrations.py history       # Show migration history")
        return

    command = sys.argv[1]
    
    if command == "init":
        create_initial_migration()
    elif command == "user":
        create_user_migration()
    elif command == "upgrade":
        upgrade_database()
    elif command == "current":
        show_current_revision()
    elif command == "history":
        show_migration_history()
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main()