import json
import os
import re
from typing import Any
from uuid import uuid4
from pathlib import Path
from urllib.parse import urlparse

import requests
import urllib3
from sqlalchemy import text
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app import models
from backend.app.schema_chat import ChatAskRequest, ChatAskResponse


LOCAL_ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=LOCAL_ENV_PATH, override=False)

MAX_QUERY_ROWS = 100
SUMMARY_ROW_LIMIT = 20
DEFAULT_EXPERTGPT_MODEL = os.getenv("EXPERTGPT_MODEL", "gpt-4o")
EXPERTGPT_TOKEN = os.getenv("EXPERTGPT_TOKEN", "")
EXPERTGPT_API_URL = os.getenv(
    "EXPERTGPT_API_URL",
    "https://expertgpt.intel.com/v1/chat/completions",
)
INTERNAL_EXPERTGPT_HOST = "expertgpt.intel.com"
FORBIDDEN_SQL_PATTERNS = [
    r";",
    r"--",
    r"/\*",
    r"\b(insert|update|delete|drop|alter|truncate|create|grant|revoke)\b",
]

SCHEMA_CONTEXT = """
Table: report
Columns:
- id (int): Primary key
- op_name (text): Operator name
- date (timestamp): Test date/time
- serial_num (text): Serial number
- platform_brand (text): Platform brand
- platform (text): Platform name
- platform_phase (text): Platform phase
- cpu (text): CPU model
- cpu_codename (text): CPU codename
- wlan (text): WLAN model
- scenario (text): Test scenario
- short_scenario (text): Short scenario name
- bt_driver (text): Bluetooth driver version
- wifi_driver (text): WiFi driver version
- urgent_level (text): Urgency level
- result (text): Pass/Fail result
- fail_cycles (text): Failed cycles
- cycles (text): Total cycles
- duration (text): Test duration
- sys_event_log (text): System event log
- comment (text): Additional comment
""".strip()

SQL_EXAMPLES = """
Example 1
Question: which platforms have the most failed reports?
Output: SELECT platform, COUNT(*) AS fail_count FROM report WHERE result = 'Fail' GROUP BY platform ORDER BY fail_count DESC LIMIT 5

Example 2
Question: How many reports were there last week?
Output: SELECT COUNT(*) AS total_reports FROM report WHERE date >= CURRENT_DATE - INTERVAL '7 days'

Example 3
Question: Show me all reports from Lunar Lake platform
Output: SELECT id, op_name, date, platform, result FROM report WHERE platform = 'Lunar Lake' ORDER BY date DESC LIMIT 100
""".strip()


def get_report_schema_description() -> str:
    columns = [column.name for column in models.Report.__table__.columns]
    return ", ".join(columns)


def has_expertgpt_config() -> bool:
    return bool(EXPERTGPT_TOKEN and EXPERTGPT_API_URL)


def is_internal_expertgpt_url(url: str) -> bool:
    return urlparse(url).hostname == INTERNAL_EXPERTGPT_HOST


def create_expertgpt_session() -> tuple[requests.Session, bool]:
    session = requests.Session()
    verify = True

    if is_internal_expertgpt_url(EXPERTGPT_API_URL):
        # Internal Intel endpoint works more reliably without inheriting proxy settings.
        session.trust_env = False
        verify = False
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    return session, verify


def extract_sql_from_response(content: str) -> str:
    cleaned = content.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z]*\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    return cleaned.strip().rstrip(";")


def extract_text_from_chat_response(payload: dict[str, Any]) -> str:
    choices = payload.get("choices") or []
    if not choices:
        return ""

    message = choices[0].get("message") or {}
    content = message.get("content", "")
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        text_parts = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                text_parts.append(item.get("text", ""))
        return "\n".join(part for part in text_parts if part).strip()

    return ""


def call_expertgpt(messages: list[dict[str, str]], temperature: float = 0) -> str:
    if not has_expertgpt_config():
        return ""

    session, verify = create_expertgpt_session()
    headers = {
        "Authorization": f"Bearer {EXPERTGPT_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": DEFAULT_EXPERTGPT_MODEL,
        "messages": messages,
        "temperature": temperature,
    }

    try:
        response = session.post(
            EXPERTGPT_API_URL,
            headers=headers,
            json=payload,
            timeout=20,
            verify=verify,
        )
        response.raise_for_status()
    except requests.RequestException:
        return ""

    try:
        return extract_text_from_chat_response(response.json())
    except (ValueError, TypeError):
        return ""


def normalize_sql(sql: str) -> str:
    return sql.strip()


def ensure_safe_select_sql(sql: str) -> str:
    normalized_sql = normalize_sql(sql)

    if not normalized_sql:
        return normalized_sql

    if not re.match(r"^select\b", normalized_sql, re.IGNORECASE):
        raise ValueError("Only SELECT SQL is allowed")

    for pattern in FORBIDDEN_SQL_PATTERNS:
        if re.search(pattern, normalized_sql, re.IGNORECASE):
            raise ValueError("Unsafe SQL detected")

    limit_match = re.search(r"\blimit\s+(\d+)\b", normalized_sql, re.IGNORECASE)
    if not limit_match:
        return f"{normalized_sql} LIMIT {MAX_QUERY_ROWS}"

    if int(limit_match.group(1)) > MAX_QUERY_ROWS:
        normalized_sql = re.sub(
            r"\blimit\s+\d+\b",
            f"LIMIT {MAX_QUERY_ROWS}",
            normalized_sql,
            count=1,
            flags=re.IGNORECASE,
        )

    return normalized_sql


