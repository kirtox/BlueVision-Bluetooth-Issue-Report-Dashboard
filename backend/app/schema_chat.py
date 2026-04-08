"""Enhanced chat schema with function calling support"""
from pydantic import BaseModel, Field
from typing import Any, Literal, Optional


class ChatHistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatAskRequest(BaseModel):
    """Request for enhanced chat with function calling"""
    question: str
    history: list[ChatHistoryItem] = Field(default_factory=list)


class ORMFilterCondition(BaseModel):
    """Represents a single filter condition for ORM query"""
    column: str
    operator: Literal["eq", "ne", "gt", "gte", "lt", "lte", "in", "like", "between"]
    value: Any = None
    values: Optional[list[Any]] = None  # For 'in' operator


class ORMAggregationSpec(BaseModel):
    """Represents a single aggregation in an ORM query."""
    function: Literal["count", "sum", "avg", "min", "max"]
    column: str
    alias: Optional[str] = None
    distinct: bool = False


class ORMQueryParams(BaseModel):
    """Parameters for database query via ORM function calling"""
    select_columns: Optional[list[str]] = None  # None means all columns
    filters: Optional[list[ORMFilterCondition]] = None
    aggregations: Optional[list[ORMAggregationSpec]] = None
    group_by: Optional[list[str]] = None
    order_by: Optional[list[tuple[str, Literal["asc", "desc"]]]] = None
    limit: int = 100


class DatabaseQueryToolCall(BaseModel):
    """Represents a database_query function call from LLM"""
    function_name: str
    parameters: ORMQueryParams


class ChatAskResponse(BaseModel):
    """Response for enhanced chat with function calling"""
    answer: str
    has_database_query: bool = False
    query_params: Optional[ORMQueryParams] = None
    query_results: Optional[list[dict[str, Any]]] = None
    trace_id: Optional[str] = None


class ExpertGPTToolDefinition(BaseModel):
    """OpenAI format tool/function definition"""
    type: str = "function"
    function: dict[str, Any]
