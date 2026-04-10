"""
Update existing report records to populate short_platform_brand (case-insensitive).

Mapping:
- HP -> HP
- LENOVO (any case) -> Lenovo
- LG Electronics -> LG
- Samsung -> Samsung
- Panasonic Connect Co., Ltd. -> Panasonic
- ASUS -> ASUS
- 900_MAA -> Microsoft
- Acer -> Acer

Any value not in the mapping keeps original platform_brand text in short_platform_brand.
"""

import sys
from pathlib import Path

# Add backend folder to import app modules when run as a script.
sys.path.append(str(Path(__file__).resolve().parent))

from app.db import SessionLocal
from app.models import Report
from app.utils import normalize_platform_brand


def update_all_platform_brands() -> None:
    """Fill short_platform_brand from platform_brand for existing reports."""
    db = SessionLocal()

    updated_rows = 0
    unchanged_rows = 0

    try:
        # Get all reports
        reports = db.query(Report).all()
        total = len(reports)

        print(f"Found {total} reports to check")
        print("")

        for report in reports:
            if not report.platform_brand:
                continue

            source_value = report.platform_brand
            normalized_value = normalize_platform_brand(source_value)
            old_short_value = report.short_platform_brand

            if old_short_value == normalized_value:
                unchanged_rows += 1
                continue

            report.short_platform_brand = normalized_value
            updated_rows += 1
            print(
                f"[UPDATED] id={report.id}, "
                f"short_platform_brand: '{old_short_value}' -> '{normalized_value}' (from platform_brand='{source_value}')"
            )

        db.commit()

        print("\n=== Update Summary ===")
        print(f"Updated rows  : {updated_rows}")
        print(f"Unchanged rows: {unchanged_rows}")
        print("Done.")

    except Exception as exc:
        db.rollback()
        print(f"Error while updating short_platform_brand: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=== Populating short_platform_brand in report table ===\n")
    update_all_platform_brands()
