"""Enhanced chat service with LLM function calling for database queries."""
import json
import os
import re
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse
from uuid import uuid4

import httpx
from anthropic import Anthropic
from dotenv import load_dotenv
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models
from app.schema_chat import ChatAskRequest, ChatAskResponse, ORMQueryParams


LOCAL_ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=LOCAL_ENV_PATH, override=False)

MAX_QUERY_ROWS = 100
SUMMARY_ROW_LIMIT = 20
DEFAULT_EXPERTGPT_MODEL = os.getenv("EXPERTGPT_MODEL", "claude-sonnet-4-5")
EXPERTGPT_TOKEN = os.getenv("EXPERTGPT_TOKEN", "")
EXPERTGPT_API_URL = os.getenv("EXPERTGPT_API_URL", "https://expertgpt.intel.com/v1")
INTERNAL_EXPERTGPT_HOSTS = {"expertgpt.intel.com", "gnai.intel.com"}


def get_expertgpt_base_url() -> str:
    """Normalize configured URL into a base URL for the Anthropic client."""
    configured_url = EXPERTGPT_API_URL.strip().rstrip("/")
    if not configured_url:
        return configured_url

    parsed = urlparse(configured_url)
    normalized_path = parsed.path.rstrip("/")
    if normalized_path.endswith("/chat/completions"):
        normalized_path = normalized_path[: -len("/chat/completions")]

    return f"{parsed.scheme}://{parsed.netloc}{normalized_path}"


def has_expertgpt_config() -> bool:
    return bool(EXPERTGPT_TOKEN and EXPERTGPT_API_URL)


def is_internal_expertgpt_url(url: str) -> bool:
    return (urlparse(url).hostname or "") in INTERNAL_EXPERTGPT_HOSTS


def create_anthropic_client() -> Anthropic:
    """Create Anthropic client with optional custom base URL."""
    base_url = get_expertgpt_base_url()
    use_internal_settings = is_internal_expertgpt_url(base_url)

    # For internal Intel gateways, disable TLS verification to avoid cert chain issues.
    # Do not force proxy=None, so non-internal gateways can still use env proxy settings.
    http_client = httpx.Client(
        verify=False,
        trust_env=False,
        proxy=None
    )
    return Anthropic(
        auth_token=EXPERTGPT_TOKEN,
        http_client=http_client,
        base_url=base_url or None,
    )


def get_database_query_tool_definition() -> dict[str, Any]:
    return {
        "name": "database_query",
        "description": (
            "Query the Bluetooth test report database using ORM parameters. "
            "Use this function only when database information is required to answer the user. "
            "Critical rule: when user intent mentions failures/failed/失敗, filters MUST include "
            "{column:'result', operator:'eq', value:'Fail'}. "
            "When user intent mentions pass/passed/passes/通過/success, filters MUST include "
            "{column:'result', operator:'eq', value:'Pass'}. "
            "Do not use aliases like failure_count unless the Fail filter is present. "
            "Do not use aliases like pass_count unless the Pass filter is present."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "select_columns": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Columns to select from the report table. Null means all columns.",
                },
                "filters": {
                    "type": "array",
                    "description": (
                        "Filter rows before aggregation. For result column, use exact values 'Fail' or 'Pass'. "
                        "If the question mentions failures, include result='Fail'. "
                        "If the question mentions passes/success, include result='Pass'."
                    ),
                    "items": {
                        "type": "object",
                        "properties": {
                            "column": {"type": "string"},
                            "operator": {
                                "type": "string",
                                "enum": ["eq", "ne", "gt", "gte", "lt", "lte", "in", "like", "between"],
                            },
                            "value": {},
                            "values": {
                                "type": "array",
                            },
                        },
                        "required": ["column", "operator"],
                    },
                },
                "aggregations": {
                    "type": "array",
                    "description": "Aggregate functions for reporting, such as count, sum, avg, min, and max.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "function": {
                                "type": "string",
                                "enum": ["count", "sum", "avg", "min", "max"],
                            },
                            "column": {
                                "type": "string",
                                "description": "Target column name, or * for count over all rows.",
                            },
                            "alias": {
                                "type": "string",
                            },
                            "distinct": {
                                "type": "boolean",
                            },
                        },
                        "required": ["function", "column"],
                    },
                },
                "group_by": {
                    "type": "array",
                    "description": "Column names to group aggregated results by.",
                    "items": {"type": "string"},
                },
                "order_by": {
                    "type": "array",
                    "description": "Sort pairs like [['date', 'desc'], ['platform', 'asc']]. Can also sort by aggregation alias.",
                    "items": {
                        "type": "array",
                        "minItems": 2,
                        "maxItems": 2,
                        "items": {"type": "string"},
                    },
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum rows to return. Must be 100 or below.",
                },
            },
            "required": [],
        },
    }


