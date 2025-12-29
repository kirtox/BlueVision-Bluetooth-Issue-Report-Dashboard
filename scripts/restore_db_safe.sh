#!/bin/bash

# 安全資料庫復原腳本（重建資料庫）
# 使用方式: ./scripts/restore_db_safe.sh backup_20241229_000000.sql

if [ $# -eq 0 ]; then
    echo "錯誤: 請提供備份檔案名稱"
    echo "使用方式: $0 <backup_file>"
    echo "範例: $0 backup_20241229_000000.sql"
    exit 1
fi

BACKUP_FILE="$1"
BACKUP_PATH="./db_backups/$BACKUP_FILE"

# 檢查備份檔案是否存在
if [ ! -f "$BACKUP_PATH" ]; then
    echo "錯誤: 備份檔案不存在: $BACKUP_PATH"
    exit 1
fi

echo "準備安全復原資料庫..."
echo "備份檔案: $BACKUP_PATH"
echo "⚠️  警告: 這將會完全重建資料庫！"
read -p "確定要繼續嗎? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "復原已取消"
    exit 1
fi

echo "正在安全復原資料庫..."

# 停止所有服務
echo "停止所有服務..."
podman-compose -f podman-compose.prod.yml down

# 刪除資料庫 volume（完全清除）
echo "清除舊資料庫..."
podman volume rm btird_pgdata_prod 2>/dev/null || true

# 重新啟動資料庫服務
echo "重新建立資料庫..."
podman-compose -f podman-compose.prod.yml up -d db

# 等待資料庫啟動
echo "等待資料庫啟動..."
sleep 10

# 復原資料
echo "復原資料..."
podman exec -i $(podman ps -q -f name=db) psql -U admin -d btird < "$BACKUP_PATH"

if [ $? -eq 0 ]; then
    echo "✅ 資料庫安全復原成功！"
    echo "啟動所有服務..."
    podman-compose -f podman-compose.prod.yml up -d
else
    echo "❌ 資料庫復原失敗！"
    exit 1
fi