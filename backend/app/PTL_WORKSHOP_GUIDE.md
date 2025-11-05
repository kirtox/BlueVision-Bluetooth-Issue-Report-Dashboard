# PTL Workshop Data Import - Simplified Guide

## 📁 Single File
Now there's only one file: **`import_ptl_workshop.py`** - an all-in-one script containing all functionality

## 🚀 Usage

### 1. Interactive Interface (Simplest)
```bash
cd backend/app
python import_ptl_workshop.py
```
Will display a menu for you to choose operations.

### 2. Command Line Operations
```bash
cd backend/app

# Analyze Excel file structure
python import_ptl_workshop.py --analyze

# Test import (don't write to database)
python import_ptl_workshop.py --dry-run

# Actually import data
python import_ptl_workshop.py --import

# View help
python import_ptl_workshop.py --help
```

## 📊 Feature Description

1. **--analyze**: Analyze Excel file structure, display found data
2. **--dry-run**: Test import process, don't actually write to database
3. **--import**: Actually import data to database
4. **No parameters**: Start interactive menu

## 📋 Excel File Requirements

- File location: `backend/app/test_data/PTL_Workshop/`
- Format: `.xlsx` or `.xls`
- Structure: Column A contains "Database data", followed by key-value pairs

## ✅ Test Results

Current test file `test_report_20251015_135924.xlsx`:
- ✅ Found "Database data" section (row 28)
- ✅ Extracted 66 key-value pairs
- ✅ Successfully mapped **66 fields** to Report model (complete mapping!)
- ✅ Counted 20 null/empty values
- ✅ Contains all device fields (headset, headset_brand, mouse, keyboard, etc.)
- ✅ Dry run test passed

## 🔧 Programmatic Usage

```python
from import_ptl_workshop import PTLWorkshopImporter

importer = PTLWorkshopImporter()

# Analyze files
importer.analyze_excel_files()

# Test import
successful, failed = importer.process_folder(dry_run=True)

# Actually import
successful, failed = importer.process_folder(dry_run=False)
```

That's it! One file handles all functionality.