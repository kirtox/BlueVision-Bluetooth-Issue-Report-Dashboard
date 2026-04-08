# Chat System Enhancement - Function Calling Implementation

## Overview

The chatbot has been significantly enhanced to support **LLM function calling with database queries**. Instead of generating raw SQL, the system now uses a more sophisticated approach where ExpertGPT (Intel's LLM) can intelligently decide when to query the database and what parameters to use.

## Architecture

### System Flow

```
User Question
    ↓
First ExpertGPT Call (with tools definition)
    ↓
    ├─→ No database needed? → Return answer directly
    └─→ Database needed? → Extract ORM parameters
                            ↓
                        Build ORM Query
                            ↓
                        Execute Query
                            ↓
                        Second ExpertGPT Call (with data)
                            ↓
                        Return Final Answer
```

### Key Features

1. **Intelligent Tool Selection**: LLM decides when to call `database_query` function
2. **ORM-Based Queries**: No SQL injection - uses SQLAlchemy ORM parameter building
3. **Two-Stage Conversation**: 
   - First call: LLM analyzes question and calls tools if needed
   - Second call: LLM synthesizes answer using retrieved data
4. **Flexible Query Parameters**: Supports filtering, ordering, column selection, and limits

## Backend Components

### Files Added/Created

1. **`backend/app/schema_chat.py`**
   - New Pydantic models for enhanced chat
   - `ORMQueryParams`: ORM query parameters (filters, columns, ordering)
   - `ChatAskResponse`: Response structure with query metadata

2. **`backend/app/chat_service.py`**
   - Core service implementing function calling logic
   - `handle_chat_ask()`: Main handler
   - `build_orm_query()`: Converts ORM parameters to SQLAlchemy query
   - `call_expertgpt_with_tools()`: Communicates with ExpertGPT API with tool definitions

3. **`backend/app/main.py` (updated)**
   - New endpoint: `POST /chat/ask-new`
   - Imports for new chat service

### Endpoint

- **URL**: `/chat/ask-new`
- **Method**: `POST`
- **Auth**: Required (JWT token)
- **Request**:
  ```json
  {
    "question": "Which platforms have the most failed reports?",
    "history": [
      {"role": "user", "content": "..."},
      {"role": "assistant", "content": "..."}
    ]
  }
  ```

- **Response**:
  ```json
  {
    "answer": "Based on the data, Lunar Lake had 45 failures...",
    "has_database_query": true,
    "query_params": {
      "select_columns": ["platform", "result"],
      "filters": [{"column": "result", "operator": "eq", "value": "Fail"}],
      "order_by": [["platform", "desc"]],
      "limit": 100
    },
    "query_results": [
      {"platform": "Lunar Lake", "result": "Fail"},
      ...
    ],
    "trace_id": "uuid-string-for-debugging"
  }
```

## Frontend Components

### Files Added/Created

1. **`frontend/src/types.ts` (updated)**
   - New types: `ORMQueryParams`, `ChatAskResponse`, `ChatMessageNew`
   - Enhanced filter condition types

2. **`frontend/src/services/chatServiceNew.ts`**
   - Service to call `/chat/ask-new` endpoint
   - Handle response parsing and defaults

3. **`frontend/src/components/navbars/topbar/ChatAssistantNew.tsx`**
   - New React component for advanced chat UI
   - Displays query parameters and results
   - Shows "Thinking and querying database..." during processing

### UI Features

- **Separate Chat Panel**: New component for parallel usage with old chat
- **Query Transparency**: Shows ORM parameters used
- **Results Table**: Displays query results inline
- **Loading State**: Enhanced loading message indicating database queries

## ORM Query Parameter Schema

### Structure

```typescript
{
  "select_columns": ["column1", "column2"],        // null = all columns
  "filters": [
    {
      "column": "platform",
      "operator": "eq",                             // eq, ne, gt, gte, lt, lte, in, like, between
      "value": "Lunar Lake"                         // for single-value operators
    },
    {
      "column": "result",
      "operator": "in",
      "values": ["Fail", "Error"]                   // for multi-value operators
    },
    {
      "column": "date",
      "operator": "between",
      "values": ["2025-01-01", "2025-12-31"]        // for range operators
    }
  ],
  "order_by": [
    ["date", "desc"],                               // asc or desc
    ["platform", "asc"]
  ],
  "limit": 100                                      // max 100
}
```

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `platform = "Lunar Lake"` |
| `ne` | Not equal | `result != "Pass"` |
| `gt` | Greater than | `cycles > 100` |
| `gte` | Greater or equal | `cycles >= 100` |
| `lt` | Less than | `cycles < 50` |
| `lte` | Less or equal | `cycles <= 50` |
| `in` | In list | `result IN ["Fail", "Error"]` |
| `like` | Pattern match | `platform ILIKE "%Lake%"` |
| `between` | Range | `date BETWEEN x AND y` |

## Security Features

1. **ORM Safety**: SQLAlchemy prevents SQL injection
2. **Allowed Operations Only**: Only SELECT queries allowed
3. **Result Limit**: Maximum 100 rows per query
4. **Authentication**: Requires valid JWT token
5. **User Context**: Logged for audit trail

## Example User Interactions

### Example 1: Platform Failure Analysis
**User**: "Which platform had the most failures in the last 7 days?"

**LLM Generated Query**:
```json
{
  "select_columns": ["platform", "result"],
  "filters": [
    {"column": "result", "operator": "eq", "value": "Fail"},
    {"column": "date", "operator": "gte", "value": "2025-03-31"}
  ],
  "order_by": [["platform", "desc"]],
  "limit": 100
}
```

**LLM Answer**: "Based on the retrieved data, Lunar Lake platform had the most failures with 45 failed tests out of 150 total tests in the last 7 days, representing a 30% failure rate."

### Example 2: Simple Question (No Database Needed)
**User**: "What is the purpose of this dashboard?"

**LLM Response**: Direct answer without database query (has_database_query = false)

### Example 3: Multiple Filters
**User**: "Show me Lunar Lake WLAN6E tests that failed in the cold boot scenario"

**LLM Generated Query**:
```json
{
  "select_columns": ["date", "result", "scenario", "wlan"],
  "filters": [
    {"column": "platform", "operator": "eq", "value": "Lunar Lake"},
    {"column": "wlan", "operator": "like", "value": "WLAN6E"},
    {"column": "result", "operator": "eq", "value": "Fail"},
    {"column": "scenario", "operator": "like", "value": "cold boot"}
  ],
  "order_by": [["date", "desc"]],
  "limit": 50
}
```

## Integration Notes

### Existing Chat System
- Old chat system (`/chat/ask`) remains unchanged and available
- Both can coexist - users choose which to use
- Frontend can display both chat buttons in header

### Database Compatibility
- Works with existing `Report` table
- No schema changes required
- All 60+ columns available for querying

### LLM Model Switching
- Currently uses `gpt-4o` (configurable via `EXPERTGPT_MODEL` env var)
- Can switch models by updating environment variable

## Testing the Implementation

### Backend Test
```bash
curl -X POST http://localhost:8000/chat/ask-new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "question": "How many reports are there?",
    "history": []
  }'
```

### Frontend Test
1. Import `ChatAssistantNew` component in Header
2. Add to navbar: `<ChatAssistantNew />`
3. Click new chat button
4. Ask a question about the data

## Troubleshooting

### LLM Not Calling Database Function
- Check ExpertGPT configuration (token, URL)
- Verify question requires data (sometimes direct answers don't need queries)
- Check error logs for API failures

### Query Returns No Results
- Verify column names match database schema
- Check filter values exist in database
- Try broader filters or different date ranges

### Response Takes Too Long
- Check database performance
- Reduce result limit in parameters
- Verify network connectivity to ExpertGPT API

## Configuration

### Environment Variables

```bash
# Backend
EXPERTGPT_TOKEN=your_token_here
EXPERTGPT_API_URL=https://expertgpt.intel.com/v1/chat/completions
EXPERTGPT_MODEL=gpt-4o

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

## Future Enhancements

- [ ] Persistent chat history storage
- [ ] User-specific result filtering
- [ ] Advanced aggregation functions (COUNT, AVG, MIN, MAX)
- [ ] Multi-table joins
- [ ] Query result caching
- [ ] Advanced permission controls per user role
