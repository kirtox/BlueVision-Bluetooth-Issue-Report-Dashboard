#!/usr/bin/env python3
"""
手動遷移 user 表，加入新欄位
"""

from app.db import engine
from sqlalchemy import text

def migrate_user_table():
    """為 user 表加入新欄位"""
    
    migration_sql = """
    -- 檢查並加入 role 欄位
    DO $$ 
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='user' AND column_name='role') THEN
            ALTER TABLE "user" ADD COLUMN role VARCHAR DEFAULT 'User' NOT NULL;
        END IF;
    END $$;

    -- 檢查並加入 created_at 欄位
    DO $$ 
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='user' AND column_name='created_at') THEN
            ALTER TABLE "user" ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
    END $$;

    -- 檢查並加入 is_active 欄位
    DO $$ 
    BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='user' AND column_name='is_active') THEN
            ALTER TABLE "user" ADD COLUMN is_active VARCHAR DEFAULT 'Y' NOT NULL;
        END IF;
    END $$;
    """
    
    try:
        with engine.connect() as connection:
            # 分別執行每個 DO 塊
            statements = migration_sql.strip().split('END $$;')
            for statement in statements:
                if statement.strip():
                    full_statement = statement.strip() + ' END $$;'
                    if 'DO $$' in full_statement:
                        connection.execute(text(full_statement))
                        connection.commit()
        
        print("✅ User 表遷移成功！")
        print("新增欄位:")
        print("  - role (VARCHAR, 預設: 'User')")
        print("  - created_at (TIMESTAMP, 預設: 當前時間)")
        print("  - is_active (VARCHAR, 預設: 'Y')")
        
    except Exception as e:
        print(f"❌ 遷移失敗: {e}")

if __name__ == "__main__":
    migrate_user_table()