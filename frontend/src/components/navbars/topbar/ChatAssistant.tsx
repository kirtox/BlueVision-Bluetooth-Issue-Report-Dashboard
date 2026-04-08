import { ChangeEvent, FormEvent, KeyboardEvent, useMemo, useState, useEffect, useRef } from "react";
import { Button, Form, Spinner, Table } from "react-bootstrap";
import { chatServiceNew } from "@/services/chatService";
import { ChatMessageNew, ChatHistoryItem, ORMQueryParams } from "@/types";
import ReactMarkdown from "react-markdown";

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
  const floatingButtonBottom = 30;
  const floatingButtonRight = 30;
  const floatingPanelBottom = 110;
  const floatingPanelTop = 56;
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageNew[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  // Auto-scroll to bottom when messages change or scroll down opens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: `${floatingButtonBottom + 12}px`,
          right: `${floatingButtonRight + 74}px`,
          zIndex: 1003,
          padding: "6px 12px",
          borderRadius: "999px",
          background: "rgba(28, 37, 65, 0.88)",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: isButtonHovered ? 1 : 0,
          transform: isButtonHovered ? "translateX(0) scale(1)" : "translateX(8px) scale(0.96)",
          transformOrigin: "right center",
          boxShadow: "0 10px 24px rgba(28, 37, 65, 0.24)",
          transition: "opacity 0.18s ease, transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {isOpen ? "Close Chatbot" : "Open Chatbot"}
      </div>

      {/* Floating Chat Button - Bottom Right (above Scroll Down button) */}
      <Button
        variant="primary"
        className="rounded-circle"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          setIsButtonHovered(true);
          e.currentTarget.style.transform = "translateY(-2px) scale(1.1)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(250, 160, 180, 0.6)";
        }}
        onMouseLeave={(e) => {
          setIsButtonHovered(false);
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(250, 160, 180, 0.4)";
        }}
        aria-label="Toggle chat assistant"
        aria-expanded={isOpen}
        title={isOpen ? "Close Chatbot" : "Open Chatbot"}
        style={{
          position: "fixed",
          bottom: `${floatingButtonBottom}px`,
          right: `${floatingButtonRight}px`,
          width: "56px",
          height: "56px",
          zIndex: 1002,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "0",
          background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
          boxShadow: "0 8px 25px rgba(250, 160, 180, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <i className={`fe ${isOpen ? "fe-x" : "fe-message-square"}`}></i>
      </Button>

      {/* Chat Window - Bottom Right Floating Panel (NO OVERLAY) */}
      <aside
        className="shadow-lg d-flex flex-column"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          bottom: `${floatingPanelBottom}px`,
          right: `${floatingButtonRight}px`,
          width: "min(440px, 92vw)",
          height: `min(700px, calc(100vh - ${floatingPanelTop + floatingPanelBottom}px))`,
          zIndex: 1001,
          borderRadius: "12px",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
          border: "2px solid rgba(99, 102, 241, 0.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          pointerEvents: isOpen ? "auto" : "none",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transform: isOpen
            ? "translateY(0) scale3d(1, 1, 1)"
            : "translateY(26px) scale3d(0.94, 0.78, 1)",
          transformOrigin: "bottom right",
          clipPath: isOpen
            ? "inset(0% 0% 0% 0% round 12px)"
            : "inset(88% 0% 0% 78% round 12px)",
          filter: isOpen ? "blur(0px)" : "blur(1.5px)",
          boxShadow: isOpen
            ? "0 24px 60px rgba(15, 23, 42, 0.24)"
            : "0 10px 24px rgba(15, 23, 42, 0.12)",
          transition:
            "opacity 0.28s ease, transform 0.52s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.52s cubic-bezier(0.16, 1, 0.3, 1), filter 0.42s ease, box-shadow 0.52s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.52s",
        }}
      >
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between p-3 border-bottom"
            style={{
              background: "linear-gradient(120deg, #eef2ff 0%, #e0e7ff 100%)",
              minHeight: "85px",
              borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <div>
              <h5 className="mb-0" style={{ fontSize: "1.06rem", fontWeight: 700 }}>
                Chat Assistant
              </h5>
              <small className="text-muted">AI with database access</small>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className="flex-grow-1 overflow-auto p-3"
            style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              background: "rgba(248, 250, 252, 0.78)",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(18px)",
              transition:
                "opacity 0.24s ease 0.12s, transform 0.44s cubic-bezier(0.16, 1, 0.3, 1) 0.08s",
            }}
          >
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
                      message.role === "user" ? "bg-primary text-white" : "text-dark border"
                    }`}
                    style={{
                      maxWidth: "85%",
                      wordWrap: "break-word",
                      background:
                        message.role === "user"
                          ? undefined
                          : "linear-gradient(180deg, #f7f9ff 0%, #eef3ff 100%)",
                      borderColor:
                        message.role === "user" ? undefined : "rgba(99, 102, 241, 0.2)",
                      boxShadow:
                        message.role === "user"
                          ? undefined
                          : "0 8px 18px rgba(99, 102, 241, 0.08)",
                    }}
                  >
                    {/* Markdown Rendering for Assistant Messages */}
                    {message.role === "assistant" ? (
                      <div style={{ fontSize: "14px" }}>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p style={{ marginBottom: "0.5rem", margin: "0" }}>{children}</p>,
                            ul: ({ children }) => <ul style={{ marginLeft: "1.5rem", marginBottom: "0.5rem" }}>{children}</ul>,
                            ol: ({ children }) => <ol style={{ marginLeft: "1.5rem", marginBottom: "0.5rem" }}>{children}</ol>,
                            li: ({ children }) => <li style={{ marginBottom: "0.25rem" }}>{children}</li>,
                            code: ({ children }) => (
                              <code style={{
                                backgroundColor: "rgba(0,0,0,0.1)",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                fontFamily: "monospace",
                              }}>
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre style={{
                                backgroundColor: "rgba(0,0,0,0.05)",
                                padding: "8px",
                                borderRadius: "4px",
                                overflow: "auto",
                                marginBottom: "0.5rem",
                              }}>
                                {children}
                              </pre>
                            ),
                            strong: ({ children }) => <strong>{children}</strong>,
                            em: ({ children }) => <em>{children}</em>,
                            blockquote: ({ children }) => (
                              <blockquote style={{
                                borderLeft: "3px solid #ccc",
                                paddingLeft: "10px",
                                marginLeft: "0",
                                fontStyle: "italic",
                              }}>
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div>{message.content}</div>
                    )}

                    {/* Query Parameters Display */}
                    {message.role === "assistant" && message.has_database_query && message.query_params && (
                      <div className="mt-3">
                        <div className="small text-muted mb-1">Query Parameters</div>
                        <pre
                          className="small bg-light border rounded p-2 mb-0"
                          style={{ whiteSpace: "pre-wrap", fontSize: "11px" }}
                        >
                          {formatQueryParamsForDisplay(message.query_params)}
                        </pre>
                      </div>
                    )}

                    {/* Query Results Table */}
                    {message.role === "assistant" &&
                      message.query_results &&
                      message.query_results.length > 0 &&
                      rowKeys.length > 0 && (
                        <div className="mt-3">
                          <div className="small text-muted mb-1">
                            Results ({message.query_results.length} rows)
                          </div>
                          <div
                            className="border rounded overflow-auto"
                            style={{
                              maxHeight: "250px",
                              background: "rgba(255, 255, 255, 0.72)",
                              borderColor: "rgba(99, 102, 241, 0.18)",
                            }}
                          >
                            <Table responsive size="sm" className="mb-0 align-middle">
                              <thead>
                                <tr>
                                  {rowKeys.map((key) => (
                                    <th key={key} style={{ fontSize: "11px" }}>
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {message.query_results.map((row, index) => (
                                  <tr key={`${message.id}-${index}`}>
                                    {rowKeys.map((key) => (
                                      <td key={key} style={{ fontSize: "11px" }}>
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

                    {/* Trace ID Display */}
                    {message.role === "assistant" && message.trace_id && (
                      <div className="small text-muted mt-2" style={{ fontSize: "10px" }}>
                        Trace ID: {message.trace_id}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="d-flex align-items-center text-muted small">
                <Spinner animation="border" size="sm" className="me-2" />
                Thinking and querying database...
              </div>
            )}

            {/* Error Display */}
            {error && <div className="text-danger small mt-2">{error}</div>}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-top p-3">
            <Form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                void handleSend();
              }}
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(12px)",
                transition:
                  "opacity 0.22s ease 0.14s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
              }}
            >
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  disabled={isLoading}
                  style={{ fontSize: "13px" }}
                />
              </Form.Group>
              <div className="d-flex justify-content-end mt-2 gap-2">
                <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
                  Send
                </Button>
              </div>
            </Form>
          </div>
      </aside>
    </>
  );
};

export default ChatAssistantNew;
