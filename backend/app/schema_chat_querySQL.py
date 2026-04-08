from pydantic import BaseModel, Field
from typing import Any, Literal, Optional


class ChatHistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatAskRequest(BaseModel):
    question: str
    history: list[ChatHistoryItem] = Field(default_factory=list)


class ChatAskResponse(BaseModel):
    answer: str
    sql: str
    rows: list[dict[str, Any]]
    trace_id: Optional[str] = None
