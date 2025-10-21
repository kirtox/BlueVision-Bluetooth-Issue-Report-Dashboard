# PTL Workshop 数据导入 - 简化指南

## 📁 唯一文件
现在只有一个文件：**`import_ptl_workshop.py`** - 包含所有功能的一体化脚本

## 🚀 使用方法

### 1. 交互式界面（最简单）
```bash
cd backend/app
python import_ptl_workshop.py
```
会显示菜单让你选择操作。

### 2. 命令行操作
```bash
cd backend/app

# 分析 Excel 文件结构
python import_ptl_workshop.py --analyze

# 测试导入（不写入数据库）
python import_ptl_workshop.py --dry-run

# 实际导入数据
python import_ptl_workshop.py --import

# 查看帮助
python import_ptl_workshop.py --help
```

## 📊 功能说明

1. **--analyze**: 分析 Excel 文件结构，显示找到的数据
2. **--dry-run**: 测试导入过程，不实际写入数据库
3. **--import**: 实际导入数据到数据库
4. **无参数**: 启动交互式菜单

## 📋 Excel 文件要求

- 文件放在：`backend/app/test_data/PTL_Workshop/`
- 格式：`.xlsx` 或 `.xls`
- 结构：A 列包含 "Database data"，下面是 key-value 对

## ✅ 测试结果

当前测试文件 `test_report_20251015_135924.xlsx`：
- ✅ 找到 "Database data" 区段（第 28 行）
- ✅ 提取 66 个 key-value 对
- ✅ 成功映射 **66 个字段**到 Report 模型（完整映射！）
- ✅ 统计 20 个 null/empty 值
- ✅ 包含所有设备栏位（headset, headset_brand, mouse, keyboard 等）
- ✅ 干跑测试通过

## 🔧 程式化使用

```python
from import_ptl_workshop import PTLWorkshopImporter

importer = PTLWorkshopImporter()

# 分析文件
importer.analyze_excel_files()

# 测试导入
successful, failed = importer.process_folder(dry_run=True)

# 实际导入
successful, failed = importer.process_folder(dry_run=False)
```

就这么简单！一个文件搞定所有功能。