def get_report_columns_description() -> str:
    columns = [column.name for column in models.Report.__table__.columns]
    return ", ".join(columns)


def get_system_prompt() -> str:
    columns_desc = get_report_columns_description()
    return f"""You are a helpful assistant for the BlueVision Bluetooth Dashboard.
You can directly answer normal product questions. When the user needs database facts, use the database_query tool.

Available report columns: {columns_desc}

Rules:
- Respond in the same language as the user.
- Use the database_query tool only when database data is needed.
- If you use the tool, return valid JSON function arguments only through the tool call.
- For reporting questions, prefer aggregations and group_by instead of fetching raw rows and counting in your head.
- Use count for questions about totals, frequencies, rankings, and top-N summaries.
- Intent binding is mandatory:
    - If question asks about failures/failed/failing/失敗, include filter result = 'Fail'.
    - If question asks about pass/passed/passes/success/通過, include filter result = 'Pass'.
    - Do not use labels such as failure_count, failed_platforms, or fail_rate unless result = 'Fail' is in filters.
    - Do not use labels such as pass_count, passed_platforms, or pass_rate unless result = 'Pass' is in filters.
- Before returning a tool call, run a self-check:
    1) Did I map question intent (failure/pass/all) correctly?
    2) Do my filters enforce that intent?
    3) If not, fix filters before sending tool arguments.
- Canonical examples:
    - "Which platform had the most failures since 2026?" => filters must include result='Fail' and date >= '2026-01-01'.
    - "Which platform had the most passes since 2026?" => filters must include result='Pass' and date >= '2026-01-01'.
    - "Which platform had the most cases since 2026?" => no result filter unless user explicitly asks Pass/Fail.
- Never invent database results.
- Keep answers concise and actionable.
- Do not render markdown tables. The frontend will render tables from structured query_results.
- For ranking outputs, provide concise plain-text bullets only.
"""


def strip_markdown_tables(text: str) -> str:
    """Remove markdown table blocks from model output.

    We keep plain-text narrative and rely on query_results for UI table rendering.
    """
    if not text:
        return text

    lines = text.splitlines()
    cleaned_lines: list[str] = []
    i = 0

    while i < len(lines):
        line = lines[i]
        if "|" in line and i + 1 < len(lines):
            separator = lines[i + 1].strip().replace(" ", "")
            if re.fullmatch(r"\|?[-:|]+\|?", separator):
                i += 2
                while i < len(lines) and "|" in lines[i]:
                    i += 1
                continue

        cleaned_lines.append(line)
        i += 1

    cleaned_text = "\n".join(cleaned_lines)
    cleaned_text = re.sub(r"\n{3,}", "\n\n", cleaned_text).strip()
    return cleaned_text


def extract_text_from_response_content(content: Any) -> str:
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        text_parts: list[str] = []
        for item in content:
            item_type = getattr(item, "type", None)
            item_text = getattr(item, "text", None)
            if item_type == "text" and item_text:
                text_parts.append(str(item_text))
        return "\n".join(part for part in text_parts if part).strip()

    return ""


