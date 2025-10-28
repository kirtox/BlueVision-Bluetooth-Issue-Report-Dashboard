from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class UserCreate(UserBase):
    username: str
    email: Optional[str] = None  # 註冊時可選擇提供 email
    password: str
    role: Optional[str] = "User"  # 預設為 User
    avatar: Optional[str] = None  # 註冊時可選擇上傳頭像
    is_active: Optional[bool] = True  # 預設為 True

class UserUpdate(UserBase):
    password: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None
    is_active: Optional[bool] = None

class UserLogin(BaseModel):
    username: str
    password: str

class ChangePassword(BaseModel):
    email: str
    current_password: str
    new_password: str

class UserInDB(UserBase):
    id: int
    username: str
    email: Optional[str] = None
    role: str
    avatar: Optional[str] = None
    created_at: datetime
    is_active: bool

    model_config = {
        "from_attributes": True
    }

class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    role: str
    avatar: Optional[str] = None
    created_at: datetime
    is_active: bool

    model_config = {
        "from_attributes": True
    }
