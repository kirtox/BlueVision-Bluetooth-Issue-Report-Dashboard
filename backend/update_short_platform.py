"""
Update historical report records with short_platform values.

Match condition (exact match):
- serial_num
- platform

Then update:
- short_platform
"""

import sys
from pathlib import Path

# Add backend folder to import app modules when run as a script.
sys.path.append(str(Path(__file__).resolve().parent))

from app.db import SessionLocal
from app.models import Report

# serial_num : platform -> short_platform
MAPPINGS = [
    ("0005770SP1", "HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC", "Merino"),
    ("000577136B", "HP EliteBook X G2i 14 inch Notebook Next Gen AI PC", "Cashmere"),
    ("0005771CT2", "HP ZBook 8 G2i 14 inch Mobile Workstation PC", "Merino"),
    ("123456789", "16Z90U-NDV21KB", "Gram16"),
    ("123490EN400015", "Galaxy Book6 Pro - PRHK", "Venus 14"),
    ("5KKSA00058", "CFSC-2", "BM241mk2"),
    ("BK34HPQ25453PY", "900_MAA Product", "N74030-012"),
    ("C1L54400F9", "HP OmniBook Ultra Laptop 14-kd0xxxC1L54400F9", "Graham"),
    ("GOU64C11AX", "HP", "Gouda14"),
    ("PF51H6WD", "21NSSIT019", "Thames - 2"),
    ("PF5WL21J", "21V7SIT057", "Avon"),
    ("PF5XFNBA", "21V9SIT046", "Avon"),
    ("TANTKD000051448", "Zenbook S14 UX5406AA_000051448", "UX5406"),
    ("N8JYKWW002606016A03400", "Aspire A14-I51M", "Bubbletea"),
    ("5CD6052407", "HP ProBook 4 G2i 16 inch Notebook AI PC", "Cheddar"),
]


def update_short_platforms() -> None:
    db = SessionLocal()

    updated_rows = 0
    unchanged_rows = 0
    not_found_pairs = 0

    try:
        print(f"Total mappings: {len(MAPPINGS)}")

        for serial_num, platform, short_platform in MAPPINGS:
            matched_reports = (
                db.query(Report)
                .filter(
                    Report.serial_num == serial_num,
                    Report.platform == platform,
                )
                .all()
            )

            if not matched_reports:
                not_found_pairs += 1
                print(f"[NOT FOUND] serial_num={serial_num}, platform={platform}")
                continue

            for report in matched_reports:
                old_value = report.short_platform

                if old_value == short_platform:
                    unchanged_rows += 1
                    print(
                        f"[UNCHANGED] id={report.id}, serial_num={serial_num}, "
                        f"short_platform={short_platform}"
                    )
                    continue

                report.short_platform = short_platform
                updated_rows += 1
                print(
                    f"[UPDATED] id={report.id}, serial_num={serial_num}, "
                    f"platform={platform}, short_platform: {old_value} -> {short_platform}"
                )

        db.commit()

        print("\n=== Update Summary ===")
        print(f"Updated rows   : {updated_rows}")
        print(f"Unchanged rows : {unchanged_rows}")
        print(f"Not found pairs: {not_found_pairs}")
        print("Done.")

    except Exception as exc:
        db.rollback()
        print(f"Error while updating short_platform: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=== Updating short_platform in report table ===")
    update_short_platforms()
