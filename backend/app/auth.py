from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .db import get_db
from .crud import get_user, create_user, get_users, authenticate_user, change_user_password, update_user
from .utils import verify_password, create_token, verify_token
from .schema_user import UserCreate, UserLogin, UserResponse, ChangePassword, UserUpdate
from . import models
from typing import Optional

router = APIRouter()
security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> models.User:
    """獲取當前認證用戶"""
    try:
        token = credentials.credentials
        print(f"get_current_user: Received token: {token[:20]}..." if token else "get_current_user: No token received")
        
        username = verify_token(token)
        print(f"get_current_user: Token verification result: {username}")
        
        if not username:
            print("get_current_user: Token verification failed")
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = get_user(db, username)
        print(f"get_current_user: User lookup result: {user.username if user else 'None'}")
        
        if not user:
            print(f"get_current_user: User not found for username: {username}")
            raise HTTPException(status_code=401, detail="User not found")
        
        if user.is_active != "Y":
            print(f"get_current_user: User {username} is inactive: {user.is_active}")
            raise HTTPException(status_code=401, detail="User account is inactive")
        
        print(f"get_current_user: Successfully authenticated user: {user.username}, role: {user.role}")
        return user
    except HTTPException:
        raise
    except Exception as e:
        print(f"get_current_user: Unexpected error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")


def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security), db: Session = Depends(get_db)) -> Optional[models.User]:
    """獲取當前認證用戶（可選）"""
    if not credentials:
        print("get_current_user_optional: No credentials provided")
        return None
    
    try:
        token = credentials.credentials
        print(f"get_current_user_optional: Received token: {token[:20]}..." if token else "get_current_user_optional: No token received")
        
        username = verify_token(token)
        print(f"get_current_user_optional: Token verification result: {username}")
        
        if not username:
            print("get_current_user_optional: Token verification failed")
            return None
        
        user = get_user(db, username)
        print(f"get_current_user_optional: User lookup result: {user.username if user else 'None'}")
        
        if not user:
            print(f"get_current_user_optional: User not found for username: {username}")
            return None
        
        if user.is_active != "Y":
            print(f"get_current_user_optional: User {username} is inactive: {user.is_active}")
            return None
        
        print(f"get_current_user_optional: Successfully authenticated user: {user.username}, role: {user.role}")
        return user
    except Exception as e:
        print(f"get_current_user_optional: Error: {e}")
        return None


@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """用戶登入"""
    print(f"Login attempt for user: {user_credentials.username}")
    
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    print(f"Authentication result: {user}")
    
    if not user or user is False:
        print(f"Authentication failed for user: {user_credentials.username}")
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    print(f"Authentication successful for user: {user.username}")
    
    token = create_token(user.username)
    
    response_data = {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "avatar": user.avatar
        }
    }
    
    print(f"Login response: {response_data}")
    return response_data


@router.post("/register")
def register(credentials: UserCreate, db: Session = Depends(get_db)):
    """用戶註冊（使用 /register 路由）"""
    existing_user = get_user(db, credentials.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return create_user(db, credentials)


@router.post("/users", response_model=UserResponse)
def create_user_endpoint(
    user: UserCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """創建新用戶（管理員功能）"""
    from .permissions import PermissionChecker
    
    # 檢查是否有用戶管理權限
    if not PermissionChecker.can_manage_users(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot manage users")
    
    # 檢查用戶名是否已存在
    db_user = get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return create_user(db, user=user)


@router.get("/users", response_model=list[UserResponse])
def get_users_endpoint(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """獲取所有用戶列表（管理員功能）"""
    from .permissions import PermissionChecker
    
    # 檢查是否有用戶管理權限
    if not PermissionChecker.can_manage_users(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot manage users")
    
    return get_users(db)


@router.get("/verify-token")
def verify_token_endpoint(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """驗證 JWT Token"""
    token = credentials.credentials
    username = verify_token(token)
    
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = get_user(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return {
        "valid": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "avatar": user.avatar
        }
    }


@router.post("/change-password")
def change_password(
    password_data: ChangePassword, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """變更用戶密碼"""
    # 驗證郵箱是否匹配
    if current_user.email != password_data.email:
        raise HTTPException(
            status_code=400, 
            detail="Email address does not match your registered email"
        )
    
    # 嘗試變更密碼
    result = change_user_password(
        db, 
        current_user.id, 
        password_data.current_password, 
        password_data.new_password
    )
    
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    elif result is False:
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    return {"message": "Password changed successfully"}


@router.get("/check-username/{username}")
def check_username_availability(username: str, db: Session = Depends(get_db)):
    """檢查用戶名是否可用"""
    # 將username轉為小寫進行檢查
    username_lower = username.lower()
    existing_user = get_user(db, username_lower)
    return {
        "available": existing_user is None,
        "username": username_lower
    }


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user_endpoint(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """更新用戶資料"""
    from .permissions import PermissionChecker
    
    # 檢查權限：管理員可以編輯任意用戶，一般用戶只能編輯自己
    if not (PermissionChecker.can_manage_users(current_user) or current_user.id == user_id):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot edit this user")
    
    # 如果是一般用戶編輯自己，不允許修改角色
    if current_user.id == user_id and not PermissionChecker.can_manage_users(current_user):
        if hasattr(user_update, 'role') and user_update.role is not None:
            raise HTTPException(status_code=403, detail="Permission denied: Cannot change your own role")
    
    updated_user = update_user(db, user_id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return updated_user


@router.delete("/users/{user_id}")
def delete_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """刪除用戶"""
    from .permissions import PermissionChecker
    
    # 檢查是否有用戶管理權限
    if not PermissionChecker.can_manage_users(current_user):
        raise HTTPException(status_code=403, detail="Permission denied: Cannot delete users")
    
    # 不允許刪除自己
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    # 檢查用戶是否存在
    user_to_delete = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 刪除用戶
    db.delete(user_to_delete)
    db.commit()
    
    return {"message": "User deleted successfully"}


@router.get("/debug/users")
def debug_users(db: Session = Depends(get_db)):
    """除錯用：檢查資料庫中的使用者"""
    try:
        users = get_users(db)
        return {
            "total_users": len(users),
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "is_active": user.is_active
                }
                for user in users
            ]
        }
    except Exception as e:
        return {"error": str(e)}
