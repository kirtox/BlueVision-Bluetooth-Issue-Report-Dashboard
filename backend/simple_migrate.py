#!/usr/bin/env python3
"""
簡單的 user 表遷移腳本
"""

from app.db import engine
import sqlalchemy as sa

def migrate_user_table():
    """為 user 表加入新欄位"""
    
    try:
        with engine.connect() as connection:
            # 檢查現有欄位
            result = connection.execute(sa.text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'user'
            """))
            existing_columns = [row[0] for row in result]
            print(f"現有欄位: {existing_columns}")
            
            # 加入 role 欄位
            if 'role' not in existing_columns:
                connection.execute(sa.text('ALTER TABLE "user" ADD COLUMN role VARCHAR DEFAULT \'User\' NOT NULL'))
                print("✅ 已加入 role 欄位")
            
            # 加入 created_at 欄位
            if 'created_at' not in existing_columns:
                connection.execute(sa.text('ALTER TABLE "user" ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'))
                print("✅ 已加入 created_at 欄位")
            
            # 加入 is_active 欄位
            if 'is_active' not in existing_columns:
                connection.execute(sa.text('ALTER TABLE "user" ADD COLUMN is_active VARCHAR DEFAULT \'Y\' NOT NULL'))
                print("✅ 已加入 is_active 欄位")
            
            connection.commit()
            print("🎉 遷移完成！")
            
    except Exception as e:
        print(f"❌ 遷移失敗: {e}")

if __name__ == "__main__":
    migrate_user_table()