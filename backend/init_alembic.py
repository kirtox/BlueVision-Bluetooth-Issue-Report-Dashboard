#!/usr/bin/env python3
"""
初始化 Alembic 配置
"""

import os
import subprocess

def init_alembic():
    """初始化 Alembic"""
    try:
        # 初始化 Alembic
        subprocess.run(["alembic", "init", "alembic"], check=True)
        print("✅ Alembic 初始化成功！")
        
        print("\n接下來需要手動配置:")
        print("1. 編輯 alembic.ini 中的資料庫連接字串")
        print("2. 編輯 alembic/env.py 設定模型")
        print("3. 創建第一個遷移")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Alembic 初始化失敗: {e}")
    except FileNotFoundError:
        print("❌ 找不到 alembic 命令，請確認已安裝 alembic")

if __name__ == "__main__":
    init_alembic()