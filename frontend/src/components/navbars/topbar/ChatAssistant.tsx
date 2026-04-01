import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Button, Form, Spinner, Table } from "react-bootstrap";
import { chatService } from "@/services/chatService";
import { ChatMessage } from "@/types";

const createMessage = (role: "user" | "assistant", content: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
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

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) {
      return;
    }

    const userMessage = createMessage("user", question);
    const nextHistory = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken") || undefined;
      const response = await chatService.askQuestion({
        question,
        history: nextHistory,
      }, token);

      const assistantText = response.answer || "no response currently, please try again later.";
      setMessages((prev) => [
        ...prev,
        {
          ...createMessage("assistant", assistantText),
          sql: response.sql,
          rows: response.rows,
          trace_id: response.trace_id,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Chat request failed";
      setError(message);
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", `System is temporarily unable to respond: ${message}`),
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
        aria-label="Open chat assistant"
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
                <h5 className="mb-0">Chat Assistant</h5>
                <small className="text-muted">Ask data questions in natural language</small>
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
                  Try asking me: "What platform had the highest failure rate in the last 7 days?"
                </div>
              )}

              {messages.map((message) => {
                const rowKeys = message.rows && message.rows.length > 0 ? Object.keys(message.rows[0]) : [];

                return (
                  <div
                    key={message.id}
                    className={`mb-3 d-flex ${message.role === "user" ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div
                      className={`px-3 py-2 rounded-3 ${
                        message.role === "user" ? "bg-primary text-white" : "bg-white border"
                      }`}
                      style={{ maxWidth: "90%", whiteSpace: "pre-wrap" }}
                    >
                      <div>{message.content}</div>

                      {message.role === "assistant" && message.sql && (
                        <div className="mt-3">
                          <div className="small text-muted mb-1">SQL</div>
                          <pre className="small bg-light border rounded p-2 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                            {message.sql}
                          </pre>
                        </div>
                      )}

                      {message.role === "assistant" && message.rows && message.rows.length > 0 && rowKeys.length > 0 && (
                        <div className="mt-3">
                          <div className="small text-muted mb-1">Rows</div>
                          <div className="border rounded bg-white overflow-auto">
                            <Table responsive size="sm" className="mb-0 align-middle">
                              <thead>
                                <tr>
                                  {rowKeys.map((key) => (
                                    <th key={key}>{key}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {message.rows.map((row, index) => (
                                  <tr key={`${message.id}-${index}`}>
                                    {rowKeys.map((key) => (
                                      <td key={key}>{formatCellValue(row[key])}</td>
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
                  Thinking...
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

export default ChatAssistant;