def call_expertgpt_with_tools(
    messages: list[dict[str, Any]],
    tools: Optional[list[dict[str, Any]]] = None,
    temperature: float = 0,
    tool_choice: Any = None,
) -> tuple[str, Optional[dict[str, Any]], Optional[str]]:
    """Call Anthropic API and return (text, tool_args, tool_use_id)."""
    if not has_expertgpt_config():
        return "", None, None

    # Separate system message from conversation messages (Anthropic requires system as a top-level param)
    system_content = ""
    conv_messages: list[dict[str, Any]] = []
    for msg in messages:
        if msg["role"] == "system":
            system_content = msg["content"]
        else:
            conv_messages.append(msg)

    client = create_anthropic_client()
    try:
        request_payload: dict[str, Any] = {
            "model": DEFAULT_EXPERTGPT_MODEL,
            "messages": conv_messages,
            "temperature": temperature,
            "max_tokens": 1200,
        }
        if system_content:
            request_payload["system"] = system_content
        if tools:
            request_payload["tools"] = tools
            request_payload["tool_choice"] = (
                {"type": tool_choice} if isinstance(tool_choice, str) else (tool_choice or {"type": "auto"})
            )

        response = client.messages.create(**request_payload)

        tool_use_block = None
        text_parts: list[str] = []
        for block in response.content:
            if block.type == "tool_use":
                tool_use_block = block
            elif block.type == "text":
                text_parts.append(block.text)

        if tool_use_block:
            return "", tool_use_block.input, tool_use_block.id

        return "\n".join(text_parts).strip(), None, None
    except Exception as error:
        print(
            "Anthropic API error "
            f"base_url={get_expertgpt_base_url()} model={DEFAULT_EXPERTGPT_MODEL}: {error}"
        )
        return "", None, None
    finally:
        client.close()


def build_orm_query(db: Session, params: ORMQueryParams) -> list[dict[str, Any]]:
    selected_entities: list[Any] = []
    named_expressions: dict[str, Any] = {}

    def add_named_expression(name: str, expression: Any) -> None:
        if name not in named_expressions:
            named_expressions[name] = expression
            selected_entities.append(expression)

    if params.select_columns:
        for col_name in params.select_columns:
            column = getattr(models.Report, col_name, None)
            if column is None:
                continue
            add_named_expression(col_name, column.label(col_name))

    if params.group_by:
        for col_name in params.group_by:
            column = getattr(models.Report, col_name, None)
            if column is None:
                continue
            add_named_expression(col_name, column.label(col_name))

    if params.aggregations:
        for index, aggregation in enumerate(params.aggregations, start=1):
            alias = aggregation.alias or f"{aggregation.function}_{aggregation.column}_{index}"
            target_column = None if aggregation.column == "*" else getattr(models.Report, aggregation.column, None)

            if aggregation.function == "count":
                if aggregation.column == "*":
                    expression = func.count()
                elif target_column is not None and aggregation.distinct:
                    expression = func.count(target_column.distinct())
                elif target_column is not None:
                    expression = func.count(target_column)
                else:
                    continue
            else:
                if target_column is None:
                    continue
                if aggregation.function == "sum":
                    expression = func.sum(target_column)
                elif aggregation.function == "avg":
                    expression = func.avg(target_column)
                elif aggregation.function == "min":
                    expression = func.min(target_column)
                elif aggregation.function == "max":
                    expression = func.max(target_column)
                else:
                    continue

            add_named_expression(alias, expression.label(alias))

    uses_custom_projection = bool(selected_entities)
    query = db.query(*selected_entities) if uses_custom_projection else db.query(models.Report)

    if params.filters:
        for filter_cond in params.filters:
            column = getattr(models.Report, filter_cond.column, None)
            if column is None:
                continue

            if filter_cond.operator == "eq":
                query = query.filter(column == filter_cond.value)
            elif filter_cond.operator == "ne":
                query = query.filter(column != filter_cond.value)
            elif filter_cond.operator == "gt":
                query = query.filter(column > filter_cond.value)
            elif filter_cond.operator == "gte":
                query = query.filter(column >= filter_cond.value)
            elif filter_cond.operator == "lt":
                query = query.filter(column < filter_cond.value)
            elif filter_cond.operator == "lte":
                query = query.filter(column <= filter_cond.value)
            elif filter_cond.operator == "in" and filter_cond.values:
                query = query.filter(column.in_(filter_cond.values))
            elif filter_cond.operator == "like" and filter_cond.value is not None:
                query = query.filter(column.ilike(f"%{filter_cond.value}%"))
            elif filter_cond.operator == "between" and filter_cond.values and len(filter_cond.values) >= 2:
                query = query.filter(column.between(filter_cond.values[0], filter_cond.values[1]))

    if params.group_by:
        group_by_columns = []
        for col_name in params.group_by:
            column = getattr(models.Report, col_name, None)
            if column is not None:
                group_by_columns.append(column)
        if group_by_columns:
            query = query.group_by(*group_by_columns)

    if params.order_by:
        for col_name, direction in params.order_by:
            expression = named_expressions.get(col_name)
            if expression is None:
                expression = getattr(models.Report, col_name, None)
            if expression is None:
                continue
            query = query.order_by(expression.desc() if direction.lower() == "desc" else expression.asc())

    query = query.limit(min(params.limit or MAX_QUERY_ROWS, MAX_QUERY_ROWS))
    results = query.all()

    result_dicts: list[dict[str, Any]] = []
    for row in results:
        if uses_custom_projection:
            row_dict = dict(row._mapping)
        else:
            row_dict = {}
            for column in models.Report.__table__.columns:
                row_dict[column.name] = getattr(row, column.name)
        result_dicts.append(row_dict)

    return result_dicts


