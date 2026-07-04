import {useState} from "react";
import type {ChatMessage} from "../types/chat";
import {sendChatMessage} from "../Services/ChatService";

function ChatBox() {
  const [sessionId] = useState<string>(() => {
    const existing = localStorage.getItem("chat_session_id");
    if (existing) return existing;
    const generatedId = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("chat_session_id", generatedId);
    return generatedId;
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage({ message: userMessage.text, session_id: sessionId });
      setMessages((prev) => [...prev, { role: "bot", text: response.reply }]);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Unable to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginTop: "2rem", maxWidth: "720px" }}>
      <h2>Chatbot</h2>
      <div style={{ minHeight: "220px", background: "#f9f9f9", padding: "1rem", overflowY: "auto", maxHeight: "360px" }}>
        {messages.length === 0 ? (
          <p style={{ color: "#666" }}>Ask a question to start the chat.</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} style={{ marginBottom: "0.75rem" }}>
              <strong>{message.role === "user" ? "You" : "Bot"}:</strong>
              <div style={{ marginTop: "0.25rem", whiteSpace: "pre-wrap" }}>{message.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: "0.75rem 1rem", borderRadius: "6px", cursor: "pointer" }}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: "0.75rem" }}>{error}</div>}
    </div>
  );
}

export default ChatBox;
