from . import models
from .schema_report import ReportCreate, ReportUpdate
from .schema_platform import PlatformCreate, PlatformUpdate
from .schema_platform_latest_report import PlatformWithLatestReportInDB
from .schema_user import UserCreate, UserUpdate
from sqlalchemy.orm import Session, aliased
from .utils import get_password_hash
from sqlalchemy import func, or_, String
from datetime import datetime
from datetime import datetime, timezone, timedelta

tz_taipei = timezone(timedelta(hours=8))

# Report CRUD
def get_reports(db: Session):
    return db.query(models.Report).all()

def parse_date(date_str: str) -> datetime:
    """
    Parse the ISO8601 date string passed by the front end (which may be Z, UTC, or +08:00)
    Convert to Taipei time (GMT+8) and return the naive datetime
    (Because the DB field is TIMESTAMP WITHOUT TIME ZONE)
    """
    # 1. Process Z first → treat as UTC
    if date_str.endswith("Z"):
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    else:
        dt = datetime.fromisoformat(date_str)

    # 2. If it is tz-aware, convert it to Taipei time
    if dt.tzinfo is not None:
        dt = dt.astimezone(tz_taipei)

    # 3. Remove tzinfo and return naive datetime to align with the DB
    return dt.replace(tzinfo=None)

# To export excel with filter conditions
def get_reports_filtered(
    db: Session,
    search_term: str | None = None,
    platforms: list[str] | None = None,
    results: list[str] | None = None,
    wlans: list[str] | None = None,
    scenarios: list[str] | None = None,
    bt_drivers: list[str] | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    """Return reports filtered by the given optional criteria.
    Dates should be ISO-8601 strings (e.g., 2025-09-03 or 2025-09-03T10:00:00).
    """
    query = db.query(models.Report)

    if search_term:
        search_filter = f"%{search_term}%"
        string_columns = [
            c for c in models.Report.__table__.columns
            if isinstance(c.type, String)
        ]
        if string_columns:
            query = query.filter(or_(*[col.ilike(search_filter) for col in string_columns]))

    if platforms:
        query = query.filter(models.Report.platform.in_(platforms))

    if results:
        query = query.filter(models.Report.result.in_(results))

    if wlans:
        query = query.filter(models.Report.wlan.in_(wlans))

    if scenarios:
        query = query.filter(models.Report.scenario.in_(scenarios))

    if bt_drivers:
        query = query.filter(models.Report.bt_driver.in_(bt_drivers))

    if start_date:
        query = query.filter(models.Report.date >= parse_date(start_date))

    if end_date:
        end_datetime = parse_date(end_date)
        end_datetime = end_datetime.replace(hour=23, minute=59, second=59, microsecond=999999)
        query = query.filter(models.Report.date <= end_datetime)

    return query.all()

def create_report(db: Session, report: ReportCreate):
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def update_report(db: Session, report_id: int, report: ReportUpdate):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        return None
    for key, value in report.dict(exclude_unset=True).items():
        setattr(db_report, key, value)
    db.commit()
    db.refresh(db_report)
    return db_report

def delete_report(db: Session, report_id: int):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        return None
    db.delete(db_report)
    db.commit()
    return {"deleted": True}

def get_cpu_stats(db: Session):
    result = db.query(models.Report.cpu, func.count(models.Report.cpu)).group_by(models.Report.cpu).all()
    return [{"cpu": cpu, "count": count} for cpu, count in result]

# Platform CRUD
def get_platforms(db: Session):
    return db.query(models.Platform).all()

def get_platform_by_serial_num(db: Session, serial_num: str):
    """
    Query Platform by serial_num
    Because serial_num is unique=True in the model
    It returns a single entry (or None if it doesn't exist)
    """
    return db.query(models.Platform).filter(models.Platform.serial_num == serial_num).first()

def create_platform(db: Session, platform: PlatformCreate):
    db_platform = models.Platform(**platform.dict())
    db.add(db_platform)
    db.commit()
    db.refresh(db_platform)
    return db_platform

def update_platform(db: Session, platform_id: int, platform: PlatformUpdate):
    db_platform = db.query(models.Platform).filter(models.Platform.id == platform_id).first()
    if not db_platform:
        return None
    for key, value in platform.dict(exclude_unset=True).items():
        setattr(db_platform, key, value)
    db.commit()
    db.refresh(db_platform)
    return db_platform

def delete_platform(db: Session, platform_id: int):
    db_platform = db.query(models.Platform).filter(models.Platform.id == platform_id).first()
    if not db_platform:
        return None
    db.delete(db_platform)
    db.commit()
    return {"deleted": True}

def get_platform_latest_reports(db: Session):
    # Subquery: find latest report date for each serial_num
    subquery = (
        db.query(
            models.Report.serial_num.label("serial_num"),
            func.max(models.Report.date).label("date")
        )
        .group_by(models.Report.serial_num)
        .subquery()
    )

    # JOIN subquery and get latest report
    latest_reports = (
        db.query(models.Report)
        .join(subquery, (models.Report.serial_num == subquery.c.serial_num) & (models.Report.date == subquery.c.date))
        .subquery()
    )

    # At the end, JOIN platform
    rows = (
        db.query(
            models.Platform.id,
            models.Platform.serial_num,
            models.Platform.current_status,
            models.Platform.date.label("platform_date"),
            latest_reports.c.platform_brand,
            latest_reports.c.platform,
            latest_reports.c.cpu,
            latest_reports.c.wlan,
            latest_reports.c.date.label("report_date")
        )
        .outerjoin(latest_reports, models.Platform.serial_num == latest_reports.c.serial_num)
        .all()
    )

    result = [
        {
            "id": row.id,
            "serial_num": row.serial_num,
            "current_status": row.current_status,
            "platform_date": row.platform_date,
            "platform_brand": row.platform_brand,
            "platform": row.platform,
            "cpu": row.cpu,
            "wlan": row.wlan,
            "report_date": row.report_date,
        }
        for row in rows
    ]

    return result

# User CRUD
def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        role=user.role,
        avatar=user.avatar
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    """獲取所有用戶列表"""
    return db.query(models.User).all()

def authenticate_user(db: Session, username: str, password: str):
    """驗證用戶登入"""
    from .utils import verify_password
    
    print(f"Authenticating user: {username}")
    
    user = get_user(db, username)
    if not user:
        print(f"User not found: {username}")
        return False
    
    print(f"User found: {user.username}, active: {user.is_active}")
    
    if user.is_active != "Y":
        print(f"User not active: {user.is_active}")
        return False
    
    password_valid = verify_password(password, user.hashed_password)
    print(f"Password verification result: {password_valid}")
    
    if not password_valid:
        print("Password verification failed")
        return False
    
    print("Authentication successful")
    return user

def update_user(db: Session, user_id: int, user):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    # Handle both UserUpdate objects and dictionaries
    if hasattr(user, 'dict'):
        update_data = user.dict(exclude_unset=True)
    else:
        update_data = user

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

# API Access Log CRUD
def create_api_access_log(db: Session, log_data: dict):
    """創建 API 訪問日誌記錄"""
    db_log = models.APIAccessLog(**log_data)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_api_access_logs(db: Session, skip: int = 0, limit: int = 100):
    """獲取 API 訪問日誌列表"""
    return db.query(models.APIAccessLog).order_by(models.APIAccessLog.timestamp.desc()).offset(skip).limit(limit).all()
