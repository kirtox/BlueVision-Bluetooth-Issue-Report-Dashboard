from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .db import get_db
from .crud import get_user, create_user, get_users, authenticate_user, change_user_password
from .utils import verify_password, create_token, verify_token
from .schema_user import UserCreate, UserLogin, UserResponse, ChangePassword
from . import models

router = APIRouter()
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> models.User:
    """獲取當前認證用戶"""
    token = credentials.credentials
    username = verify_token(token)
    
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = get_user(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    if user.is_active != "Y":
        raise HTTPException(status_code=401, detail="User account is inactive")
    
    return user


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
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    """創建新用戶（管理員功能）"""
    # 檢查用戶名是否已存在
    db_user = get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return create_user(db, user=user)


@router.get("/users", response_model=list[UserResponse])
def get_users_endpoint(db: Session = Depends(get_db)):
    """獲取所有用戶列表（管理員功能）"""
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
