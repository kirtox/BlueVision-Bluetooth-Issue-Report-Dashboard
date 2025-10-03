#!/usr/bin/env python3
"""
簡化版創建管理員帳號腳本
"""

import sys
import os

# 添加當前目錄到 Python 路徑
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_admin_simple():
    try:
        from app.db import SessionLocal
        from app import models
        from app.utils import get_password_hash
        import datetime
        
        db = SessionLocal()
        
        # 檢查是否已經有管理員帳號
        existing_admin = db.query(models.User).filter(models.User.username == "admin").first()
        if existing_admin:
            print("✅ 管理員帳號已存在")
            print(f"📋 用戶名: {existing_admin.username}")
            print(f"🔑 權限: {existing_admin.role}")
            db.close()
            return
        
        # 創建管理員帳號
        password = "admin123"
        hashed_password = get_password_hash(password)
        
        admin_user = models.User(
            username="admin",
            hashed_password=hashed_password,
            role="Administrator",
            created_at=datetime.datetime.utcnow(),
            is_active="Y"
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ 成功創建管理員帳號!")
        print(f"📋 用戶名: {admin_user.username}")
        print(f"🔑 密碼: {password}")
        print(f"👑 權限: {admin_user.role}")
        print(f"📅 創建時間: {admin_user.created_at}")
        print("⚠️  請記得在生產環境中更改密碼！")
        
        db.close()
        
    except Exception as e:
        print(f"❌ 創建失敗: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_admin_simple()