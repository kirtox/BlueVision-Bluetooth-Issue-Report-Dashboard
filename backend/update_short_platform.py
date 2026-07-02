"""
Update existing report records to populate short_platform values.

Match condition: uses normalize_platform(serial_num, platform) from utils.
Mapping is maintained centrally in app/utils.py.

Then update:
- short_platform
"""

import sys
from pathlib import Path

# Add backend folder to import app modules when run as a script.
sys.path.append(str(Path(__file__).resolve().parent))

from app.db import SessionLocal
from app.models import Report
from app.utils import normalize_platform


def update_short_platforms() -> None:
    """Fill short_platform from (serial_num, platform) mapping for existing reports."""
    db = SessionLocal()

    updated_rows = 0
    unchanged_rows = 0
    skipped_rows = 0

    try:
        reports = db.query(Report).all()
        total = len(reports)

        print(f"Found {total} reports to check")
        print("")

        for report in reports:
            if not report.serial_num or not report.platform:
                skipped_rows += 1
                continue

            normalized_value = normalize_platform(report.serial_num, report.platform)

            if normalized_value is None:
                skipped_rows += 1
                continue

            old_value = report.short_platform

            if old_value == normalized_value:
                unchanged_rows += 1
                continue

            report.short_platform = normalized_value
            updated_rows += 1
            print(
                f"[UPDATED] id={report.id}, serial_num={report.serial_num}, "
                f"short_platform: '{old_value}' -> '{normalized_value}'"
            )

        db.commit()

        print("\n=== Update Summary ===")
        print(f"Updated rows  : {updated_rows}")
        print(f"Unchanged rows: {unchanged_rows}")
        print(f"Skipped rows  : {skipped_rows} (no serial_num/platform or no mapping)")
        print("Done.")

    except Exception as exc:
        db.rollback()
        print(f"Error while updating short_platform: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=== Populating short_platform in report table ===\n")
    update_short_platforms()
