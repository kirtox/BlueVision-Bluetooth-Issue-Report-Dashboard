#!/usr/bin/env python3
"""
資料庫遷移管理腳本
"""

import subprocess
import sys
import os

def run_command(command):
    """執行命令並顯示輸出"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 命令執行失敗: {e}")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return False

def create_initial_migration():
    """創建初始遷移"""
    print("🔄 創建初始遷移...")
    return run_command("alembic revision --autogenerate -m 'Initial migration'")

def create_user_migration():
    """創建 user 表更新遷移"""
    print("🔄 創建 user 表更新遷移...")
    return run_command("alembic revision --autogenerate -m 'Add role, created_at, is_active to user table'")

def upgrade_database():
    """升級資料庫到最新版本"""
    print("🔄 升級資料庫...")
    return run_command("alembic upgrade head")

def show_current_revision():
    """顯示當前資料庫版本"""
    print("📋 當前資料庫版本:")
    return run_command("alembic current")

def show_migration_history():
    """顯示遷移歷史"""
    print("📋 遷移歷史:")
    return run_command("alembic history")

def main():
    if len(sys.argv) < 2:
        print("使用方法:")
        print("  python manage_migrations.py init          # 創建初始遷移")
        print("  python manage_migrations.py user          # 創建 user 表更新遷移")
        print("  python manage_migrations.py upgrade       # 升級資料庫")
        print("  python manage_migrations.py current       # 顯示當前版本")
        print("  python manage_migrations.py history       # 顯示遷移歷史")
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
        print(f"❌ 未知命令: {command}")

if __name__ == "__main__":
    main()