# from fastapi import FastAPI, Depends
# from .db import get_db, engine
# from . import models, crud, auth, export
# from .schema_report import ReportCreate, ReportUpdate, ReportInDB
# from sqlalchemy.orm import Session
# from sqlalchemy import func
# # Solve CORS（Cross-Origin Resource Sharing） issue
# from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Depends, Body, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from app.db import get_db, engine
from app import models, crud, auth, export
from app.auth import get_current_user, get_current_user_optional
from app.schema_report import ReportCreate, ReportUpdate, ReportInDB
from app.schema_platform import PlatformCreate, PlatformUpdate, PlatformInDB
from app.schema_platform_latest_report import PlatformWithLatestReportInDB
from app.schema_api_log import APIAccessLogInDB
from app.schema_chat import ChatAskRequest, ChatAskResponse
from app.chat_service import handle_chat_ask
from app.schema_user import UserResponse
from app.middleware import APIAccessLogMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect, text
# Solve CORS（Cross-Origin Resource Sharing） issue
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
import logging
import os
import uuid
import hashlib
from pathlib import Path

# Safe table creation - create tables if they don't exist
def create_tables_if_not_exist():
    """Safely create tables only if they don't exist"""
    try:
        with engine.connect() as conn:
            # Use PostgreSQL advisory lock to avoid concurrent table creation
            conn.execute(text("SELECT pg_advisory_lock(123456)"))
            
            try:
                # Create tables with built-in check mechanism
                models.Base.metadata.create_all(bind=engine, checkfirst=True)
                logging.info("[SUCCESS] Database tables ready")
            finally:
                # Always release the lock, even if table creation fails
                conn.execute(text("SELECT pg_advisory_unlock(123456)"))
                
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logging.info("[SUCCESS] Database connection successful")
        
    except Exception as e:
        logging.error(f"[ERROR] Database setup failed: {e}")
        # Don't fail startup, but log the error

create_tables_if_not_exist()

