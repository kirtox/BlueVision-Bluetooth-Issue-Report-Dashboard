import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Button, Form, Spinner, Table } from "react-bootstrap";
import { chatServiceNew } from "@/services/chatService";
import { ChatMessageNew, ChatHistoryItem, ORMQueryParams } from "@/types";

const createMessage = (
  role: "user" | "assistant",
  content: string,
  has_database_query: boolean = false,
  query_params?: ORMQueryParams,
  query_results?: any[]
): ChatMessageNew => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
  has_database_query,
  query_params,
  query_results,
});

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const formatQueryParamsForDisplay = (params: ORMQueryParams): string => {
  const parts: string[] = [];

  if (params.select_columns && params.select_columns.length > 0) {
    parts.push(`Columns: ${params.select_columns.join(", ")}`);
  }

  if (params.filters && params.filters.length > 0) {
    const filterStrs = params.filters.map((f) => {
      if (f.operator === "in" && f.values) {
        return `${f.column} IN [${f.values.join(", ")}]`;
      } else if (f.operator === "between" && f.values) {
        return `${f.column} BETWEEN ${f.values[0]} AND ${f.values[1]}`;
      } else if (f.value !== undefined) {
        return `${f.column} ${f.operator} ${f.value}`;
      }
      return `${f.column} ${f.operator}`;
    });
    parts.push(`Filters: ${filterStrs.join(" AND ")}`);
  }

  if (params.aggregations && params.aggregations.length > 0) {
    const aggregationStrs = params.aggregations.map((aggregation) => {
      const distinctPrefix = aggregation.distinct ? "DISTINCT " : "";
      const aliasSuffix = aggregation.alias ? ` AS ${aggregation.alias}` : "";
      return `${aggregation.function.toUpperCase()}(${distinctPrefix}${aggregation.column})${aliasSuffix}`;
    });
    parts.push(`Aggregations: ${aggregationStrs.join(", ")}`);
  }

  if (params.group_by && params.group_by.length > 0) {
    parts.push(`Group By: ${params.group_by.join(", ")}`);
  }

  if (params.order_by && params.order_by.length > 0) {
    const orderStrs = params.order_by.map((o) => `${o[0]} ${o[1].toUpperCase()}`);
    parts.push(`Order: ${orderStrs.join(", ")}`);
  }

  if (params.limit) {
    parts.push(`Limit: ${params.limit}`);
  }

  return parts.join("\n");
};

const ChatAssistantNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageNew[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) {
      return;
    }

    const userMessage = createMessage("user", question);
    const nextHistory: ChatHistoryItem[] = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken") || undefined;
      const response = await chatServiceNew.askQuestion(
        {
          question,
          history: nextHistory,
        },
        token
      );

      const assistantText =
        response.answer || "No response currently, please try again later.";
      setMessages((prev) => [
        ...prev,
        {
          ...createMessage(
            "assistant",
            assistantText,
            response.has_database_query,
            response.query_params,
            response.query_results
          ),
          trace_id: response.trace_id,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Chat request failed";
      setError(message);
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          `System is temporarily unable to respond: ${message}`
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="light"
        className="btn-icon rounded-circle text-muted me-2"
        onClick={() => setIsOpen(true)}
        aria-label="Open advanced chat assistant"
      >
        <i className="fe fe-message-square"></i>
      </Button>

      {isOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.2, zIndex: 1040 }}
            onClick={() => setIsOpen(false)}
          />

          <aside
            className="position-fixed top-0 end-0 h-100 bg-white border-start shadow-lg d-flex flex-column"
            style={{ width: "min(420px, 100vw)", zIndex: 1050 }}
          >
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <div>
                <h5 className="mb-0">Chat Assistant (Advanced)</h5>
                <small className="text-muted">AI with database access</small>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat assistant"
              >
                <i className="fe fe-x"></i>
              </Button>
            </div>

            <div className="flex-grow-1 overflow-auto p-3 bg-light">
              {!hasMessages && (
                <div className="text-muted small">
                  Ask me questions about the dashboard data and I'll use database queries to find the
                  answers. Try: "Which platform had the most failures?"
                </div>
              )}

              {messages.map((message) => {
                const rowKeys =
                  message.query_results && message.query_results.length > 0
                    ? Object.keys(message.query_results[0])
                    : [];

                return (
                  <div
                    key={message.id}
                    className={`mb-3 d-flex ${
                      message.role === "user" ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-3 ${
                        message.role === "user" ? "bg-primary text-white" : "bg-white border"
                      }`}
                      style={{ maxWidth: "90%", whiteSpace: "pre-wrap" }}
                    >
                      <div>{message.content}</div>

                      {message.role === "assistant" && message.has_database_query && message.query_params && (
                        <div className="mt-3">
                          <div className="small text-muted mb-1">Query Parameters</div>
                          <pre className="small bg-light border rounded p-2 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                            {formatQueryParamsForDisplay(message.query_params)}
                          </pre>
                        </div>
                      )}

                      {message.role === "assistant" &&
                        message.query_results &&
                        message.query_results.length > 0 &&
                        rowKeys.length > 0 && (
                          <div className="mt-3">
                            <div className="small text-muted mb-1">
                              Results ({message.query_results.length} rows)
                            </div>
                            <div className="border rounded bg-white overflow-auto" style={{ maxHeight: "300px" }}>
                              <Table responsive size="sm" className="mb-0 align-middle">
                                <thead>
                                  <tr>
                                    {rowKeys.map((key) => (
                                      <th key={key} style={{ fontSize: "12px" }}>
                                        {key}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {message.query_results.map((row, index) => (
                                    <tr key={`${message.id}-${index}`}>
                                      {rowKeys.map((key) => (
                                        <td key={key} style={{ fontSize: "12px" }}>
                                          {formatCellValue(row[key])}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        )}

                      {message.role === "assistant" && message.trace_id && (
                        <div className="small text-muted mt-2">Trace ID: {message.trace_id}</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="d-flex align-items-center text-muted small">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Thinking and querying database...
                </div>
              )}

              {error && <div className="text-danger small mt-2">{error}</div>}
            </div>

            <div className="border-top p-3">
              <Form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  void handleSend();
                }}
              >
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ask a question about dashboard data..."
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-2">
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    Send
                  </Button>
                </div>
              </Form>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default ChatAssistantNew;
