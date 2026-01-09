from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class APIAccessLogInDB(BaseModel):
    id: int
    timestamp: datetime
    method: str
    endpoint: str
    client_ip: str
    username: Optional[str] = None
    user_agent: Optional[str] = None
    request_body: Optional[str] = None
    response_status: Optional[int] = None
    response_time_ms: Optional[int] = None
    host: Optional[str] = None
    referer: Optional[str] = None

    class Config:
        from_attributes = True