def get_report_count(db: Session) -> int:
    return db.query(models.Report).count()


def build_sql_with_rules(question: str) -> str:
    normalized_question = question.strip().lower()
    if not normalized_question:
        return ""

    if any(keyword in normalized_question for keyword in ["count", "幾筆", "數量", "total"]):
        return "SELECT COUNT(*) AS total_reports FROM report"

    return (
        "SELECT id, op_name, date, platform, result "
        "FROM report "
        "ORDER BY date DESC "
        "LIMIT 5"
    )


def generate_sql_with_llm(question: str, history: list[dict[str, str]]) -> str:
    if not has_expertgpt_config():
        return ""

    schema_description = get_report_schema_description()
    history_text = "\n".join(
        f"{item['role']}: {item['content']}" for item in history[-10:]
    ) or "No prior history"
    system_prompt = (
        "You are a SQL expert for a Bluetooth issue dashboard. "
        "Generate exactly one PostgreSQL SELECT statement for the report table. "
        "Do not explain anything. Do not use markdown backticks. Do not return comments. "
        "Never return INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, CREATE, GRANT, or REVOKE. "
        "Keep LIMIT at 100 or below. If the question is unclear or unsupported, return an empty string.\n\n"
        f"{SCHEMA_CONTEXT}\n\n"
        f"Actual columns from ORM: {schema_description}\n\n"
        f"{SQL_EXAMPLES}"
    )
    user_prompt = (
        f"Conversation history:\n{history_text}\n\n"
        f"Question: {question}"
    )

    content = call_expertgpt(
        [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0,
    )
    return extract_sql_from_response(content)


def build_sql_from_question(question: str, history: list[dict[str, str]]) -> str:
    """Translate natural language into SQL with LLM first, then rule-based fallback."""
    llm_sql = generate_sql_with_llm(question, history)
    if llm_sql:
        return llm_sql

    return build_sql_with_rules(question)


def execute_sql_query(db: Session, sql: str) -> list[dict[str, Any]]:
    """Execute safe SELECT SQL and normalize rows into dicts.

    Empty SQL returns an empty list so the caller can decide the fallback behavior.
    """
    safe_sql = ensure_safe_select_sql(sql)
    if not safe_sql:
        return []

    result = db.execute(text(safe_sql))
    return [dict(row) for row in result.mappings().all()]


def summarize_with_rules(question: str, sql: str, rows: list[dict[str, Any]], total_reports: int) -> str:
    normalized_question = question.strip()

    if not sql:
        return f"NO SQL generated yet. There are {total_reports} reports in the database."

    if not rows:
        return "SQL executed, but no data found."

    if len(rows) == 1 and "total_reports" in rows[0]:
        return f"Currently, there are {rows[0]['total_reports']} reports in the database."

    return (
        f"Based on the question \"{normalized_question}\", {len(rows)} records were found."
        " The summary LLM is not yet integrated, so the raw query results are returned for frontend display."
    )


def generate_summary_with_llm(question: str, sql: str, rows: list[dict[str, Any]]) -> str:
    if not has_expertgpt_config():
        return ""

    summarized_rows = json.dumps(rows[:SUMMARY_ROW_LIMIT], ensure_ascii=False, default=str)
    content = call_expertgpt(
        [
            {
                "role": "system",
                "content": (
                    "You are a professional data analyst assistant. "
                    "Respond in the same language as the user's question (Traditional Chinese or English). "  # 🌟 修改這裡
                    "Use only the SQL result provided to answer. "
                    "If the data is insufficient, state that clearly in the response language."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"User question: {question}\n"
                    f"Executed SQL: {sql}\n"
                    f"Rows JSON: {summarized_rows}\n\n"
                    "Provide a concise summary of the data."
                ),
            },
        ],
        temperature=0.2,
    )

    return content.strip()


def summarize_with_llm(question: str, sql: str, rows: list[dict[str, Any]], total_reports: int) -> str:
    """Generate a user-facing answer with LLM first, then rule-based fallback."""
    if not sql or not rows:
        return summarize_with_rules(question, sql, rows, total_reports)

    llm_summary = generate_summary_with_llm(question, sql, rows)
    if llm_summary:
        return llm_summary

    return summarize_with_rules(question, sql, rows, total_reports)


def handle_chat_ask(
    payload: ChatAskRequest,
    db: Session,
    current_user: models.User | None = None,
) -> ChatAskResponse:
    history_items = [{"role": item.role, "content": item.content} for item in payload.history]

    # Placeholder hook for future permission/context enrichment.
    _ = current_user

    sql = build_sql_from_question(payload.question, history_items)
    total_reports = get_report_count(db)

    try:
        rows = execute_sql_query(db, sql)
        answer = summarize_with_llm(payload.question, sql, rows, total_reports)
    except ValueError as exc:
        rows = []
        answer = f"SQL validation failed: {exc}"
        sql = ""

    return ChatAskResponse(
        answer=answer,
        sql=sql,
        rows=rows,
        trace_id=str(uuid4()),
    )