def format_query_results_for_prompt(results: list[dict[str, Any]], max_rows: int = SUMMARY_ROW_LIMIT) -> str:
    if not results:
        return "No data found for the query."

    display_results = results[:max_rows]
    formatted_lines = [f"Query returned {len(results)} rows."]
    for index, row in enumerate(display_results, start=1):
        formatted_lines.append(f"Row {index}:")
        for key, value in row.items():
            formatted_lines.append(f"  {key}: {value}")
    return "\n".join(formatted_lines)


def handle_chat_ask(
    payload: ChatAskRequest,
    db: Session,
    current_user: models.User,
) -> ChatAskResponse:
    trace_id = str(uuid4())

    if not has_expertgpt_config():
        return ChatAskResponse(
            answer="ExpertGPT service is not configured. Please contact administrator.",
            trace_id=trace_id,
        )

    messages: list[dict[str, Any]] = [{"role": "system", "content": get_system_prompt()}]
    for item in payload.history[-10:]:
        messages.append({"role": item.role, "content": item.content})
    messages.append({"role": "user", "content": payload.question})

    response_text, tool_params, tool_use_id = call_expertgpt_with_tools(
        messages=messages,
        tools=[get_database_query_tool_definition()],
        temperature=0,
        tool_choice="auto",
    )

    if tool_params is None:
        return ChatAskResponse(
            answer=response_text or "I'm unable to provide an answer at this time. Please try again.",
            has_database_query=False,
            trace_id=trace_id,
        )

    try:
        orm_params = ORMQueryParams(**tool_params)
    except Exception as error:
        print(f"Error parsing ORM parameters: {error}")
        return ChatAskResponse(
            answer=f"Error processing database query parameters: {error}",
            has_database_query=True,
            trace_id=trace_id,
        )

    try:
        query_results = build_orm_query(db, orm_params)
    except Exception as error:
        print(f"Error executing database query: {error}")
        return ChatAskResponse(
            answer=f"Error querying database: {error}",
            has_database_query=True,
            query_params=orm_params,
            trace_id=trace_id,
        )

    formatted_results = format_query_results_for_prompt(query_results)
    messages.append(
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": tool_use_id,
                    "name": "database_query",
                    "input": tool_params,
                }
            ],
        }
    )
    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool_use_id,
                    "content": (
                        "Use the tool result to answer in plain text. "
                        "Do not output markdown tables because frontend renders tables separately.\n\n"
                        f"{formatted_results}"
                    ),
                }
            ],
        }
    )

    final_answer, _, _ = call_expertgpt_with_tools(messages=messages, temperature=0)
    final_answer = strip_markdown_tables(final_answer)

    return ChatAskResponse(
        answer=final_answer or "Unable to generate answer from the retrieved data.",
        has_database_query=True,
        query_params=orm_params,
        query_results=query_results,
        trace_id=trace_id,
    )