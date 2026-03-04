"""
Update existing reports with short_scenario values
Run this script after adding the short_scenario column to populate existing data
"""
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.append(str(Path(__file__).resolve().parent))

from app.db import SessionLocal
from app.models import Report
from app.scenario_mapper import get_short_scenario_name


def update_all_short_scenarios():
    """Update short_scenario for all existing reports"""
    db = SessionLocal()
    try:
        # Get all reports
        reports = db.query(Report).all()
        total = len(reports)
        updated = 0
        
        print(f"Found {total} reports to update")
        
        for report in reports:
            if report.scenario and report.microsoft_teams:
                old_short = report.short_scenario
                report.short_scenario = get_short_scenario_name(
                    report.scenario,
                    report.microsoft_teams
                )
                
                if old_short != report.short_scenario:
                    updated += 1
                    print(f"Report ID {report.id}: '{old_short}' -> '{report.short_scenario}'")
        
        db.commit()
        print(f"\n✅ Successfully updated {updated} reports")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("=== Updating short_scenario for all reports ===\n")
    update_all_short_scenarios()
