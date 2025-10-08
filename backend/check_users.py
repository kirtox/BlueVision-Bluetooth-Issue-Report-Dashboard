#!/usr/bin/env python3
"""
檢查資料庫中的使用者資料
"""

from app.db import SessionLocal
from app import crud, models

def check_users():
    db = SessionLocal()
    
    try:
        # 檢查使用者表是否存在
        users = db.query(models.User).all()
        print(f"資料庫中共有 {len(users)} 個使用者:")
        
        for user in users:
            print(f"  - ID: {user.id}, 使用者名稱: {user.username}, 角色: {user.role}, 狀態: {user.is_active}")
        
        if len(users) == 0:
            print("❌ 資料庫中沒有使用者資料")
            print("💡 請執行 'python create_admin.py' 來建立管理員帳號")
        
        # 測試特定使用者
        test_user = crud.get_user(db, "admin")
        if test_user:
            print(f"\n✅ 找到 admin 使用者: {test_user.username} (角色: {test_user.role})")
        else:
            print("\n❌ 找不到 admin 使用者")
            
    except Exception as e:
        print(f"❌ 檢查使用者時發生錯誤: {e}")
        print("💡 可能的原因:")
        print("   1. 資料庫連接失敗")
        print("   2. user 表不存在")
        print("   3. 資料庫遷移未完成")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()