app = FastAPI()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files for serving uploaded avatars
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Add API Access Log Middleware
app.add_middleware(APIAccessLogMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # WARNING: For dev mode "*"
    # allow_origins=["http://localhost:5173"], # For production mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(export.router)

@app.get("/")
def root():
    return {"message": "Hello FastAPI"}

@app.get("/health")
def health():
    return {"status": "ok"}


# @app.post("/chat/ask", response_model=ChatAskResponse)
# def chat_ask(
#     payload: ChatAskRequest,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     return handle_chat_ask(payload=payload, db=db, current_user=current_user)


@app.post("/chat/ask", response_model=ChatAskResponse)
def chat_ask(
    payload: ChatAskRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Enhanced chat endpoint with LLM function calling for database queries"""
    return handle_chat_ask(payload=payload, db=db, current_user=current_user)

# Read all reports
@app.get("/reports", response_model=list[ReportInDB])
def read_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_optional)
):
    from .permissions import PermissionChecker
    
    # If no authenticated user, return 401
    if not current_user:
        print("Reports API: No authenticated user found")
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Add detailed logging to diagnose permission issues
    print(f"Reports API called by user: {current_user.username}, role: {current_user.role}")
    
    # Check if user has permission to view reports
    can_view = PermissionChecker.can_view_reports(current_user)
    print(f"User {current_user.username} can view reports: {can_view}")
    
    if not can_view:
        print(f"Access denied for user {current_user.username} with role {current_user.role}")
        raise HTTPException(status_code=403, detail=f"Permission denied: Role '{current_user.role}' cannot view reports")
    
    return crud.get_reports(db)

# Add a report
@app.post("/reports", response_model=ReportInDB)
def create_report(
    report: ReportCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import PermissionChecker
    
    # Check if user has permission to create reports
    if not PermissionChecker.can_create_report(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot create reports")
    
    # If User role, automatically set op_name to current username
    # Auditor role can set op_name to any valid username
    if current_user.role == "User":
        report.op_name = current_user.username
    
    # Ensure op_name is lowercase before saving to database
    if report.op_name:
        report.op_name = report.op_name.lower()
    
    return crud.create_report(db, report)

# Script API - Only validate if op_name exists in user table
@app.post("/reports/script", response_model=ReportInDB)
def create_report_script(
    report: ReportCreate, 
    db: Session = Depends(get_db)
):
    """
    Report upload endpoint designed for Python scripts
    Only validates if op_name exists in user table
    """
    # Check if op_name is provided
    if not report.op_name:
        raise HTTPException(status_code=400, detail="op_name is required for script uploads")
    
    # Validate if op_name exists in user table
    user = db.query(models.User).filter(models.User.username == report.op_name.lower()).first()
    if not user:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid op_name: '{report.op_name}({report.op_name.lower()}, {len(report.op_name)})' not found in user table"
        )
    
    # Check if user is active
    if user.is_active != "Y":
        raise HTTPException(
            status_code=400, 
            detail=f"User '{report.op_name}' is not active"
        )
    
    # Convert op_name to lowercase before saving to database
    report.op_name = report.op_name.lower()
    
    return crud.create_report(db, report)

# Update a report
@app.patch("/reports/{report_id}", response_model=ReportInDB)
def update_report(
    report_id: int, 
    report: ReportUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import check_report_ownership
    
    # Check report ownership
    if not check_report_ownership(current_user, report_id, db):
        raise HTTPException(
            status_code=403, 
            detail="Permission denied: You can only edit your own reports"
        )
    
    return crud.update_report(db, report_id, report)

# Delete a report
@app.delete("/reports/{report_id}")
def delete_report(
    report_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import check_report_ownership
    
    # Check report ownership
    if not check_report_ownership(current_user, report_id, db):
        raise HTTPException(
            status_code=403, 
            detail="Permission denied: You can only delete your own reports"
        )
    
    return crud.delete_report(db, report_id)

# Summary each cpu numbers
@app.get("/reports/cpu_stats")
def get_cpu_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import PermissionChecker
    
    # Check if user has permission to view reports
    if not PermissionChecker.can_view_reports(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot view reports")
    
    return crud.get_cpu_stats(db)

# Read all platforms
@app.get("/platforms", response_model=list[PlatformInDB])
def read_platforms(db: Session = Depends(get_db)):
    # Platform status viewing temporarily does not require authentication
    # TODO: Can decide whether authentication is needed based on requirements later
    return crud.get_platforms(db)

# /platforms/latest_reports must place before /platform/{serial_num}
# Otherwise, it would happen internal server error.
# /platform/{serial_num} add prefix word "search_by_sn", so the issue should be solved.
@app.get("/platforms/latest_reports", response_model=list[PlatformWithLatestReportInDB])
def get_platform_latest_reports(db: Session = Depends(get_db)):
    # Platform status viewing temporarily does not require authentication as this is a core Dashboard feature
    # TODO: Can decide whether authentication is needed based on requirements later
    return crud.get_platform_latest_reports(db)

@app.get("/platforms/search_by_sn/{serial_num}", response_model=PlatformInDB)
def get_platform_by_serial_num(
    serial_num: str, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # All logged-in users can view platform status
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    result = crud.get_platform_by_serial_num(db, serial_num)
    if not result:
        raise HTTPException(status_code=404, detail="Platform not found")
    return result

# Add a platform
@app.post("/platforms", response_model=PlatformInDB)
def create_platform(
    platform: PlatformCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import PermissionChecker
    
    # Check if user has platform management permission
    if not PermissionChecker.can_manage_platforms(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot manage platforms")
    
    return crud.create_platform(db, platform)

# Update a platform
@app.put("/platforms/{platform_id}", response_model=PlatformInDB)
def update_platform(
    platform_id: int, 
    platform: PlatformUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import PermissionChecker
    
    # Check if user has platform management permission
    if not PermissionChecker.can_manage_platforms(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot manage platforms")
    
    return crud.update_platform(db, platform_id, platform)

# Delete a platform
@app.delete("/platforms/{platform_id}")
def delete_platform(
    platform_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import PermissionChecker
    
    # Check if user has platform management permission
    if not PermissionChecker.can_manage_platforms(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot manage platforms")
    
    return crud.delete_platform(db, platform_id)

# API Access Logs
@app.get("/api-logs", response_model=list[APIAccessLogInDB])
def get_api_logs(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    from .permissions import PermissionChecker
    
    # Check if user has permission to view logs
    if not PermissionChecker.can_view_logs(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot view API logs")
    
    return crud.get_api_access_logs(db, skip=skip, limit=limit)

# Avatar upload endpoint
@app.post("/upload-avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (max 5MB)
    if file.size and file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 5MB")
    
    try:
        # Read file content and calculate hash
        content = await file.read()
        import hashlib
        file_hash = hashlib.md5(content).hexdigest()
        file_extension = Path(file.filename).suffix if file.filename else ".jpg"
        hashed_filename = f"{file_hash}{file_extension}"
        new_file_path = UPLOAD_DIR / hashed_filename
        
        # Save file only if it doesn't exist (deduplication)
        if not new_file_path.exists():
            with open(new_file_path, "wb") as buffer:
                buffer.write(content)
            print(f"[SAVE] Saved new avatar file: {hashed_filename}")
        else:
            print(f"[REUSE] Reusing existing avatar file: {hashed_filename}")
        
        # Clean up old avatar file safely
        if current_user.avatar:
            old_avatar_url = current_user.avatar
            old_filename = Path(old_avatar_url).name
            
            # Check if other users are still using the old file
            other_users_count = db.query(models.User).filter(
                models.User.avatar == old_avatar_url,
                models.User.id != current_user.id
            ).count()
            
            # Only delete if no other users are using it
            if other_users_count == 0:
                old_file_path = UPLOAD_DIR / old_filename
                if old_file_path.exists() and old_filename != hashed_filename:
                    old_file_path.unlink()
                    print(f"[DELETE] Deleted unused avatar: {old_filename}")
            else:
                print(f"[KEEP] Keeping shared avatar: {old_filename} (used by {other_users_count} other users)")
        
        # Update user avatar in database
        avatar_url = f"/uploads/avatars/{hashed_filename}"
        updated_user = crud.update_user(db, current_user.id, {"avatar": avatar_url})
        
        if not updated_user:
            # Clean up uploaded file if database update fails
            if new_file_path.exists() and not any(
                user.avatar == avatar_url for user in db.query(models.User).all()
            ):
                new_file_path.unlink()
            raise HTTPException(status_code=500, detail="Failed to update user avatar")
        
        print(f"[SUCCESS] Avatar updated for user {current_user.username}: {hashed_filename}")
        return updated_user
        
    except Exception as e:
        print(f"[ERROR] Avatar upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process avatar: {str(e)}")



# Summary each serial_num's latest report
# @app.get("/platforms/latest_reports", response_model=list[PlatformWithLatestReportInDB])
# def get_platform_latest_reports(db: Session = Depends(get_db)):
#     # return crud.get_platform_latest_reports(db)
    
#     result = crud.get_platform_latest_reports(db)
#     return [PlatformWithLatestReportInDB(**row) for row in result]



# # Partial update by specific columns (current: platform, scenario)
# @app.patch("/reports/latest", response_model=ReportInDB)
# def update_latest_report(
#     platform: str,
#     scenario: str,
#     update_data: ReportUpdate = Body(...),
#     db: Session = Depends(get_db)
# ):
#     latest_report = (
#         db.query(models.Report)
#         .filter(models.Report.platform == platform, models.Report.scenario == scenario)
#         .order_by(models.Report.date.desc())
#         .first()
#     )

#     if not latest_report:
#         raise HTTPException(status_code=404, detail="No matching report found")

#     update_dict = update_data.dict(exclude_unset=True)
#     for key, value in update_dict.items():
#         setattr(latest_report, key, value)

#     db.commit()
#     db.refresh(latest_report)
#     return latest_report