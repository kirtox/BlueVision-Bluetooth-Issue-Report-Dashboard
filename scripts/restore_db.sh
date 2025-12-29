#!/bin/bash

# 資料庫復原腳本
# 使用方式: ./scripts/restore_db.sh backup_20241229_000000.sql

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

echo "準備復原資料庫..."
echo "備份檔案: $BACKUP_PATH"
echo "⚠️  警告: 這將會覆蓋現有的資料庫資料！"
read -p "確定要繼續嗎? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "復原已取消"
    exit 1
fi

echo "正在復原資料庫..."

# 方法 1: 直接復原到現有資料庫
echo "停止相關服務..."
podman-compose -f podman-compose.prod.yml stop backend

echo "復原資料庫..."
podman exec -i $(podman ps -q -f name=db) psql -U admin -d btird < "$BACKUP_PATH"

if [ $? -eq 0 ]; then
    echo "✅ 資料庫復原成功！"
    echo "重新啟動服務..."
    podman-compose -f podman-compose.prod.yml start backend
else
    echo "❌ 資料庫復原失敗！"
    echo "重新啟動服務..."
    podman-compose -f podman-compose.prod.yml start backend
    exit 1
fi