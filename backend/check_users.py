#!/usr/bin/env python3
"""
Check user data in the database
"""

from app.db import SessionLocal
from app import crud, models

def check_users():
    db = SessionLocal()
    
    try:
        # Check if user table exists
        users = db.query(models.User).all()
        print(f"Total {len(users)} users in database:")
        
        for user in users:
            print(f"  - ID: {user.id}, Username: {user.username}, Role: {user.role}, Status: {user.is_active}")
        
        if len(users) == 0:
            print("❌ No user data in database")
            print("💡 Please run 'python create_admin.py' to create admin account")
        
        # Test specific user
        test_user = crud.get_user(db, "admin")
        if test_user:
            print(f"\n✅ Found admin user: {test_user.username} (Role: {test_user.role})")
        else:
            print("\n❌ Admin user not found")
            
    except Exception as e:
        print(f"❌ Error occurred while checking users: {e}")
        print("💡 Possible causes:")
        print("   1. Database connection failed")
        print("   2. User table does not exist")
        print("   3. Database migration not completed")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()