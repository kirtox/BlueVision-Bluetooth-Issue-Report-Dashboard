from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class UserCreate(UserBase):
    username: str
    email: Optional[str] = None  # Email is optional during registration
    password: str
    role: Optional[str] = "User"  # Default to User
    avatar: Optional[str] = None  # Avatar upload is optional during registration
    is_active: Optional[bool] = True  # Default to True

    @field_validator('username')
    @classmethod
    def username_to_lowercase(cls, v):
        return v.lower() if v else v

    @field_validator('email')
    @classmethod
    def email_to_lowercase(cls, v):
        if v is not None:
            return v.lower()
        return v

class UserUpdate(UserBase):
    password: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator('email')
    @classmethod
    def email_to_lowercase(cls, v):
        if v is not None:
            return v.lower()
        return v

class UserLogin(BaseModel):
    username: str
    password: str

    @field_validator('username')
    @classmethod
    def username_to_lowercase(cls, v):
        return v.lower() if v else v

class ChangePassword(BaseModel):
    email: str
    current_password: str
    new_password: str

    @field_validator('email')
    @classmethod
    def email_to_lowercase(cls, v):
        return v.lower() if v else v

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
