from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# from pydantic_core.core_schema import str_schema

class PlatformBase(BaseModel):
    date: Optional[datetime] = None
    serial_num: Optional[str] = None
    current_status: Optional[str] = None

class PlatformCreate(PlatformBase):
    pass

class PlatformUpdate(PlatformBase):
    pass

class PlatformInDB(PlatformBase):
    id: int
    
    model_config = {
        "from_attributes": True
    }