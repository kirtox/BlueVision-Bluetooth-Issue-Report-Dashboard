from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: Optional[str] = None

class UserCreate(UserBase):
    username: str
    password: str
    role: Optional[str] = "User"  # 預設為 User

class UserUpdate(UserBase):
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(UserBase):
    id: int
    username: str
    role: str
    created_at: datetime
    is_active: str

    model_config = {
        "from_attributes": True
    }

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    created_at: datetime
    is_active: str

    model_config = {
        "from_attributes": True
    }
