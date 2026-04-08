import { ChatAskRequest, ChatAskResponse } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const chatService = {
  async askQuestion(payload: ChatAskRequest, token?: string): Promise<ChatAskResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = "Failed to ask chat API";

      try {
        const parsed = JSON.parse(errorText);
        message = parsed.detail || message;
      } catch {
        if (errorText) {
          message = errorText;
        }
      }

      throw new Error(message);
    }

    const data = (await response.json()) as Partial<ChatAskResponse>;

    return {
      answer: data.answer || "",
      sql: data.sql || "",
      rows: Array.isArray(data.rows) ? data.rows : [],
      trace_id: data.trace_id,
    };
  },
};