# Alembic 資料庫遷移指南

## 概述

Alembic 是 SQLAlchemy 的資料庫遷移工具，用於管理資料庫結構的版本控制和變更。

## 核心概念

### 1. 遷移檔案結構

每個遷移檔案包含以下關鍵元素：

```python
# 版本識別資訊
revision = '001'          # 當前遷移的版本 ID
down_revision = None      # 上一個版本的 ID（None 表示第一個遷移）
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 資料庫升級操作
    pass

def downgrade() -> None:
    # 資料庫回滾操作
    pass
```

### 2. 版本追蹤機制

- Alembic 在資料庫中創建 `alembic_version` 表來追蹤當前版本
- 遷移檔案通過 `revision` 和 `down_revision` 形成版本鏈
- 檔案名稱只是為了可讀性，實際版本識別靠檔案內的 `revision` 變數

### 3. 遷移鏈範例

```
None → 001 → 002 → 003 → ...
```

## 工作流程

### 方法 1：自動生成（推薦）

```bash
# 1. 修改 app/models.py 添加/修改欄位
# 2. 自動生成遷移檔案
alembic revision --autogenerate -m "描述你的變更"

# 3. 檢查生成的遷移檔案內容
# 4. 執行遷移
alembic upgrade head
```

### 方法 2：手動創建

```bash
# 1. 創建空白遷移檔案
alembic revision -m "描述你的變更"

# 2. 手動編輯生成的檔案，添加 upgrade() 和 downgrade() 內容
# 3. 執行遷移
alembic upgrade head
```

## 常用命令

### 基本操作

```bash
# 查看當前版本
alembic current

# 查看遷移歷史
alembic history

# 升級到最新版本
alembic upgrade head

# 升級到特定版本
alembic upgrade 002

# 回滾到上一個版本
alembic downgrade -1

# 回滾到特定版本
alembic downgrade 001
```

### 遷移檔案管理

```bash
# 自動生成遷移（比較模型與資料庫差異）
alembic revision --autogenerate -m "Add user avatar field"

# 手動創建空白遷移
alembic revision -m "Custom migration"

# 查看 SQL 而不執行（乾跑）
alembic upgrade head --sql
```

## 實際範例

### 範例 1：添加新欄位

**1. 修改 models.py**
```python
class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    # 添加新欄位
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
```

**2. 生成遷移**
```bash
alembic revision --autogenerate -m "Add phone and email fields to user"
```

**3. 檢查生成的遷移檔案**
```python
def upgrade() -> None:
    op.add_column('user', sa.Column('phone', sa.String(20), nullable=True))
    op.add_column('user', sa.Column('email', sa.String(255), nullable=True))

def downgrade() -> None:
    op.drop_column('user', 'email')
    op.drop_column('user', 'phone')
```

**4. 執行遷移**
```bash
alembic upgrade head
```

### 範例 2：創建新表

**1. 修改 models.py**
```python
class Profile(Base):
    __tablename__ = "profile"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
```

**2. 生成並執行遷移**
```bash
alembic revision --autogenerate -m "Create profile table"
alembic upgrade head
```

### 範例 3：手動遷移

```python
"""Add index to username

Revision ID: 003
Revises: 002
"""
from alembic import op
import sqlalchemy as sa

revision = '003'
down_revision = '002'

def upgrade() -> None:
    # 創建索引
    op.create_index('idx_user_username', 'user', ['username'])
    
    # 添加約束
    op.create_unique_constraint('uq_user_email', 'user', ['email'])

def downgrade() -> None:
    # 移除約束
    op.drop_constraint('uq_user_email', 'user', type_='unique')
    
    # 移除索引
    op.drop_index('idx_user_username', 'user')
```

## 容器環境注意事項

### 資料庫連接設定

確保 `alembic.ini` 中的資料庫 URL 適用於容器環境：

```ini
# 容器內執行時使用服務名稱
sqlalchemy.url = postgresql://admin:password@db:5432/btird

# 宿主機執行時使用 localhost
# sqlalchemy.url = postgresql://admin:password@127.0.0.1:5433/btird
```

### 在容器中執行遷移

```bash
# 進入後端容器
podman exec -it $(podman ps -q --filter "name=backend") bash

# 在容器內執行遷移
alembic upgrade head
```

## 最佳實踐

### 1. 遷移檔案命名

- 使用描述性的訊息：`Add user avatar field`
- 避免過於簡短：`update user`
- 包含操作類型：`Create`, `Add`, `Remove`, `Modify`

### 2. 版本 ID 管理

- **推薦**：使用自動生成的唯一 ID
- **避免**：手動指定簡單數字（多人開發時容易衝突）

### 3. 遷移內容檢查

- 總是檢查自動生成的遷移內容
- 確認 `upgrade()` 和 `downgrade()` 操作正確
- 測試回滾操作是否能正確還原

### 4. 資料遷移

對於包含資料的遷移：

```python
def upgrade() -> None:
    # 1. 先添加欄位
    op.add_column('user', sa.Column('status', sa.String(20), nullable=True))
    
    # 2. 更新現有資料
    connection = op.get_bind()
    connection.execute(
        "UPDATE user SET status = 'active' WHERE is_active = 'Y'"
    )
    
    # 3. 設定欄位為非空（如果需要）
    op.alter_column('user', 'status', nullable=False)
```

## 故障排除

### 常見問題

1. **連接錯誤**
   - 檢查 `alembic.ini` 中的資料庫 URL
   - 確認資料庫服務正在運行

2. **版本衝突**
   - 使用 `alembic history` 查看版本鏈
   - 手動解決衝突的 `down_revision`

3. **遷移失敗**
   - 檢查 SQL 語法錯誤
   - 確認資料庫權限
   - 使用 `--sql` 參數預覽 SQL

### 緊急回滾

```bash
# 回滾到上一個版本
alembic downgrade -1

# 回滾到特定版本
alembic downgrade 001

# 查看回滾 SQL（不執行）
alembic downgrade -1 --sql
```

## 管理腳本

使用專案中的 `manage_migrations.py` 腳本：

```bash
# 創建遷移
python manage_migrations.py user

# 執行遷移
python manage_migrations.py upgrade

# 查看狀態
python manage_migrations.py current
python manage_migrations.py history
```

---

## 快速參考

| 操作 | 命令 |
|------|------|
| 自動生成遷移 | `alembic revision --autogenerate -m "message"` |
| 手動創建遷移 | `alembic revision -m "message"` |
| 執行遷移 | `alembic upgrade head` |
| 查看當前版本 | `alembic current` |
| 查看歷史 | `alembic history` |
| 回滾一個版本 | `alembic downgrade -1` |
| 預覽 SQL | `alembic upgrade head --sql` |

記住：修改模型後總是要生成並執行遷移！