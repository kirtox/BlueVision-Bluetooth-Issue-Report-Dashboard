#!/usr/bin/env python3
"""
創建預設管理員帳號的腳本
"""

from app.db import SessionLocal
from app import crud
from app.schema_user import UserCreate

def create_default_admin():
    db = SessionLocal()
    
    # 檢查是否已經有管理員帳號
    admin_user = crud.get_user(db, "admin")
    if admin_user:
        print("管理員帳號已存在")
        db.close()
        return
    
    # 創建預設管理員帳號
    password = "admin123"  # 請在生產環境中更改此密碼
    
    # 確保密碼不超過 72 字節（bcrypt 限制）
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        print("⚠️  密碼已截斷至 72 字節")
    
    admin_data = UserCreate(
        username="admin",
        password=password,
        role="Administrator"
    )
    
    try:
        new_admin = crud.create_user(db, admin_data)
        print(f"✅ 成功創建管理員帳號: {new_admin.username}")
        print(f"📋 預設密碼: {password}")
        print("⚠️  請記得在生產環境中更改密碼！")
        print(f"🔑 權限等級: {new_admin.role}")
    except Exception as e:
        print(f"❌ 創建管理員帳號失敗: {e}")
        print("💡 可能的解決方案:")
        print("   1. 檢查資料庫連接")
        print("   2. 確認 user 表已存在")
        print("   3. 檢查用戶名是否已被使用")
    finally:
        db.close()

if __name__ == "__main__":
    create_default_admin()