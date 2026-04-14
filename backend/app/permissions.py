from functools import wraps
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from .auth import get_current_user
from .db import get_db
from . import models
from typing import List, Optional

def require_role(allowed_roles: List[str]):
    """
    Decorator: Check if user has one of the specified roles
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get current_user from kwargs
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(status_code=401, detail="Authentication required")
            
            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=403, 
                    detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
                )
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

def admin_only(func):
    """
    Decorator: Admin access only
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        current_user = kwargs.get('current_user')
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        if current_user.role != "Administrator":
            raise HTTPException(status_code=403, detail="Administrator access required")
        
        return func(*args, **kwargs)
    return wrapper

def authenticated_only(func):
    """
    Decorator: Requires login but no role restriction
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        current_user = kwargs.get('current_user')
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        return func(*args, **kwargs)
    return wrapper

def check_report_edit_permission(user: models.User, report_id: int, db: Session) -> bool:
    """
    Check if user can edit specified report.
    - Administrator/Auditor: Can edit any report
    - User: Can edit only their own report
    - Guest: Cannot edit reports
    """
    if user.role in ["Administrator", "Auditor"]:
        return True

    if user.role == "User":
        from .crud import get_report_by_id
        report = get_report_by_id(db, report_id)
        if not report:
            return False
        return (report.op_name or "").lower() == (user.username or "").lower()

    return False


def check_report_delete_permission(user: models.User, report_id: int, db: Session) -> bool:
    """
    Check if user can delete specified report.
    - Administrator/Auditor: Can delete any report
    - User/Guest: Cannot delete reports
    """
    if user.role in ["Administrator", "Auditor"]:
        return True

    return False


def check_report_ownership(user: models.User, report_id: int, db: Session) -> bool:
    """
    Backward-compatible alias for ownership check.
    Uses edit permission semantics.
    """
    return check_report_edit_permission(user, report_id, db)

def require_report_ownership(func):
    """
    Decorator: Check report ownership
    Requires report_id in route parameters
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        current_user = kwargs.get('current_user')
        db = kwargs.get('db')
        report_id = kwargs.get('report_id')
        
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        if not report_id:
            raise HTTPException(status_code=400, detail="Report ID required")
        
        if not check_report_ownership(current_user, report_id, db):
            raise HTTPException(
                status_code=403, 
                detail="You can only modify your own reports"
            )
        
        return func(*args, **kwargs)
    return wrapper

class PermissionChecker:
    """
    Permission checking utility class
    """
    
    @staticmethod
    def can_manage_users(user: models.User) -> bool:
        """Check if user can manage users"""
        return user.role == "Administrator"
    
    @staticmethod
    def can_view_logs(user: models.User) -> bool:
        """Check if user can view API logs"""
        return user.role == "Administrator"
    
    @staticmethod
    def can_manage_platforms(user: models.User) -> bool:
        """Check if user can manage platforms"""
        return user.role == "Administrator"
    
    @staticmethod
    def can_create_report(user: models.User) -> bool:
        """Check if user can create reports"""
        return user.role in ["Administrator", "User", "Auditor"]
    
    @staticmethod
    def can_view_reports(user: models.User) -> bool:
        """Check if user can view reports"""
        return user.role in ["Administrator", "User", "Guest", "Auditor"]
    
    @staticmethod
    def can_export_reports(user: models.User) -> bool:
        """Check if user can export reports"""
        return user.role in ["Administrator", "User", "Auditor"]
    
    @staticmethod
    def can_edit_profile(user: models.User) -> bool:
        """Check if user can edit profile"""
        return user.role in ["Administrator", "User", "Auditor"]
    
    @staticmethod
    def can_view_all_reports(user: models.User) -> bool:
        """Check if user can view all reports (not just their own)"""
        return user.role in ["Administrator", "Auditor"]
    
    @staticmethod
    def can_edit_all_reports(user: models.User) -> bool:
        """Check if user can edit all reports (not just their own)"""
        return user.role in ["Administrator", "Auditor"]
    
    @staticmethod
    def can_view_platforms(user: models.User) -> bool:
        """Check if user can view platforms"""
        return user.role in ["Administrator", "User", "Guest", "Auditor"]