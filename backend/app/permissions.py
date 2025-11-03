from functools import wraps
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from .auth import get_current_user
from .db import get_db
from . import models
from typing import List, Optional

def require_role(allowed_roles: List[str]):
    """
    裝飾器：檢查用戶是否具有指定角色之一
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 從kwargs中獲取current_user
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
    裝飾器：僅管理員可訪問
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
    裝飾器：需要登入但不限制角色
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        current_user = kwargs.get('current_user')
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        return func(*args, **kwargs)
    return wrapper

def check_report_ownership(user: models.User, report_id: int, db: Session) -> bool:
    """
    檢查用戶是否可以修改指定報告
    - Administrator: 可以修改任何報告
    - User: 只能修改自己的報告 (op_name == username)
    - Guest: 不能修改任何報告
    """
    if user.role == "Administrator":
        return True
    
    if user.role == "Guest":
        return False
    
    if user.role == "User":
        from .crud import get_report_by_id
        report = get_report_by_id(db, report_id)
        if not report:
            return False
        return report.op_name == user.username
    
    return False

def require_report_ownership(func):
    """
    裝飾器：檢查報告擁有權
    需要在路由參數中有report_id
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
    權限檢查工具類
    """
    
    @staticmethod
    def can_manage_users(user: models.User) -> bool:
        """檢查是否可以管理用戶"""
        return user.role == "Administrator"
    
    @staticmethod
    def can_view_logs(user: models.User) -> bool:
        """檢查是否可以查看API日誌"""
        return user.role == "Administrator"
    
    @staticmethod
    def can_manage_platforms(user: models.User) -> bool:
        """檢查是否可以管理平台"""
        return user.role == "Administrator"
    
    @staticmethod
    def can_create_report(user: models.User) -> bool:
        """檢查是否可以創建報告"""
        return user.role in ["Administrator", "User"]
    
    @staticmethod
    def can_view_reports(user: models.User) -> bool:
        """檢查是否可以查看報告"""
        return user.role in ["Administrator", "User", "Guest"]
    
    @staticmethod
    def can_export_reports(user: models.User) -> bool:
        """檢查是否可以匯出報告"""
        return user.role in ["Administrator", "User"]
    
    @staticmethod
    def can_edit_profile(user: models.User) -> bool:
        """檢查是否可以編輯個人資料"""
        return user.role in ["Administrator", "User"]