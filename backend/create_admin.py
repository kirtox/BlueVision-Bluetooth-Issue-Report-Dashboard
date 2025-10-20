#!/usr/bin/env python3
"""
Script to create default administrator account
"""

from app.db import SessionLocal
from app import crud
from app.schema_user import UserCreate

def create_default_admin():
    db = SessionLocal()
    
    # Check if admin account already exists
    admin_user = crud.get_user(db, "admin")
    if admin_user:
        print("Admin account already exists")
        db.close()
        return
    
    # Create default admin account
    password = "intel123"  # Please change this password in production environment
    
    # Ensure password doesn't exceed 72 bytes (bcrypt limitation)
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        print("⚠️  Password truncated to 72 bytes")
    
    admin_data = UserCreate(
        username="admin",
        password=password,
        role="Administrator",
        email="intel123@intel.com"
    )
    
    try:
        new_admin = crud.create_user(db, admin_data)
        print(f"✅ Successfully created admin account: {new_admin.username}")
        print(f"📋 Default password: {password}")
        print("⚠️  Please remember to change password in production environment!")
        print(f"🔑 Permission level: {new_admin.role}")
    except Exception as e:
        print(f"❌ Failed to create admin account: {e}")
        print("💡 Possible solutions:")
        print("   1. Check database connection")
        print("   2. Confirm user table exists")
        print("   3. Check if username is already in use")
    finally:
        db.close()

if __name__ == "__main__":
    create_default_admin()